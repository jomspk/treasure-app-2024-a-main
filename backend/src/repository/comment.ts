import { assert } from 'console'
import type knex from 'knex'
import type { ResultRow } from '../database/database'
import type { QuestionCommentType, TopicCommentType } from '../model/comment'

export const getTopicComment = async (db: knex.Knex, commentId: string) => {
  const comment: ResultRow | undefined = await db
    .select('*') // formatColumnNames(columns)による変換は使わない（user_uuid -> userIdの変換が対応できないため）
    .from('topic_comments')
    .where('id', commentId)
    .first()
  if (!comment) {
    return undefined
  }

  // 手動でプロパティ名を変換
  // MEMO: ここで各プロパティの型をvalidateしてもいいかも
  const formattedComment: TopicCommentType = {
    id: comment.id,
    content: comment.content,
    topicId: comment.topic_id,
    type: comment.type,
    userId: comment.user_uuid,
    createdAt: comment.created_at,
  }

  return formattedComment
}

export const createTopicComment = async (
  db: knex.Knex,
  comment: Pick<TopicCommentType, 'content' | 'topicId' | 'type' | 'userId'>
) => {
  const res = await db
    .insert([
      {
        content: comment.content,
        topic_id: comment.topicId,
        type: comment.type,
        user_uuid: comment.userId,
      },
    ])
    .into('topic_comments')
    .returning('id')
  assert(res.length === 1, '作成したコメントのidが返される')
  const commentId = res[0]['id']
  assert(typeof commentId === 'string', 'コメントが作成されて返されるidはstring型である')
  return commentId
}

export const getQuestionComment = async (db: knex.Knex, commentId: string) => {
  const comment: ResultRow | undefined = await db
    .select('*')
    .from('question_comments')
    .where('id', commentId)
    .first()

  if (!comment) {
    return undefined
  }

  const formattedComment: QuestionCommentType = {
    id: comment.id,
    content: comment.content,
    questionId: comment.question_id,
    type: comment.type,
    userId: comment.user_uuid,
    createdAt: comment.created_at,
  }

  return formattedComment
}

export const createQuestionComment = async (
  db: knex.Knex,
  comment: Pick<QuestionCommentType, 'content' | 'questionId' | 'type' | 'userId'>
) => {
  const res = await db
    .insert([
      {
        content: comment.content,
        question_id: comment.questionId,
        type: comment.type,
        user_uuid: comment.userId,
      },
    ])
    .into('question_comments')
    .returning('id')
  assert(res.length === 1, '作成したコメントのidが返される')
  const commentId = res[0]['id']
  assert(typeof commentId === 'string', 'コメントが作成されて返されるidはstring型である')
  return commentId
}
