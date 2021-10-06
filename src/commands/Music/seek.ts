import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Seek extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Seek',
            aliases: ['seek'],
            developer: true
        });
    }

    public async start(message: Message, args: any): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //if number is out of range return error
        if (Number(args[0]) < 0 || Number(args[0]) >= player.queue.current.duration / 1000)
            return { err: `${emoji.msg.ERROR} Error`, description: `You may seek from \`0\` - \`${player.queue.current.duration}\``};
        //seek to the position
        player.seek(Number(args[0]) * 1000);
        //send success message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | Seeked song to: ${this.client.util.formatTime(Number(args[0]) * 1000)}`)
            .addField(`${emoji.msg.time} Progress: `, this.client.util.createBar(player))
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