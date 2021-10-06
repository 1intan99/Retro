import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Removedupe extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Remove Dupes',
            aliases: [`removedupe`, `removedupetrack`, `rdt`, `removeduplicated`, `removeduplicateds`],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
      //make a new array of each single song which is not a dupe
        let tracks = player.queue;
        const newtracks = [];
        for (let i = 0; i < tracks.length; i++) {
            let exists = false;
            for (let j = 0; j < newtracks.length; j++) {
            if (tracks[i].uri === newtracks[j].uri) {
                exists = true;
                break;
            }
            }
            if (!exists) {
            newtracks.push(tracks[i]);
            }
        }
        //clear the Queue
        player.queue.clear();
        //now add every not dupe song again
        for (const track of newtracks)
            player.queue.add(track);
        //Send Success Message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.cleared} I removed the track at position: \`${Number(args[0])}\``)
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)]});
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}