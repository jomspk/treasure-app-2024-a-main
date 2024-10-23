import { assertKeys, formatColumnNames } from './database'

describe('assertKeys', () => {
  test('全てのキーが一致する場合にtrueを返す', () => {
    const row = { id: 1, name: 'John' }
    const keys = ['id', 'name']
    expect(assertKeys(row, keys)).toBe(true)
  })

  test('キーが一致しない場合にfalseを返す', () => {
    const row = { id: 1, name: 'John' }
    const keys = ['id', 'fullName']
    expect(assertKeys(row, keys)).toBe(false)
  })

  test('追加のキーが存在する場合にfalseを返す', () => {
    const row = { id: 1, name: 'John', age: 30 }
    const keys = ['id', 'name']
    expect(assertKeys(row, keys)).toBe(false)
  })

  test('キーが不足している場合にfalseを返す', () => {
    const row = { id: 1 }
    const keys = ['id', 'name']
    expect(assertKeys(row, keys)).toBe(false)
  })
})

describe('formatColumnNames', () => {
  test('camelCaseのカラムをsnake_caseに変換してエイリアスを追加する', () => {
    const columns = ['camelCase', 'anotherColumn']
    expect(formatColumnNames(columns)).toEqual([
      'camel_case as camelCase',
      'another_column as anotherColumn',
    ])
  })

  test('snake_caseのカラムはそのままにする', () => {
    const columns = ['snake_case']
    expect(formatColumnNames(columns)).toEqual(['snake_case'])
  })

  test('置換対象が複数回あるケースのカラムを処理する', () => {
    const columns = ['articleCategoryId', 'followUserId']
    expect(formatColumnNames(columns)).toEqual([
      'article_category_id as articleCategoryId',
      'follow_user_id as followUserId',
    ])
  })

  test('混在するケースのカラムを処理する', () => {
    const columns = ['camelCase', 'snake_case']
    expect(formatColumnNames(columns)).toEqual(['camel_case as camelCase', 'snake_case'])
  })

  test('空のカラム配列を処理する', () => {
    const columns: string[] = []
    expect(formatColumnNames(columns)).toEqual([])
  })
})
