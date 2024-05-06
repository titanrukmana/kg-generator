import { AzureKeyCredential, OpenAIClient } from '@azure/openai';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { auth, driver } from 'neo4j-driver';
import {
  relationGenerator,
  systemPromptForChat,
  systemPromptForRelation,
} from 'src/utils/prompt.template';

@Injectable()
export class LlmsService {
  private openAIClient = new OpenAIClient(
    process.env.AZURE_API_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_API_KEY),
    {
      apiVersion: '2023-05-15',
    },
  );
  private readonly deploymentName = 'gpt-35-turbo-16k';

  private drvr = driver(
    process.env.NEO4J_URI,
    auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
    {
      disableLosslessIntegers: true,
    },
  );

  async fetchAnswer(prompt: string): Promise<string> {
    const result = await this.openAIClient.getChatCompletions(
      this.deploymentName,
      [
        {
          role: 'system',
          content: systemPromptForChat(),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    );

    return result.choices[0].message.content;
  }

  async getGraph() {
    const session = this.drvr.session({
      database: process.env.NEO4J_DATABASE,
    });
    try {
      const result: any = {};

      const resp = await session.run(
        `
        MATCH (n)
        OPTIONAL MATCH (n)-[r]-()
        WITH n, count(r) as degreeCentrality

        WITH COLLECT({ id: id(n), name: n.name, centrality: degreeCentrality }) AS nodes

        MATCH ()-[r]->()
        WITH nodes, COLLECT({ id: id(r), type: type(r), start: id(startNode(r)), end: id(endNode(r)) }) AS relationships

        RETURN nodes, relationships;
        `,
      );

      resp.records.forEach((record) => {
        result.nodes = record.get('nodes');
        result.relationships = record.get('relationships');
      });

      return result;
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.close();
    }
  }

  async upsertKnowledgeGraph(content: string) {
    const session = this.drvr.session({
      database: process.env.NEO4J_DATABASE,
    });
    try {
      const records = [];

      session
        .run(
          `
          Match (n)-[r]->(m)
          Return { key: n.name, target: m.name, relationship: type(r) }
          `,
        )
        .then((res) => {
          res.records.forEach((record) => {
            records.push(record.toObject);
          });
        });

      const completion = await this.openAIClient.getChatCompletions(
        this.deploymentName,
        [
          {
            role: 'system',
            content: systemPromptForRelation(),
          },
          {
            role: 'user',
            content: relationGenerator(content, JSON.stringify(records)),
          },
        ],
      );

      const relationships: {
        key: string;
        target: string;
        relationship: string;
      }[] = JSON.parse(completion.choices[0].message.content);

      await session.executeWrite(async (tx) => {
        for (const { key, target, relationship } of relationships) {
          const cypherCreateNode = `
          MERGE (n:Node {name: "${key}"})
          RETURN n
        `;

          const cypherCreateTargetNode = `
          MERGE (m:Node {name: "${target}"})
          RETURN m
        `;

          const cypherCreateRelationship = `
          MATCH (n:Node {name: "${key}"}), (m:Node {name: "${target}"})
          MERGE (n)-[:${relationship}]->(m)
          RETURN n, m
        `;

          const createNodeResult = await tx.run(cypherCreateNode);
          const createTargetNodeResult = await tx.run(cypherCreateTargetNode);

          if (
            createNodeResult.records.length > 0 &&
            createTargetNodeResult.records.length > 0
          ) {
            await tx.run(cypherCreateRelationship);
          }
        }
      });

      const result = this.getGraph();

      return result;
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.close();
    }
  }
}
