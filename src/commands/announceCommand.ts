import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js'

export const announceCommand = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  if (interaction.isChatInputCommand()) {
    const embed = new EmbedBuilder()
      .setColor(800080)
      .setTitle('AVISO')
      .setDescription(interaction.options.getString('mensagem'))

    await interaction.reply({ embeds: [embed] })
  }
}
