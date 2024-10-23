import assert from 'assert'
import type knex from 'knex'
import { NotFoundError } from '../errors'
import type { Question, Tag, Topic } from '../model/question'
import type { ResolveResult } from '../repository/question'
import * as Repository from '../repository/question'
import { summarizeText } from '../utils/summary'
import { topicsToVector } from '../utils/vector'

export const getQuestion = async (db: knex.Knex, questionId: string): Promise<Question> => {
  const question = await Repository.getQuestion(db, questionId)
  if (!question) {
    throw new NotFoundError('error')
  }
  return question
}

export const createQuestion = async (
  db: knex.Knex,
  userId: string,
  tags: Tag[],
  topics: Topic[]
): Promise<Question> => {
  const [summary, docVector] = await Promise.all([summarizeText(topics), topicsToVector(topics)])

  const question = await Repository.createQuestion(db, userId, tags, topics, summary, docVector)
  assert(question, '質問が作成されている')

  return question
}

export const resolveQuestion = async (
  db: knex.Knex,
  questionId: string
): Promise<ResolveResult> => {
  const result = await Repository.resolveQuestion(db, questionId)
  if (!result) {
    throw new NotFoundError('error')
  }
  if (result.type === 'failed') {
    throw new Error(result.error)
  }

  return result
}
