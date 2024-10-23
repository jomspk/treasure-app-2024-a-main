import type { components } from '../openapi/schema'

// backendで使うCommentの形式を定義。今はopenAPIの型をそのまま使っている。
export type TopicCommentType = components['schemas']['TopicComment']
export type QuestionCommentType = components['schemas']['QuestionComment']
