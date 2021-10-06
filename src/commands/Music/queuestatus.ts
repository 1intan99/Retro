import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable, VoiceChannel, TextChannel } from 'discord.js';
import { embed, emoji, settings } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class QueueStatus extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Queue Status',
            aliases: ['queuestatus', 'qs'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //toggle autoplay
        const vc = this.client.channels.cache.get(player.voiceChannel) as VoiceChannel;
        const ch = this.client.channels.cache.get(player.textChannel) as TextChannel;
        let embeds = new MessageEmbed()
        try {
            embeds.setTitle(`Connected to:  \`🔈${vc.name}\``)
        } catch {}
        try {
            embeds.setDescription(`And bound to: \`#${ch.name}\`   **▬**   Queue length: \`${player.queue.length} Songs\``)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.raise_volume} Volume`, `${player.volume}%`, true)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.equalizer} Equalizer: `, `${emoji.msg.playing} Music`, true)
        } catch {}
        try {
            embeds.addField(`${player.queueRepeat ? `${emoji.msg.autoplay_mode} Queue Loop: ` : `${emoji.msg.autoplay_mode} Song Loop: `}`, `${player.queueRepeat ? `${emoji.msg.SUCCESS} Enabled` : player.trackRepeat ? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}`, true)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.leave_on_empty} Leave on Empty Channel: `, `${settings.LeaveOnEmpty_Queue.enable ? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}`, true)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.repeat_mode} Leave on Empty Queue: `, `${settings.LeaveOnEmpty_Queue.enable? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}`, true)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.autoplay_mode} Autoplay`, `${player.get(`autoplay`) ? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}`, true)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.premium} Premium GUILD`, `${this.client.premium.get(player.guild).enabled ? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}`, true)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.premium} Premium USER`, `${this.client.premium.get(player.get(`playerauthor`)).enabled ? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}`, true)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.premium} 24/7 AFK Setup`, `PLAYER: ${player.get(`afk-${player.get(`playerauthor`)}`) ? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}\nGUILD: ${player.get(`afk-${player.guild}`) ? `${emoji.msg.SUCCESS} Enabled` : `${emoji.msg.ERROR} Disabled`}`, true)
        } catch {}
        try {
            embeds.setColor(embed.color as ColorResolvable)
        } catch {}
        try {
            embeds.setFooter(embed.footertext, embed.footericon);
        } catch {}
        try {
            embeds.addField(`${emoji.msg.disk} Current Track: `, `${player.playing ? `${emoji.msg.resume}` : `${emoji.msg.pause}`} [**${player.queue.current.title}**](${player.queue.current.uri})`)
        } catch {}
        try {
            embeds.addField(`${emoji.msg.time} Progress: `, this.client.util.createBar(player))
        } catch {}
        message.channel.send({ embeds: [embeds]});
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}