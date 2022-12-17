import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js'

export const ticketCommand = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  await interaction.reply('Ticket legal!')
}
