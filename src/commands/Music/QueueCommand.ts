import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageReaction } from "discord.js";
import Embed from "client/FibreEmbed";

export default class QueueCommand extends Command {
  constructor() {
    super("queue", {
      aliases: ["queue"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Queue Command", 
        usage: "queue",
        examples: ["queue"]
      },
      typing: true
    });
  }

  async exec (message: Message) {

    const player = this.client.manager.players.get(message.guild!.id)

    const { channel } = message.member!.voice;

    if(!player) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("There is no player for this guild"));
    if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Leave Command"));

    if(!player.queue.length){
        return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("The queue is empty"));
    } else if(player.queue.length < 2) {
        return message.channel.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).addField(`Now Playing`,`${player.queue[0].title}`, false));
    } else {
        let page: number = Math.floor(11);
        let i: number = 0;
        let queuelist = player.queue.slice(1,11).map((track) => `${++i}. ${track.title}`).join('\n');
        let pages = Math.floor((player.queue.slice(2).length + 10) / 10);
        let current = 1;
        let embed: Embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false).addField(`Queue`, queuelist, false).setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"}`);
        await message.channel.send(embed).then(async (msg) => {
            msg.delete({ timeout: 60000 });
            if (Math.floor((player.queue.slice(2).length + 10) / 10) > 1) {
            await msg.react('⏪');
            await msg.react('◀');
            await msg.react('▶');
            await msg.react('⏩');
            current = Math.floor(page / 10);
            const collector = msg.createReactionCollector((reaction, user) => (reaction.emoji.name === '⏪' || "◀" || "▶" || "⏩") && user.id === message.author.id, { time: 60000 });
            collector.on("collect", async (collected: MessageReaction) => {
                switch (collected.emoji.name) {
                    case "⏪":
                        if (current === 1) return collected.users.remove(message.author);
                        current = 1;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        if(!queuelist.length) return collected.users.remove(message.author);
                        collected.users.remove(message.author)
                        let edit_Embed: Embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"}`);
                        msg.edit("", edit_Embed).catch(null)
                    break;

                    case "◀":
                        if (current === 1) return collected.users.remove(message.author);
                        await current--;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        if(!queuelist.length) return collected.users.remove(message.author);
                        collected.users.remove(message.author)
                        let edit_embed: Embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"}`);
                        msg.edit("", edit_embed).catch(null)
                    break;

                    case "▶":
                        if (current === pages) return collected.users.remove(message.author);
                        await current++;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        if(!queuelist.length) return collected.users.remove(message.author);
                        collected.users.remove(message.author)
                        let next_embed: Embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"}`);
                        msg.edit("", next_embed).catch(null)
                    break;

                    case "⏩":
                        if (current === pages) return collected.users.remove(message.author);
                        current = pages;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        if(!queuelist.length) return collected.users.remove(message.author);
                        collected.users.remove(message.author)
                        let end_embed: Embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"}`);
                        msg.edit("", end_embed).catch(null)
                    break;
                }
            })
        }
      })
    }
  }
}