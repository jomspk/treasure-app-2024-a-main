import type { Logger } from 'winston'
import type { User } from './model/user'

export type Variables = {
  firebaseUserId: string | null
  currentUser: User | null
  logger: Logger
}
