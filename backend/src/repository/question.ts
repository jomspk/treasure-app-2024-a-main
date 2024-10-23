import type knex from 'knex'
import type { ResultRow } from '../database/database'
import type { Question, Tag, Topic } from '../model/question'

const formatQuestion = (question: ResultRow): Question => ({
  id: question.id,
  summary: question.summary,
  docVector: JSON.parse(question.doc_vector),
  createdAt: question.created_at,
  userId: question.user_uuid,
  tags: question.tags.map((tag: ResultRow) => {
    return {
      id: tag.id,
      name: tag.name,
    }
  }),
  topics: question.topics.map((topic: ResultRow) => {
    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      isDefaultTopic: topic.is_default_topic,
      comments: topic.comments.map((comment: ResultRow) => {
        return {
          id: comment.id,
          userId: comment.user_uuid,
          type: comment.type,
          content: comment.content,
          createdAt: comment.created_at,
        }
      }),
      createdAt: topic.created_at,
    }
  }),
  comments: question.comments.map((comment: ResultRow) => {
    return {
      id: comment.id,
      userId: comment.user_uuid,
      type: comment.type,
      content: comment.content,
      createdAt: comment.created_at,
    }
  }),
  finishedAt: question.finished_at,
})

export const getQuestion = async (db: knex.Knex, questionId: string) => {
  const question: ResultRow | undefined = await db('questions')
    .select('*')
    .where('id', questionId)
    .first()

  if (!question) {
    throw new Error('Question not found')
  }

  // 並列でcomments, tags, topicsを取得
  await Promise.all([
    db('question_comments')
      .select('*')
      .where('question_id', questionId)
      .then((comments) => {
        question.comments = comments
      }),
    db('tags')
      .select('tags.*')
      .join('question_tags', 'tags.id', 'question_tags.tag_id')
      .where('question_tags.question_id', questionId)
      .then((tags) => {
        question.tags = tags
      }),
    db('topics')
      .select('*')
      .where('question_id', questionId)
      .then((topics) => {
        question.topics = topics
      }),
  ])

  // 各topicのcommentを取得
  await Promise.all(
    (question.topics as ResultRow[]).map((topic, index) =>
      db('topic_comments')
        .select('*')
        .where('topic_id', topic.id)
        .then((comments) => {
          question.topics[index].comments = comments || []
        })
    )
  )

  return formatQuestion(question)
}

export const createQuestion = async (
  db: knex.Knex,
  userId: string,
  tags: Tag[],
  topics: Topic[],
  summary: string,
  vector: number[]
): Promise<Question> => {
  return db.transaction(async (trx) => {
    try {
      const stringVec = JSON.stringify(vector)
      const [result] = await trx('questions')
        .insert({
          user_uuid: userId,
          summary: summary,
          doc_vector: stringVec,
        })
        .returning('id')

      if (tags.length > 0) {
        const tagIds = await Promise.all(
          tags.map(async (tag) => {
            const [existingTag] = await trx('tags').select('id').where('name', tag.name)

            if (existingTag) {
              return existingTag.id
            } else {
              const [newTagId] = await trx('tags').insert({ name: tag.name }).returning('id')
              return newTagId
            }
          })
        )

        await trx('question_tags').insert(
          tagIds.map((tagId) => ({
            question_id: result.id,
            tag_id: tagId,
          }))
        )
      }

      await Promise.all(
        topics.map(async (topic) => {
          await trx('topics')
            .insert({
              title: topic.title,
              description: topic.description,
              is_default_topic: topic.isDefaultTopic,
              question_id: result.id,
            })
            .returning('id')
        })
      )

      const [question] = await trx('questions').select('*').where('id', result.id)

      return question
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  })
}

type ResolveSuccess = {
  type: 'resolved'
  targetId: string
}

type ResolveFailed = {
  type: 'failed'
  targetId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
}

export type ResolveResult = ResolveSuccess | ResolveFailed

export const resolveQuestion = async (
  db: knex.Knex,
  questionId: string
): Promise<ResolveResult> => {
  try {
    const res = await db
      .update({ finished_at: new Date() })
      .from('questions')
      .where({ id: questionId })
      .returning('id')
    const id = res[0]['id']

    return {
      type: 'resolved',
      targetId: id,
    }
  } catch (error) {
    return {
      type: 'failed',
      targetId: questionId,
      error: error,
    }
  }
}
