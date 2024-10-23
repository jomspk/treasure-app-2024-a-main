import type firebase from 'firebase-admin'
import { createMiddleware } from 'hono/factory'
import type { Variables } from '../variables'

const createAuthMiddleware = (firebaseApp: firebase.app.App) => {
  return createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      c.set('firebaseUserId', null)
    }

    const token = authHeader?.split(' ')[1]
    try {
      const decodedToken = await firebaseApp.auth().verifyIdToken(token || '')
      c.set('firebaseUserId', decodedToken.uid)
    } catch (error) {
      c.set('firebaseUserId', null)
    } finally {
      await next()
    }
  })
}
export { createAuthMiddleware }
