import { cors } from 'hono/cors'

const corsMiddleware = () => {
  return cors({
    origin: '*',
  })
}

export { corsMiddleware }
