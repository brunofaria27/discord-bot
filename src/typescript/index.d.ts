declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT?: string
      DISCORD_TOKEN: string
      APPLICATION_ID: string
      GUILD_ID: string
    }
  }
}

export {}
