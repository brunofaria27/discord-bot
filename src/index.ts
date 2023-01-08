import * as dotenv from 'dotenv'

import {
  ActionRowBuilder,
  ActivityType,
  ChannelType,
  Client,
  ComponentType,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  StringSelectMenuBuilder,
  TextChannel,
} from 'discord.js'

import { configureRest } from './rest'
import { pingCommand } from './commands/pingCommand'
import { ticketCommand } from './commands/ticketCommand'
import { messageSetagem } from './commands/setarCargo'
import { announceCommand } from './commands/announceCommand'

import * as mongoDB from 'mongodb'

import {
  addItens,
  consultarBau,
  removeItens,
  updateItens,
} from './commands/bauSchemaCommands'

export const collections: { chest?: mongoDB.Collection } = {}

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

export async function connectToDatabase() {
  dotenv.config()
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.MONGO_TOKEN
  )
  await client.connect()
  const db: mongoDB.Db = client.db(process.env.DB_NAME)
  const chestCollection: mongoDB.Collection = db.collection(
    process.env.COLLECTION_NAME
  )

  collections.chest = chestCollection

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${chestCollection.collectionName}`
  )
}

client.on('ready', () => {
  connectToDatabase()

  console.log(`Hi, ${client.user?.username} is now online!`)

  const atividades = ['Developed by Faria', 'Ballas! 👻', '💩']

  let index = 0

  setInterval(() => {
    client.user?.setActivity({
      name: atividades[index++ % atividades.length],
      type: ActivityType.Streaming,
      url: 'https://www.twitch.tv/fariazinhu',
    })
  }, 10000)
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
    case 'setagem':
      messageSetagem(interaction)
      break
    case 'anuncio':
      announceCommand(interaction)
      break
    case 'adicionaradm':
      addItens(interaction)
      break
    case 'adicionar':
      updateItens(interaction)
      break
    case 'remover':
      removeItens(interaction)
      break
    case 'bau':
      consultarBau(interaction)
      break
  }
})

client.on(Events.InteractionCreate, async (interaction) => {
  const nameChannel = `${interaction.user.username}-ticket`.toLowerCase()

  if (interaction.isButton() && interaction.customId == 'butao') {
    const channel = client.channels.cache.find((channel) => {
      return channel instanceof TextChannel
        ? channel.name === nameChannel
        : false
    })
    if (channel) {
      await interaction.reply({
        content: `<@!${interaction.user.id}>, você já tem um ticket criado no canal <#${channel.id}>`,
        ephemeral: true,
      })
    } else {
      interaction.guild?.channels
        .create({
          name: nameChannel,
          type: ChannelType.GuildText,
        })
        .then(async (channel) => {
          const category = '1053806513862492211'
          channel.setParent(category)
          interaction.reply({
            content: `O ticket foi criado no canal <#${channel.id}>`,
            ephemeral: true,
          })

          const embed = new EmbedBuilder()
            .setColor(800080)
            .setTitle('Razão do suporte')
            .setDescription(
              'Selecione a opção que melhor descreve o seu problema'
            )
            .setTimestamp()

          const row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(
                  {
                    label: '😡',
                    description: 'Problemas',
                    value: 'Problemas',
                  },
                  {
                    label: '❓',
                    description: 'Ajuda',
                    value: 'Ajuda',
                  }
                )
            )

          const msg = await channel.send({
            content: `<@!${interaction.user.id}>`,
            embeds: [embed],
            components: [row],
          })

          const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 20000,
          })

          collector.on('collect', (i) => {
            if (i.user.id === interaction.user.id) {
              if (msg.deletable) {
                msg.delete().then(async () => {
                  const embed = new EmbedBuilder()
                    .setColor(800080)
                    .setDescription(
                      `<@!${interaction.user.id}> Criou o **Ticket** pelo motivo・ ${i.values[0]}`
                    )
                    .setTimestamp()

                  const opened = await channel.send({
                    embeds: [embed],
                  })

                  opened.pin().then(() => {
                    opened.channel.bulkDelete(1)
                  })
                })
              }
            }
          })

          collector.on('end', (collected) => {
            if (collected.size < 1) {
              interaction.user
                .send(
                  `Você não selecionou nenhum motivo, o seu **Ticket** foi fechado.`
                )
                .then(() => {
                  setTimeout(() => {
                    if (channel.deletable) {
                      channel.delete()
                    }
                  }, 5000)
                })
            }
            collector.stop()
          })
        })
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
