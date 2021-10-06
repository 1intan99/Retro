import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class RemoveTrack extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Remove Track',
            aliases: ['removetrack', 'remove', 'rt'],
            developer: true
        });
    }

    public async start(message: Message, args: any): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
                  //if no args return error
        if (!args[0])
        return { err: `${emoji.msg.ERROR} Error | Please add the Track you want to remove!`, description: `Example: \`removetrack ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 }\`` };
        //if the Number is not a valid Number return error
        if (isNaN(args[0]))
        return { err: `${emoji.msg.ERROR} Error | It has to be a valid Queue Number!`, description: `Example: \`removetrack ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 }\`` };
        //if the Number is too big return error
        if (Number(args[0]) > player.queue.size)
        return { err: `${emoji.msg.ERROR} Error | Your Song must be in the Queue!`, description: `Example: \`removetrack ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 }\`` };
        //remove the Song from the QUEUE
        player.queue.remove(Number(args[0]) - 1);
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