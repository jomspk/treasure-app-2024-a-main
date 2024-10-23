import type firebase from 'firebase-admin'
import type { Context, Next } from 'hono'
import { AuthError } from '../errors'
import { createAuthMiddleware } from './auth'

jest.mock('firebase-admin')

const mockFirebaseApp = {
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
  }),
} as Partial<firebase.app.App> as firebase.app.App

describe('createAuthMiddleware', () => {
  let mockContext: Context
  let mockNext: Next

  beforeEach(() => {
    mockContext = {
      req: {
        header: jest.fn(),
      },
      set: jest.fn(),
      get: jest.fn().mockReturnValue({
        logger: {
          warn: jest.fn(),
        },
      }),
    } as unknown as Context

    mockNext = jest.fn()
  })

  test('Authorization headerが無い場合、AuthErrorを投げる', async () => {
    ;(mockContext.req.header as jest.Mock).mockReturnValue(null)

    const authMiddleware = createAuthMiddleware(mockFirebaseApp)
    await expect(authMiddleware(mockContext, mockNext)).rejects.toThrow(AuthError)
    await expect(authMiddleware(mockContext, mockNext)).rejects.toThrow(
      'Authorization header is missing'
    )
  })

  test('tokenが不正な場合、AuthErrorを投げる', async () => {
    ;(mockContext.req!.header as jest.Mock).mockReturnValue('Bearer invalid-token')
    ;(mockFirebaseApp.auth().verifyIdToken as jest.Mock).mockRejectedValue(
      new Error('Invalid token')
    )

    const authMiddleware = createAuthMiddleware(mockFirebaseApp)
    await expect(authMiddleware(mockContext, mockNext)).rejects.toThrow(AuthError)
    await expect(authMiddleware(mockContext, mockNext)).rejects.toThrow('AuthError')
  })

  test('tokenが正しい場合、ContextにfirebaseUserIdがsetされnextが呼ばれる', async () => {
    ;(mockContext.req!.header as jest.Mock).mockReturnValue('Bearer valid-token')
    ;(mockFirebaseApp.auth().verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'test-uid' })

    const authMiddleware = createAuthMiddleware(mockFirebaseApp)
    await authMiddleware(mockContext, mockNext)

    expect(mockContext.set).toHaveBeenCalledWith('firebaseUserId', 'test-uid')
    expect(mockNext).toHaveBeenCalled()
  })
})
