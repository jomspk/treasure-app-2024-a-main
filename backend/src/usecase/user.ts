import assert from 'assert'
import type { app } from 'firebase-admin'
import type knex from 'knex'
import type { User } from '../model/user'
import * as Repository from '../repository/user'

export const registerUser = async (
  db: knex.Knex,
  firebaseApp: app.App,
  firebaseUid: string
): Promise<User> => {
  const existUser = await Repository.getUserByFirebaseUid(db, firebaseUid)

  if (existUser) {
    return existUser
  }
  const firebaseUser = await firebaseApp.auth().getUser(firebaseUid)
  await Repository.createUser(db, firebaseUser.uid, firebaseUser.displayName, firebaseUser.photoURL)
  const user = await Repository.getUserByFirebaseUid(db, firebaseUid)

  assert(user, 'ユーザーが作成されている')
  return user
}
