import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Playskip extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Play Skip',
            aliases: ['ps', 'playskip'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        const song = args.join(" ");
        try {
            if(!song) return { err: `${emoji.msg.ERROR} Error`, description: `You need to give me a URL or a search term.` };
            // @ts-ignore
            message.channel.send({ embeds: [new MessageEmbed()
                .setColor(embed.color as ColorResolvable) 
                .setTitle(`**Searching** 🔎 & **Skipping** ${emoji.msg.skip_track}`)
                .setDescription(`\`\`\`${song}\`\`\``)]}).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(e=>console.log("Could not delete, this prevents a bug"))
                    }, 5000);
                });
            playermanger(this.client, message as Message, args, `skiptrack:youtube`);
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}