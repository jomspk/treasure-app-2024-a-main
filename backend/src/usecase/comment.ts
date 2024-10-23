import assert from 'assert'
import type knex from 'knex'
import type { QuestionCommentType, TopicCommentType } from '../model/comment'
import * as Repository from '../repository/comment'

export const createTopicComment = async (
  db: knex.Knex,
  comment: Pick<TopicCommentType, 'content' | 'topicId' | 'type' | 'userId'>
): Promise<TopicCommentType> => {
  // TODO: ここでtopicの存在チェックを行う
  const commentId = await Repository.createTopicComment(db, comment)
  const createdComment = await Repository.getTopicComment(db, commentId)
  assert(createdComment, 'コメントが作成されている')
  return createdComment
}

export const createQuestionComment = async (
  db: knex.Knex,
  comment: Pick<QuestionCommentType, 'content' | 'questionId' | 'type' | 'userId'>
): Promise<QuestionCommentType> => {
  // TODO: ここでquestionの存在チェックを行う
  const commentId = await Repository.createQuestionComment(db, comment)
  const createdComment = await Repository.getQuestionComment(db, commentId)
  assert(createdComment, 'コメントが作成されている')
  return createdComment
}
