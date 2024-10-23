import type knex from 'knex'
import * as RecommendRepository from '../repository/recommend'
import { textToVector } from '../utils/vector'

export const recommendTitles = async (db: knex.Knex, context: string): Promise<string[]> => {
  const docVector: number[] = await textToVector(context)
  return await RecommendRepository.getRecommendTitles(db, docVector)
}
