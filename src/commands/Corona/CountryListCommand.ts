import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";

export default class CountrylistCommand extends Command {
  public constructor() {
    super("countrylist", {
      aliases: ["countrylist", "countries"],
      category: "Corona",
      channel: "guild",
      description: {
        content: "Shows all valid contries.",
        usage: "countrylist",
        examples: [
          "countrylist",
          "countries"
      ]
      },
    });
  }

  public async exec(message: Message): Promise<Message> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    const data: any[] = await fetch('https://corona.lmao.ninja/v2/countries').then(res => res.json())
    const final_data: string[] = data.map(x => x.country).sort()
    const countries: string[] = final_data.slice(0,60)
    const restcontries: string[] = final_data.slice(80,120)
    const finalcontries: string[] = final_data.slice(120,180)
    const finalcontries2: string[] = final_data.slice(180,240)
    return message.util!.send(new this.client.Embed(message, colour)
        .setTitle("Country List")
        .addField(`\u200b`,`\`` + countries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + restcontries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + finalcontries.map(x => x).join("\`, \`") + `\``,false)
        .addField(`\u200b`,`\`` + finalcontries2.map(x => x).join("\`, \`") + `\``,false)
    )
  }
}