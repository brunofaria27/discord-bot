import { AppCommand } from './typescript/appCommand'
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

const commands: AppCommand[] = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

export const configureRest = async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}
