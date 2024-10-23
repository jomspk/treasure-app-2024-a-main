const topicTitles = [
  "何を知りたいのか",
  "何をしたのか",
  "実行環境",
  "エラーメッセージ",
];
export const initialTopics = topicTitles.map((topic) => ({
  title: topic,
  description: "",
  isDefaultTopic: true,
}));
