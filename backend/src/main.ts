import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { except } from 'hono/combine'
import { logger } from 'hono/logger'
import { convertUserToAPI } from './converter/user'
import { db } from './database/database'
import { AuthError, ForbiddenError, NotFoundError } from './errors'
import { firebaseApp } from './firebase'
import { createAuthMiddleware } from './middleware/auth'
import { corsMiddleware } from './middleware/cors'
import { currentUserMiddleware } from './middleware/currentUser'
import { loggerMiddleware } from './middleware/logger'
import type { paths } from './openapi/schema'
import * as CommentUsecase from './usecase/comment'
import * as QuestionUsecase from './usecase/question'
import * as RecommendUsecase from './usecase/recommend'
import * as UserUsecase from './usecase/user'
import type { Variables } from './variables'

const app = new Hono<{ Variables: Variables }>()
app.use(logger())
app.use('*', loggerMiddleware)
app.use('*', corsMiddleware())
const firebaseClient = firebaseApp
const authMiddleware = createAuthMiddleware(firebaseClient)
app.use('/users/me/register', authMiddleware)
app.use('/users/*', except(['/users/me/register'], authMiddleware, currentUserMiddleware))
app.on(['POST', 'PUT', 'PATCH', 'DELETE'], '/articles/*', authMiddleware, currentUserMiddleware)

app.onError((err, c) => {
  const logger = c.get('logger')
  if (err instanceof AuthError) {
    return c.json(
      {
        error: {
          message: err.message,
        },
      },
      { status: 401 }
    )
  }
  if (err instanceof ForbiddenError) {
    return c.json(
      {
        error: {
          message: err.message,
        },
      },
      { status: 403 }
    )
  }
  if (err instanceof NotFoundError) {
    return c.json(
      {
        error: {
          message: err.message,
        },
      },
      { status: 404 }
    )
  }

  logger.error('unhandled exception', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  })
  return c.json(
    {
      error: {
        message: 'something unexpected happened',
      },
    },
    { status: 500 }
  )
})

app.get('/users/me', async (c) => {
  const logger = c.get('logger')
  logger.info('users/me endpoint is called.')

  const user = c.get('currentUser')

  if (!user) {
    throw new NotFoundError('user not found')
  }

  const response: paths['/users/me']['get']['responses']['200']['content']['application/json'] =
    convertUserToAPI(user)
  return c.json(response, { status: 200 })
})

app.post('/users/me/register', async (c) => {
  const logger = c.get('logger')
  logger.info('users/me/register endpoint is called.')

  const uid = c.get('firebaseUserId')

  if (!uid) {
    throw new AuthError('user not authenticated')
  }

  const registeredUser = await UserUsecase.registerUser(db, firebaseClient, uid)

  const response: paths['/users/me/register']['post']['responses']['201']['content']['application/json'] =
    convertUserToAPI(registeredUser)
  return c.json(response, { status: 201 })
})

app.post('/questions', async (c) => {
  const logger = c.get('logger')
  logger.info('POST: questions endpoint is called.')

  const req = await c.req.json()

  const question = await QuestionUsecase.createQuestion(db, req.userId, req.tags, req.topics)

  return c.json(question.id, { status: 201 })
})

app.get('/questions/:questionId', async (c) => {
  const logger = c.get('logger')
  logger.info('GET: questions/:questionId endpoint is called.')

  const questionId: paths['/questions/{questionId}']['get']['parameters']['path']['questionId'] =
    c.req.param('questionId')

  const question = await QuestionUsecase.getQuestion(db, questionId)

  return c.json(question, { status: 200 })
})

app.post('/questions/:questionId/resolve', async (c) => {
  const logger = c.get('logger')
  logger.info('POST: questions/:questionId/resolve endpoint is called.')

  const questionId: paths['/questions/{questionId}/resolve']['post']['parameters']['path']['questionId'] =
    c.req.param('questionId')

  const result = await QuestionUsecase.resolveQuestion(db, questionId)
  return c.json({ status: 200, ...result })
})

app.get('/healthcheck', (c) => {
  const logger = c.get('logger')
  logger.info('Healthcheck endpoint is called.')
  return c.json('Hello Treasure2024! こころ駆動開発', 200)
})

app.post('/questions/:questionId/comments', async (c) => {
  const logger = c.get('logger')
  logger.info('POST: questions/:questionId/comments endpoint is called.')

  const req: paths['/questions/{questionId}/comments']['post']['requestBody']['content']['application/json'] =
    await c.req.json()
  const questionId = c.req.param('questionId')

  // TODO: currentUserを獲得できるようになったら、req.userIdとcurrentUser.idを比較したい
  const comment = await CommentUsecase.createQuestionComment(db, {
    questionId,
    content: req.content,
    type: req.type,
    userId: req.userId,
  })

  return c.json(comment, { status: 201 })
})

app.post('/topics/:topicId/comments', async (c) => {
  const logger = c.get('logger')
  logger.info('POST: topics/:topicId/comments endpoint is called.')

  const req: paths['/topics/{topicId}/comments']['post']['requestBody']['content']['application/json'] =
    await c.req.json()
  const topicId = c.req.param('topicId')

  // TODO: currentUserを獲得できるようになったら、req.userIdとcurrentUser.idを比較したい
  const comment = await CommentUsecase.createTopicComment(db, {
    topicId,
    content: req.content,
    type: req.type,
    userId: req.userId,
  })

  return c.json(comment, { status: 201 })
})

app.post('/recommend', async (c) => {
  const logger = c.get('logger')
  logger.info('POST: recommend endpoint is called.')

  const req: paths['/recommend']['post']['requestBody']['content']['application/json'] =
    await c.req.json()
  const recommendTitles = await RecommendUsecase.recommendTitles(db, req.docString)

  const res: paths['/recommend']['post']['responses']['201']['content']['application/json'] =
    recommendTitles
  return c.json(res, { status: 201 })
})

app.get('/tags', async (c) => {
  const tags = await db.select('*').from('tags')

  return c.json(tags, { status: 200 })
})

serve({
  fetch: app.fetch,
  port: 8000,
})
