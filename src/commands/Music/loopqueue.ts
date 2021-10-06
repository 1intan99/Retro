import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class LoopQueue extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Loop Queue',
            aliases: [`repeatqueue`, `lq`, `rq`, `loopqu`, `repeatqu`]
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
            const embeds = new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.repeat_mode} Changed Queue loop to: ${player.queueRepeat ? `${emoji.msg.disabled} disabled` : `${emoji.msg.enabled} active`}`)
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            if (player.trackRepeat) {
                embeds.setDescription(`And **Song** Repeat got **${emoji.msg.disabled} disabled**`);
                player.setTrackRepeat(false);
            }
            player.setQueueRepeat(!player.queueRepeat);
            // @ts-ignore
            return message.channel.send({ embeds: [embeds] });
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}