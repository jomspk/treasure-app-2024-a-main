import { createMiddleware } from 'hono/factory'
import * as winston from 'winston'
import type { Variables } from '../variables'

const loggerMiddleware = createMiddleware<{ Variables: Variables }>(async (c, next) => {
  const requestId = crypto.randomUUID()
  const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
        return JSON.stringify({
          level: level.toUpperCase(),
          msg: message,
          requestId: requestId,
          stack: stack,
          args: meta.args,
          time: timestamp,
        })
      })
    ),
    transports: [new winston.transports.Console()],
  })

  c.set('logger', logger)
  logger.info('[Request Started]')
  await next()
})

export { loggerMiddleware }
