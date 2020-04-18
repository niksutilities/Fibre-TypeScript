import { Command } from "discord-akairo";
import { Message } from "discord.js";

const USER_MENTION_REGEX = /<@!?(\d{17,19})>/gm;
const CHANNEL_MENTION_REGEX = /<#(\d{17,19})>/gm;

export default class TagCommand extends Command {
    public constructor() {
        super("tag-create", {
            args: [
                {
                    id: "name",
                    type: "existingTag",
                    prompt: {
                        start: "Please provide a tag name",
                    }
                },

                {
                    id: "content",
                    type: "text",
                    match: "rest",
                    prompt: {
                        start: "Please provide some text for this tag."
                    }
                }
            ],
            category: "flag"
        });
    }

    public async exec (message: Message, { name, content }: { name: string; content: string; }) {

        const perms = await this.client.perms(["ADMINISTRATOR"],message.member)
        if(perms.length > 0) return message.util!.send(new this.client.Embed()
            .setDescription(`You need these permissions ${perms.map(x => `\`` + x + `\``)}`)
        )

        if (name.match(USER_MENTION_REGEX) || name.match(CHANNEL_MENTION_REGEX))
            return message.util!.send(new this.client.Embed().setDescription(`You cannot name your tag that, as it contains a mention of a channel, or user.`));

        if (name.length > 16) return message.util!.send(new this.client.Embed().setDescription(`You cannot name your tag that, as it exceeds the tag name character limit.`));
            
        let guild = await this.client.findOrCreateGuild({ id: message.guild!.id })

        if(guild.customCommands.find((c) => c.name === name)){
            return message.util!.send(new this.client.Embed()
                .setDescription(`Tag \`${name}\` Already Exists`)
            )
        }

        if(guild.customCommands.length == 10){
            return message.util!.send(new this.client.Embed()
                .setDescription(`Max Number of tags is 10`)
            )
        }

        guild.customCommands.push({
            name: name.toLowerCase(),
            answer: content,
            created: Date.now(),
            modified: Date.now(),
            creater: message.author.id,
            editor: message.author.id
        })

        guild.save()

        return message.util!.send(new this.client.Embed()
        .setDescription(`Created Tag \`${name}\``)
        )

    }   
}