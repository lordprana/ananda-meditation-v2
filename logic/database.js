import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { stripUidSymbols } from '../util'

export const DATABASE_PATHS = {
  favorites: '/favourites',
  customMeditations: '/customSessions',
}

export const getDatabaseValue = async (path, callback) => {
  const user = auth().currentUser
  if (user) {
    const result = await database()
      .ref(`/users/${stripUidSymbols(user.uid)}${path}`)
      .once('value')
    return result.val()
  }
}

export const setDatabaseValue = (path, value) => {
  const user = auth().currentUser
  if (user) {
    return database()
      .ref(`/users/${stripUidSymbols(user.uid)}${path}`)
      .set(value)
  }
}
