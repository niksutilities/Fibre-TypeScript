import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class BorisCommand extends Command {
  public constructor() {
    super("boris", {
      aliases: ["boris"],
      category: "Corona",
      description: {
        content: "Boris Command",
        usage: "boris",
        examples: ["boris"]
      },
      ownerOnly: false
    });
  }

  public async exec(message: Message) {
    if(!message.guild) return this.client.guildOnly(message.channel);
    const channel = message.member?.voice
    if(!channel?.channel) return message.channel.send("You Need to Be in a voice channel")
    const player = this.client.music.players.spawn({
        guild: message.guild,
        voiceChannel: channel?.channel,
        textChannel: message.channel,
    })
    await this.client.music.search("https://www.youtube.com/watch?v=Sw0J6ZQakdY", message.author).then(res => {
      switch (res.loadType){
        case "TRACK_LOADED":
          player.queue.add(res.tracks[0])
          if(!player.playing) player.play()
      }
    })
  }
}