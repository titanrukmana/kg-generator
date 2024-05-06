import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { LlmsService } from './llms.service';

@Controller('llms')
export class LlmsController {
  constructor(private readonly llmsService: LlmsService) {}

  @Post()
  answer(@Body() body: { prompt: string }) {
    return this.llmsService.fetchAnswer(body.prompt);
  }

  @Put()
  upsert(@Body() body: { content: string }) {
    return this.llmsService.upsertKnowledgeGraph(body.content);
  }

  @Get()
  graph() {
    return this.llmsService.getGraph();
  }
}
