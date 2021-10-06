import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Unshuffle extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Unshuffle',
            aliases: ['unmix', 'unshuffle', `oldshuffle`, `undoshuffle`, `oldqueue`, `us`],
            developer: true
        });
    }

    public async start(message: Message, args: string[], prefix: string): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //if no shuffle happened, return error
        if (!player.get(`beforeshuffle`))
        return { err: `${emoji.msg.ERROR} Error | You haven't shuffled this Queue yet!`, description: `To shuffle it type: \`${prefix}shuffle\`` };
        //clear teh Queue
        player.queue.clear();
        //now add every old song again
        // @ts-ignore
        for (const track of player.get(`beforeshuffle`)) {
            player.queue.add(track);
        }
        //return success message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.shuffle} **Re**shuffled the Queue`)
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