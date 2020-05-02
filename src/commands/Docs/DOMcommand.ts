import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch"

export default class DOMDocsCommand extends Command {
  public constructor() {
    super("dom", {
      aliases: ["dom"],
      category: "Docs",
      channel: "guild",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            prompt: {
                start: "What would you like to search?"
            }
          }
      ],
      description: {
        content: "DOM Docs Command",
        usage: "dom [search]",
        examples: ["dom events"]
      },
      typing: true
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {

    let body: any = await fetch(`https://api.duckduckgo.com/?q=DOM+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There was an error when searching (Api Could Be Down)"))

    let data = await body.json()

    if(!data.AbstractURL.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Nothing found for ${query}`))

    let embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
      .setAuthor(`DOM`, 'https://www.pikpng.com/pngl/m/110-1104721_how-to-capture-an-image-from-a-dom.png', data.AbstractURL)
      .setDescription(data.Abstract.replace(/<[^>]*>?/gm, ''))

    return message.util!.send(embed)
  }
}