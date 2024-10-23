import OpenAI from 'openai'
import type { Topic } from '../model/question'

const apiKey: string = process.env.OPENAI_API_KEY || ''

const openai = new OpenAI({
  apiKey: apiKey,
})

export async function summarizeText(topics: Topic[]) {
  if (!topics) {
    throw new Error('The "topics" parameter is required and cannot be null.')
  }

  let context: string = ''

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    context = context + topic.title + topic.description
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'あなたは要点をまとめて説明することが得意な優秀なエンジニアです。以下の質問を、何をしたいのか、何で困っているのかについて10文字要約してください。',
        },
        {
          role: 'user',
          content: context,
        },
      ],
    })

    return completion.choices[0].message.content || ''
  } catch (error) {
    throw new Error(`Failed to summarize text: ${error}`)
  }
}
