import type { User } from '../model/user'
import type { components as OpenAPIComponent } from '../openapi/schema'

type OpenAPIUser = OpenAPIComponent['schemas']['OriginalUser']

export const convertUserToAPI = (modelUser: User): OpenAPIUser => {
  return {
    id: modelUser.id,
    name: modelUser.name || '',
    photoUrl: modelUser.photoUrl || '',
  }
}
