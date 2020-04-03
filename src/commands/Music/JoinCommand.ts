import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

export default class JoinCommand extends Command {
  constructor() {
    super("join", {
      aliases: ["join"],
      category: "Music",
      description: {
        content: "Join Command", 
        usage: "join",
        examples: ["join"]
      }
    });
  }

  async exec (message: Message) {

    const { channel } = message.member!.voice

    if(!channel) return message.util!.send(new MessageEmbed()
        .setDescription("You Need to be in a voice channel")
        .setColor("0491e2")
      )

    let player = this.client.music.players.get(message.guild?.id)
    if(player) return message.util!.send(new MessageEmbed()
        .setDescription("I'm already in a voice channel"))
    
    player = this.client.music.players.spawn({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: channel
    }) 
  }
}