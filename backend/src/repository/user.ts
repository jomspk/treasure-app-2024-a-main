import assert from 'assert'
import type knex from 'knex'
import type { ResultRow } from '../database/database'
import type { User } from '../model/user'

export const getUserByFirebaseUid = async (
  db: knex.Knex,
  firebaseUid: string
): Promise<User | undefined> => {
  const user: ResultRow | undefined = await db
    .select('*')
    .from('users')
    .where('firebase_uid', firebaseUid)
    .first()
  if (!user) {
    return undefined
  }
  return {
    id: user.uuid,
    firebaseUid: user.firebase_uid,
    name: user.name,
    photoUrl: user.photo_url,
  }
}

export const getUserById = async (db: knex.Knex, userId: number): Promise<User | undefined> => {
  const user: ResultRow | undefined = await db.select('*').from('users').where('id', userId).first()
  if (!user) {
    return undefined
  }
  return {
    id: user.uuid,
    firebaseUid: user.firebase_uid,
    name: user.name,
    photoUrl: user.photo_url,
  }
}

export const createUser = async (
  db: knex.Knex,
  firebaseUid: string,
  name?: string,
  photoUrl?: string
): Promise<number> => {
  const res = await db
    .insert([{ firebase_uid: firebaseUid, name: name, photo_url: photoUrl }])
    .into('users')
    .returning('uuid')
  assert(res.length === 1, '作成したユーザーのidが返される')
  const userId = res[0]['uuid']

  return userId
}
