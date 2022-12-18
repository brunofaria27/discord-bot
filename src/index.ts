import * as dotenv from 'dotenv'

import {
  ActionRowBuilder,
  ActivityType,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  ComponentType,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  Message,
  StringSelectMenuBuilder,
} from 'discord.js'

import { configureRest } from './rest'
import { pingCommand } from './commands/pingCommand'
import { ticketCommand } from './commands/ticketCommand'
import { messageSetagem } from './commands/setarCargo'

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

client.on('ready', () => {
  console.log(`Hi, ${client.user?.username} is now online!`)

  const atividades = ['Developed by Sure & Faria', 'Moderando Ballas! 👻', '💩']

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
  }
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return
  const name_channel = `${interaction.user.username}-ticket`

  interaction.guild?.channels
    .create({
      name: name_channel,
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
        .setDescription('Selecione a opção que melhor descreve o seu problema')
        .setTimestamp()

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
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

              const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId('close-ticket')
                  .setLabel('Fechar Ticket')
                  .setEmoji('❌')
                  .setStyle(ButtonStyle.Secondary)
              )

              const opened = await channel.send({
                embeds: [embed],
                components: [row],
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

  if (interaction.customId == 'close-ticket') {
    // TODO: Delete a Ticket
    // https://stackoverflow.com/questions/73096544/this-interaction-failed-buttons-discord-js
  }
})

client.login(process.env.DISCORD_TOKEN)
