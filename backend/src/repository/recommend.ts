import type knex from 'knex'

export const getRecommendTitles = async (db: knex.Knex, docVector: number[]): Promise<string[]> => {
  const vectorString = JSON.stringify(docVector)

  try {
    const recommendTitles = await db('topic_comments as tc')
      .select('tc.content as title')
      .join(
        db
          .select('t.id as topic_id')
          .select('t.question_id as question_id')
          .select(db.raw('(q.doc_vector <#> ?) * -1 as inner_product', [vectorString]))
          .from('topics as t')
          .join('questions as q', 't.question_id', 'q.id')
          .orderBy('inner_product', 'desc')
          .as('ranked_topics'),
        'tc.topic_id',
        '=',
        'ranked_topics.topic_id'
      )
      .where('tc.type', 'question')
      .orderBy('ranked_topics.inner_product', 'desc')
      .limit(10)

    return recommendTitles.map((row) => row.title)
  } catch (error) {
    console.error('クエリ実行エラー', error)
    throw error
  }
}
