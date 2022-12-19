declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT?: string
      DISCORD_TOKEN: string
      MONGO_TOKEN: string
      APPLICATION_ID: string
      GUILD_ID: string
      DB_NAME: string
      COLLECTION_NAME: string
    }
  }
}

export {}
