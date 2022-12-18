import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js'

export const ticketCommand = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  const embed = new EmbedBuilder()
    .setColor(800080)
    .setTitle('Tickets para suporte!')
    .setDescription(
      'Clique na opção abaixo para abrir um canal de suporte para você! 🙂'
    )
    .setThumbnail(
      'https://images.emojiterra.com/google/android-pie/512px/1f3ab.png'
    )

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('butao')
      .setLabel('🎫')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(false)
  )

  await interaction.reply({ embeds: [embed], components: [row] })
}
