import { AppCommand } from './typescript/appCommand'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord.js'

const commands: AppCommand[] = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'ticket',
    description: 'Create ticket embed',
  },
  {
    name: 'setagem',
    description: 'Create a embed for "Setagem"',
  },
  {
    name: 'anuncio',
    description: 'Send an announcement to members',
    options: [
      {
        name: 'title',
        description: 'Titulo da mensagem',
        type: 3,
        required: true,
      },
      {
        name: 'mensagem',
        description: 'Mensagem para ser anunciada.',
        type: 3,
        required: true,
      },
      {
        name: 'urlimage',
        description: 'Imagem para ser anexada na mensagem.',
        type: 11,
        required: false,
      },
    ],
  },
]

export const configureRest = async () => {
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)

  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}
