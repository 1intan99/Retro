import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Shuffle extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Shuffle',
            aliases: ['shuffle', 'mix'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //set into the player instance an old Queue, before the shuffle...
        player.set(`beforeshuffle`, player.queue.map(track => track));
        //shuffle the Queue
        player.queue.shuffle();
        //return success message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.shuffle} Shuffled the Queue`)
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