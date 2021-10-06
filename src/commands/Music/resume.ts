import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Resume extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Resum',
            aliases: ['resume'],
            developer: true
        });
    }

    public async start(message: Message, args: string[], prefix: string): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
            if (!player.playing) return { err: `${emoji.msg.ERROR} Error | The is already paused!`, description: `You can resume it with: \`${prefix}resume\`` };
            player.pause(false);
            // @ts-ignore
            return message.channel.send({ embeds: [new MessageEmbed()
                .setTitle(`${emoji.msg.SUCCESS} Success | ${player.playing ? `${emoji.msg.resume} Resumed` : `${emoji.msg.pause} Paused`} the Player.`)
                .setColor(embed.color as ColorResolvable)
                .setFooter(embed.footertext, embed.footericon)
                .addField(`${emoji.msg.time} Progress: `, this.client.util.createBar(player))]})
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}