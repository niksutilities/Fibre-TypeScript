import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Utils } from "erela.js";

export default class SearchCommand extends Command {
  constructor() {
    super("search", {
      aliases: ["search"],
      category: "Music",
      args: [
        {
            id: "query",
            type: "string",
            match: "rest",
            prompt:{
              start: "What would you like to play?"
            }
          }
      ],
      description: {
        content: "Search Command", 
        usage: "search [search query]",
        examples: ["search ncs"]
      }
    });
  }

  public async exec(message: Message, { query }: { query: any }) {

    let player: any;

    const { channel } = message.member!.voice

    if (!channel) {
        return message.util!.send(new this.client.Embed().setDescription("You Need to be in a voice channel"))
    }else if (!channel.joinable) {
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to enter this voice channel"))
    }else if(!channel.speakable){
        return message.util!.send(new this.client.Embed().setDescription("I don't seem to have permission to speak this voice channel"))
    }

    this.client.manager.search(query, message.author).then(async found => {
        switch (found.loadType) {

            case "TRACK_LOADED":
                if(found.tracks[0].isStream){
                    if(found.tracks[0].uri.startsWith("https://www.you")){
                    return message.util!.send(new this.client.Embed().setDescription("Unfortunately I cannot play youtube streams right now"))
                    }
                }
                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel
                });   
                player.queue.add(found.tracks[0]);
                if(!player.playing) player.play();

                if(player.queue.length > 1){
                    message.util!.send(new this.client.Embed().setDescription(`Queued ${found.tracks[0].title}`))
                }
            break;

            case "SEARCH_RESULT":
                let i = 1
                const tracks = found.tracks.slice(0,5);
                const embed = new this.client.Embed()
                    .setAuthor("Song Selection.", message.author.displayAvatarURL({dynamic: true, size: 2048}))
                    .setDescription(tracks.map(video => `**${i++} -** ${video.title}`))
                    .setFooter("Your response time closes within the next 30 seconds. Use 🗑️ to cancel the selection");

                let send_message = await message.util!.send(embed);

                send_message.react("1️⃣")
                send_message.react("2️⃣")
                send_message.react("3️⃣")
                send_message.react("4️⃣")
                send_message.react("5️⃣")
                send_message.react("🗑️")

                const filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || '2️⃣' || '3️⃣' || '4️⃣' || '5️⃣' || '🗑️') && user.id === message.author.id;

                const reactions = send_message.createReactionCollector(filter, { time: 30000 });

                reactions.on('collect', r => {
                    if(r.emoji.name === "🗑️"){
                        if(send_message.deletable){
                            send_message.delete()
                        }else{
                            send_message.edit("", new this.client.Embed()
                                .setDescription("I cannot delete this message"))
                        }
                    }else if(r.emoji.name === "1️⃣"){
                        player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel
                                }); 
                        player.queue.add(tracks[0])
                        if(!player.playing) player.play()
                        if(send_message.editable){
                            send_message.edit("", new this.client.Embed()
                            .setDescription(`Queued: ${tracks[0].title}`)
                        )
                        }else{
                            message.util!.send(new this.client.Embed()
                                .setDescription("I cannot Edit my messages"))
                        }
                        send_message.reactions.removeAll().catch(err => {
                            message.channel.send(new this.client.Embed()
                                .setDescription("I Don't have permissions to delete my emojis"))
                        })
                    }else if(r.emoji.name === "2️⃣"){
                        player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel
                                }); 
                        player.queue.add(tracks[1])
                        if(!player.playing) player.play()
                        if(send_message.editable){
                            send_message.edit("", new this.client.Embed()
                            .setDescription(`Queued: ${tracks[1].title}`)
                        )
                        }else{
                            message.util!.send(new this.client.Embed()
                                .setDescription("I cannot Edit my messages"))
                        }
                        send_message.reactions.removeAll().catch(err => {
                            message.channel.send(new this.client.Embed()
                                .setDescription("I Don't have permissions to delete my emojis"))
                        })
                    }else if(r.emoji.name === "3️⃣"){
                        player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel
                                }); 
                        player.queue.add(tracks[2])
                        if(!player.playing) player.play()
                        if(send_message.editable){
                            send_message.edit("", new this.client.Embed()
                            .setDescription(`Queued: ${tracks[2].title}`)
                        )
                        }else{
                            message.util!.send(new this.client.Embed()
                                .setDescription("I cannot Edit my messages"))
                        }
                        send_message.reactions.removeAll().catch(err => {
                            message.channel.send(new this.client.Embed()
                                .setDescription("I Don't have permissions to delete my emojis"))
                        })
                    }else if(r.emoji.name === "4️⃣"){
                        player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel
                                }); 
                        player.queue.add(tracks[3])
                        if(!player.playing) player.play()
                        if(send_message.editable){
                            send_message.edit("", new this.client.Embed()
                            .setDescription(`Queued: ${tracks[3].title}`)
                        )
                        }else{
                            message.util!.send(new this.client.Embed()
                                .setDescription("I cannot Edit my messages"))
                        }
                        send_message.reactions.removeAll().catch(err => {
                            message.channel.send(new this.client.Embed()
                                .setDescription("I Don't have permissions to delete my emojis"))
                        })
                    }else if(r.emoji.name === "5️⃣"){
                        player = this.client.manager.players.spawn({
                                    guild: message.guild,
                                    textChannel: message.channel,
                                    voiceChannel: channel
                                }); 
                        player.queue.add(tracks[4])
                        if(!player.playing) player.play()
                        if(send_message.editable){
                            send_message.edit("", new this.client.Embed()
                            .setDescription(`Queued: ${tracks[4].title}`)
                        )
                        }else{
                            message.util!.send(new this.client.Embed()
                                .setDescription("I cannot Edit my messages"))
                        }
                        send_message.reactions.removeAll().catch(err => {
                            message.channel.send(new this.client.Embed()
                                .setDescription("I Don't have permissions to delete my emojis"))
                        })
                    }

                    reactions.stop()
                })
            break;

            case "PLAYLIST_LOADED":
                player = this.client.manager.players.spawn({
                    guild: message.guild,
                    textChannel: message.channel,
                    voiceChannel: channel
                }); 
        
                found.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = Utils.formatTime(found.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                message.util!.send(new this.client.Embed().setDescription(`Queued ${found.playlist.tracks.length} tracks in playlist ${found.playlist.info.name}\nDuration: ${duration}`));
                if(!player.playing) player.play()
            break;

            case "LOAD_FAILED":
                message.util!.send(new this.client.Embed().setDescription(`No Songs Found`))
            break;

            case "NO_MATCHES":
                message.util!.send(new this.client.Embed().setDescription(`No Songs Found`))
            break;

        }
    })
  }
}