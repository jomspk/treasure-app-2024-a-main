import OpenAI from 'openai'
import type { Topic } from '../model/question'

const apiKey: string = process.env.OPENAI_API_KEY || ''

const openai = new OpenAI({
  apiKey: apiKey,
})

export async function topicsToVector(topics: Topic[]) {
  if (!topics) {
    throw new Error('The "context" parameter is required and cannot be null.')
  }

  let context: string = ''

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    context = context + topic.title + topic.description
  }

  return textToVector(context)
}

export async function textToVector(context: string) {
  if (!context) {
    throw new Error('The "topics" parameter is required and cannot be null.')
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'あなたは要点をまとめて説明することが得意な優秀なエンジニアです。あなたに伝える質問の文章をOpenAIのembeddingのAPIを使用して文書ベクトルに変換するために、文章からノイズになりそうな部分を取り除いてください。',
        },
        {
          role: 'user',
          content: context,
        },
      ],
    })

    const summarizeText = completion.choices[0].message.content
    if (!summarizeText) {
      throw new Error('Failed to summarize text')
    }

    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: summarizeText,
      encoding_format: 'float',
    })

    return embedding.data[0].embedding
  } catch (error) {
    throw new Error(`Failed to covert: ${error}`)
  }
}
