export type AppCommand = {
  name: string
  description: string
  options?: AppCommandOption[]
}

export type AppCommandOption = {
  name: string
  description: string
  type: number // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
  required: boolean
  choices?: AppCommandOptionChoice[]
}

export type AppCommandOptionChoice = {
  name: string
  value: string
}
