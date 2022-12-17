import * as dotenv from 'dotenv'

import { Client, GatewayIntentBits } from 'discord.js'

import { configureRest } from './rest'
import { pingCommand } from './commands/pingCommand'
import { ticketCommand } from './commands/ticketCommand'

dotenv.config()

configureRest()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  console.log(`attempting to execute command ${interaction.commandName}`)

  switch (interaction.commandName) {
    case 'ping':
      pingCommand(interaction)
      break
    case 'ticket':
      ticketCommand(interaction)
      break
  }
})

client.login(process.env.DISCORD_TOKEN)
