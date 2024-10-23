import { createMiddleware } from 'hono/factory'
import { db } from '../database/database'
import { getUserByFirebaseUid } from '../repository/user'
import type { Variables } from '../variables'

const currentUserMiddleware = createMiddleware<{ Variables: Variables }>(async (c, next) => {
  const firebaseUserId = c.get('firebaseUserId')
  if (!firebaseUserId) {
    c.set('currentUser', null)
    await next()
  } else {
    const user = await getUserByFirebaseUid(db, firebaseUserId)
    c.set('currentUser', user || null)
    await next()
  }
})

export { currentUserMiddleware }
