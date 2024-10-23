type Topic = {
  title: string;
  description: string;
  isDefaultTopic: boolean;
};

export function convertToString(topics: Topic[]) {
  let context: string = "";

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    context = context + topic.title + topic.description;
  }

  return context;
}
