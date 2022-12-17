import discord

import datetime

from config import token, link, prefix, ownerid
from discord.ext.commands import Bot

intents = discord.Intents.default()
intents.members = True
client = Bot(command_prefix=prefix, intents=intents)

@client.event
async def on_ready():
    print("----------------------")
    print("Logged In As")
    print("Username: %s"%client.user.name)
    print("ID: %s"%client.user.id)
    print("----------------------")
    
@client.event
async def on_member_join(member):
    guild = client.get_guild(1053356019541098558)
    print(f'Joined {member.name} in {datetime.date.today()} {datetime.time()}')
    channel = guild.get_channel(1053419511258288188)
    embed=discord.Embed(title=f"Bem-vindo, {member.name}", description=f"Muito feliz em ter você na nossa família {member.guild.name}!") # F-Strings!
    embed.set_thumbnail(url=member.avatar_url)
    await channel.send(embed=embed)  
    await member.send(f'Bem-vindo, agora basta pedir a setagem e esperar!')  

client.run(token)