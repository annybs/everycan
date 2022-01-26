import { Database } from '.'

export const createLocalDatabase = (): Database => {
  return {
    async login(creds) {
      console.log('login', creds)
    },
    async logout() {
      console.log('logout')
    }
  }
}
