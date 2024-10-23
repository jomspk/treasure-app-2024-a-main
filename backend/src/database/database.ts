import knex from 'knex'

const config: knex.Knex.Config = {
  client: 'postgresql',
  connection: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
  },
}

export const db = knex(config)
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type ResultRow = Record<string, any>

export const assertKeys = <T extends ResultRow>(v: ResultRow, keys: string[]): v is T =>
  JSON.stringify(Object.keys(v).toSorted()) === JSON.stringify(keys.toSorted())

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (v) => `_${v.toLowerCase()}`)
}
export const formatColumnNames = (columns: string[]): string[] => {
  return columns.map((c) => {
    const snakeCaseColumn = camelToSnake(c)
    if (c !== snakeCaseColumn) {
      return `${snakeCaseColumn} as ${c}`
    } else {
      return c
    }
  })
}
