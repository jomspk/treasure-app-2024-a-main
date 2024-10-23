import type { Comment, Question, Topic, TopicComment } from '../model/question'
import type { components as OpenAPIComponent } from '../openapi/schema'

type OpenAPIQuestion = OpenAPIComponent['schemas']['Question']
type OpenAPITopic = OpenAPIComponent['schemas']['Topic']
type OpenAPIComment = OpenAPIComponent['schemas']['QuestionComment']
type OpenAPITopicComment = OpenAPIComponent['schemas']['TopicComment']

export const convertTopicToAPI = (modelTopic: Topic): OpenAPITopic => {
  return {
    id: modelTopic.id,
    questionId: modelTopic.questionId,
    title: modelTopic.title,
    description: modelTopic.description,
    isDefaultTopic: modelTopic.isDefaultTopic,
    comments: modelTopic.comments.map((comment) => convertTopicCommentToAPI(comment)),
    createdAt: modelTopic.createdAt.toDateString(),
  }
}

export const convertCommentToAPI = (modelComment: Comment): OpenAPIComment => {
  return {
    id: modelComment.id,
    questionId: modelComment.questionId,
    userId: modelComment.userId,
    type: modelComment.type,
    content: modelComment.content,
    createdAt: modelComment.createdAt.toDateString(),
  }
}

export const convertTopicCommentToAPI = (modelTopicComment: TopicComment): OpenAPITopicComment => {
  return {
    id: modelTopicComment.id,
    topicId: modelTopicComment.topicId,
    userId: modelTopicComment.userId,
    type: modelTopicComment.type,
    content: modelTopicComment.content,
    createdAt: modelTopicComment.createdAt.toDateString(),
  }
}

export const convertQuestionToAPI = (modelQuestion: Question): OpenAPIQuestion => {
  return {
    id: modelQuestion.id,
    summary: modelQuestion.summary,
    userId: modelQuestion.userId,
    finishedAt: modelQuestion.finishedAt ? modelQuestion.finishedAt.toDateString() : undefined,
    docVector: modelQuestion.docVector,
    tags: modelQuestion.tags,
    topics: modelQuestion.topics.map((topic) => convertTopicToAPI(topic)),
    comments: modelQuestion.comments.map((comment) => convertCommentToAPI(comment)),
    createdAt: modelQuestion.createdAt.toDateString(),
  }
}
