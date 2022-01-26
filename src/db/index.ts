import { createLocalDatabase } from './local'

export type Credentials = {
  dbType: DatabaseType
  dbAddress?: string
  username: string
  password: string
}

export interface Database {
  login(creds: Credentials): Promise<void>
  logout(): Promise<void>
}

export type DatabaseType = 'http' | 'local'

export const createDatabase = (dbType: DatabaseType): Database => {
  switch (dbType) {
    case 'http':
      throw new Error('HTTP database not yet supported')
    case 'local':
      return createLocalDatabase()
  }
}

export const dbTypes: Record<DatabaseType, string> = {
  http: 'HTTP',
  local: 'Local'
}
