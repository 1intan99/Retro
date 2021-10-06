import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { } from '@discordjs/voice'
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Skip extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Skip',
            aliases: ['skip', 'fs'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if the member is not in a channel, return
        if (!channel)
            return { err: `${emoji.msg.ERROR} Error`, description: `You need to join a voice channel.` };

        //if no player available return error | aka not playing anything
        const me = message.guild.me.voice
        if (!player){
            if(message.guild.me.voice.channel) {
            player.destroy();
                // @ts-ignore
                return message.channel.send({ embeds: [new MessageEmbed()
                    .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`)
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)]});
            }
            else {
            return { err: `${emoji.msg.ERROR} Error`, description: `No song is currently playing in this guild.`};
            }
            return
        }
        
        
        //if not in the same channel as the player, return Error
        if (channel.id !== player.voiceChannel)
            return { err: `${emoji.msg.ERROR} Error | You need to be in my voice channel to use this command!`, description: `Channelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\``}
        //if ther is nothing more to skip then stop music and leave the Channel
        if (player.queue.size == 0) {
            //if its on autoplay mode, then do autoplay before leaving...
            if(player.get("autoplay")) return this.client.util.autoplay(this.client, player, "skip");
            var irc = await this.client.util.reqChannel(this.client, player.textChannel, player.guild);
            if(irc) {
            return this.client.util.editReqTrack(this.client, player, player.queue.current, "destroy");
            }
            if(message.guild.me.voice.channel) {
            player.destroy()
                // @ts-ignore
                return message.channel.send({ embeds: [new MessageEmbed()
                    .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`)
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)]});
            }
            else {
            player.destroy()
            // @ts-ignore
            return message.channel.send({ embeds: [new MessageEmbed()
                .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`)
                .setColor(embed.color as ColorResolvable)
                .setFooter(embed.footertext, embed.footericon)]});
            }
            return
        }
        //skip the track
        player.stop();
        //send success message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle("✅ Success | ⏭ Skipped to the next Song")
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