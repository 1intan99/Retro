import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable, User } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Move extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Move',
            aliases: ['move', 'mv']
        });
    }

    public async start(message: Message, args: any, prefix: string): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
            if (!args[0]) {
                return { err: `${emoji.msg.ERROR} | Wrong Command Usage!`, description: `Usage: \`${prefix}move <from> <to>\`\nExample: \`${prefix}move ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 } 1\`` };
            }
            if (!args[1]) {
                return { err: `${emoji.msg.ERROR} | Wrong Command Usage!`, description: `Usage: \`${prefix}move <from> <to>\`\nExample: \`${prefix}move ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 } 1\`` };
            }
            if (isNaN(args[0]) || args[0] <= 1 || args[0] > player.queue.length) {
                return { err: `${emoji.msg.ERROR} | Error`, description: `Your Input must be a Number greater then \`1\` and smaller then \`${player.queue.length}\`` };
            }

            let song = player.queue[player.queue.length - 1];
            let QueueArray = this.client.util.arrayMove(player.queue, player.queue.length - 1, 0);
            player.queue.clear();
            for (const track of QueueArray) {
                player.queue.add(track);
            }
            let user = song.requester as User
            // @ts-ignore
            return message.channel.send({ embeds: [new MessageEmbed()
                .setColor(embed.color as ColorResolvable)
                .setFooter(embed.footertext, embed.footericon)
                .setTitle(`${emoji.msg.SUCCESS} Success | Mmoved the Song in the Queue from Position \`${args[0]}\` to Position: \`${args[1]}\``)
                .setThumbnail(song.displayThumbnail())
                .setDescription(`[${song.title}](${song.uri}) - \`${this.client.util.formatTime(song.duration)}\` - requested by **${user.tag}**`)]});
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}