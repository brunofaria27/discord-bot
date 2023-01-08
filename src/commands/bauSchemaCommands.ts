import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js'

import { collections } from '../index'

// CONSULTAR BAU
// ADICIONAR ITEM (NOME E QUANTIDADE)
// REMOVER ITEM (NOME E QUANTIDADE)

export const consultarBau = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  if (interaction.isChatInputCommand()) {
    const result = await collections.chest?.find({}).toArray()

    const embed = new EmbedBuilder()
      .setColor(800080)
      .setTitle('BAÚ - BALLAS 🔥')
      .setThumbnail(
        'https://static.wikia.nocookie.net/nppublic/images/0/09/EBSLOGO2.png/revision/latest?cb=20221007011328'
      )

    if (result?.length != 0 && result != undefined) {
      for (let i = 0; i < result.length; i++) {
        embed.addFields({
          name: `**${result[i].name}**`,
          value: `Quantidade: ${result[i].qnt}`,
        })
      }

      await interaction.reply({ embeds: [embed] })
    } else {
      embed.setDescription(
        'O baú encontra sem nenhum item cadastrado pelo líder da facção.'
      )
    }
  }
}

export const addItens = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  if (interaction.isChatInputCommand()) {
    const nomeItem = interaction.options.getString('nomeitem')
    const qntItem = interaction.options.getInteger('quantidade')
    const item = { name: nomeItem, qnt: qntItem }
    const result = await collections.chest?.insertOne(item)
    interaction.reply(
      `O item \`${nomeItem}\` com a quantidade \`${qntItem}\` foi adicionado no baú pelo membro <@!${interaction.user.id}>.`
    )
  }
}

export const updateItens = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  if (interaction.isChatInputCommand()) {
    let newQnt = 0
    const nomeItem = interaction.options.getString('nomeitem')
    const qntItem = interaction.options.getInteger('quantidade')
    const filter = { name: nomeItem }

    const result = await collections.chest?.findOne(filter)

    if (result == null) {
      interaction.reply(
        `<@!${interaction.user.id}>, o item \`${nomeItem}\` não foi encontrado, utilize \`/bau\` para ver os nomes dos itens.`
      )
      return
    }
    newQnt = qntItem + result?.qnt
    const update = { qnt: newQnt }
    await collections.chest?.updateOne(filter, {
      $set: update,
    })

    interaction.reply(
      `O item \`${nomeItem}\` com a quantidade \`${qntItem}\` foi adicionado no baú pelo membro <@!${interaction.user.id}>.`
    )
  }
}

export const removeItens = async (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => {
  if (interaction.isChatInputCommand()) {
    let newQnt = 0
    const nomeItem = interaction.options.getString('nomeitem')
    const qntItem = interaction.options.getInteger('quantidade')
    const filter = { name: nomeItem }

    const result = await collections.chest?.findOne(filter)

    if (result == null) {
      interaction.reply(
        `<@!${interaction.user.id}>, o item \`${nomeItem}\` não foi encontrado, utilize \`/bau\` para ver os nomes dos itens.`
      )
      return
    }

    if (result?.qnt == 0) {
      interaction.reply(
        `<@!${interaction.user.id}>, você \`${nomeItem}\` não pode remover mais esse item, a quantidade dele já é 0.`
      )
      return
    } else if (qntItem) {
      newQnt = result?.qnt - qntItem

      if (newQnt < 0) {
        interaction.reply(
          `<@!${interaction.user.id}>, está tentando remover mais \`${nomeItem}\` do que o possível, utilize \`/bau\` para verificar`
        )
        return
      }
      const update = { qnt: newQnt }
      await collections.chest?.updateOne(filter, {
        $set: update,
      })

      interaction.reply(
        `Foram removidos \`${qntItem}\` quantidades do item \`${nomeItem}\` pelo membro <@!${interaction.user.id}>.`
      )
    }
  }
}
