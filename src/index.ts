import * as dotenv from "dotenv";

import { Client } from "discord.js";
import { configureRest } from "./rest";

dotenv.config()

configureRest()

const client = new Client({ intents: [] });

client.login(process.env.DISCORD_TOKEN);
