import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Player } from "erela.js";

export default class ShuffleCommand extends Command {
  constructor() {
    super("shuffle", {
      aliases: ["shuffle"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Shuffles the current queue.", 
        usage: "skipto",
        examples: [
          "skipto 1",
          "goto 2",
        ]
      },
    });
  }

  async exec (message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    message.util!.send("Adding now :)")
 
  }
}