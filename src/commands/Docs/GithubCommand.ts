import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import moment from "moment";

export default class GithubCommand extends Command {
    public constructor() {
      super("github", {
        aliases: ["github"],
        category: "Docs",
        channel: "guild",
        args: [
          {
              id: "query",
              type: "string",
              match: "rest",
              prompt: {
                  start: "Who would you like to search for?"
              }
            }
        ],
        description: {
          content: "Github User / Organisation informations.",
          usage: "github [ search ]",
          examples: [
            "github discord.js",
            "github PizzaOnTop"
          ]
        },
      });
    }
    public async exec(message: Message, { query }: { query: string }): Promise<Message> {
        let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
        let data: any = await fetch(`https://api.github.com/users/${query}`)
        let body: any = await data.json()

        if(body.message) return message.util!.send(new this.client.Embed(message, colour)
          .setDescription("No User Found")
        )

        return message.util!.send(new this.client.Embed(message, colour)
          .setThumbnail(body.avatar_url)
          .addField("Username:", `\`${body.login}\``, true)
          .addField("User ID:", `\`${body.id}\``, true)
          .addField("Account Type:", `\`${body.type}\``, true)
          .addField("Site Admin:", body.site_admin ? "`Yes`" : "`No`", true)
          .addField("User's Name:", body.name ? `\`${body.name}\`` : "`Unknown`", true)
          .addField("User's Company:", body.company ? `\`${body.company}\`` : "`Unknown`", true)
          .addField("User's Blog:", body.blog.length ? `\`${body.blog.substr(0,500)}\`` : "`Unknown`", true)
          .addField("User's Location:", body.location ? `\`${body.location.substr(0,250)}\`` : "`Unknown`", true)
          .addField("User's Email:", body.email ? `\`${body.email}\`` : "`Unknown`", true)
          .addField("User's Hireable:", body.hireable ? `\`${body.hireable}\`` : "`Unknown`", true)
          .addField("User's Bio:", body.bio ? `\`${body.bio.substr(0,250)}\`` : "`Unknown`", true)
          .addField("Public Repositories:", `\`${body.public_repos}\``, true)
          .addField("Public Gists:", `\`${body.public_gists}\``, true)
          .addField("Number of Followers:", `\`${body.followers}\``, true)
          .addField("User's Following:", `\`${body.following}\``, true)
          .addField("Created At:", `\`${moment(body.created_at).format("DD/MMM/YYYY hh:mm")}\``, true)
          .addField("Updated At:", `\`${moment(body.updated_at).format("DD/MMM/YYYY hh:mm")}\``, true)
      )
    }
}