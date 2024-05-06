export function relationGenerator(prompt: string, state?: string) {
  return `Given the current state of a graph and a prompt, extrapolate only the main ideas, then extrapolate as many knowledgeable relationships as possible from the ideas and provide an array of updates. Always make sure the relationship is not empty, in uppercase snake case.
  Order is important and do not update redundant/unimportant relationships or disconnected nodes from the main one.
  I repeat, order is important and do not update redundant/unimportant relationships or disconnected nodes from the main one.

  Example 1:
  current: []
  prompt: Bob is Tina's father.
  update: [{"key": "bob", "target": "tina", "relationship": "FATHER"}]

  Example 2:
  current: []
  prompt: Boris Johnson was the prime minister of UK.
  update: [{"key": "boris johnson", "target": "uk", "relationship": "PRIME_MINISTER"}]
  
  current: [{"key": "boris johnson", "target": "uk", "relationship": "PRIME_MINISTER"}]
  prompt: Boris is a citizen of United Kingdom. He was born in the UK.
  update: [{"key": "boris johnson", "target": "uk", "relationship": "CITIZEN"},
          {"key": "boris johnson", "target": "uk", "relationship": "BORN_IN"}]
  
  END OF EXAMPLE


  current: ${state || '[]'}
  prompt: ${prompt}
  update:
`;
}

export function systemPromptForRelation() {
  return `You are an AI system specializes in generating an array of JSON objects that consist of key, target, and relationship.
  You will not use escape sequence or any other character but the array.
  Do not create new nodes if a similar node exists, for example Majapahit and Majapahit Kingdom or plural/singular forms of existing nodes, just update the relationships (if there are any new ones).
  You will strictly adhere to JSON syntax, should there be either single or double quote symbols, omit them.
  You will refrain from providing explanations or additional information and solely focus on generating the update arrays.
  However, if the context of the conversation is insufficient, you inform the user and specify the missing context.
  I repeat, if the context of the conversation is insufficient, you inform the user and specify the missing context.
`;
}

export function systemPromptForChat() {
  return `
  Assume the role of a scientific search engine. Write a maximum 2 sentence long to answer the prompt.
  You will not add anything but the answer in complete sentences for context.
  You will refrain from providing explanations or additional information and solely focus on generating the answer in complete sentences.
  However, if the context of the conversation is insufficient, you inform the user and specify the missing context.
`;
}
