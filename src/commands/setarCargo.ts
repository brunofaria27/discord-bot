import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js'

export const messageSetagem = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  const embed = new EmbedBuilder()
    .setColor(800080)
    .setTitle('Siga o padrão abaixo para poder pedir a setagem no servidor:')
    .addFields(
      { name: '**Nome:**', value: 'Neymar Júnior' },
      { name: '**Idade:**', value: '26' },
      { name: '**ID - PURGE:**', value: '30' }
    )
  await interaction.reply({ embeds: [embed] })
}
