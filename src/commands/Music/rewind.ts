import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Rewind extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Rewind',
            aliases: [`seekbackwards`, `rew`, `rewind`],
            developer: true
        });
    }

    public async start(message: Message, args: any): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
            if (!args[0])
            return { err: `${emoji.msg.ERROR} Error`, description: `You may rewind for \`1\` - \`${player.queue.current.duration}\``}

        let seektime = player.position - Number(args[0]) * 1000;
        if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
            seektime = 0;
        }
        //seek to the right time
        player.seek(Number(seektime));
        //send success message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.rewind} Rewinded the song for \`${args[0]} Seconds\` to: ${this.client.util.formatTime(Number(player.position))}`)
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