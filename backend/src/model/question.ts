export interface Question {
  id: string
  userId: string
  summary: string
  finishedAt: Date
  docVector: number[]
  tags: Tag[]
  topics: Topic[]
  comments: Comment[]
  createdAt: Date
}

export interface Tag {
  id: string
  name: string
}

export interface Topic {
  id: string
  questionId?: string
  title: string
  description: string
  isDefaultTopic: boolean
  comments: TopicComment[]
  createdAt: Date
}

export interface Comment {
  id: string
  questionId: string
  userId: string
  type: 'suggest' | 'question' | 'answer'
  content: string
  createdAt: Date
}

export interface TopicComment {
  id: string
  topicId: string
  userId: string
  type: 'suggest' | 'question' | 'answer'
  content: string
  createdAt: Date
}
