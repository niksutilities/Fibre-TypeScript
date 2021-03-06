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
                start: "What would you like to search for?"
            }
          }
      ],
      description: {
        content: "DOM documentation command.",
        usage: "dom [ search ]",
        examples: [
          "dom events",
          "dom tree"
        ]
      },
    });
  }

  public async exec(message: Message, { query }: { query: string }): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let body: any = await fetch(`https://api.duckduckgo.com/?q=DOM+${query}&format=json&atb=v208-1`)

    if(body.status != 200) return message.util!.send(new this.client.Embed(message, colour).setDescription("There was an error when searching (Api Could Be Down)."))

    let data = await body.json()

    if(!data.AbstractURL.length || !data.Abstract.length) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Nothing found for ${query}.`))

    let embed = new this.client.Embed(message, colour)
      .setAuthor(`DOM`, 'https://www.pikpng.com/pngl/m/110-1104721_how-to-capture-an-image-from-a-dom.png', data.AbstractURL)
      .setDescription(data.Abstract.replace(/<[^>]*>?/gm, ''))

    return message.util!.send(embed)
  }
}