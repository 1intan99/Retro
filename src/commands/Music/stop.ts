import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Stop extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Stop',
            aliases: [`leave`, "dis", "disconnect", "votestop", "voteleave", "votedis", "votedisconnect", "vstop", "vleave", "vdis", "vdisconnect", "stop"],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //if there is no current track error
        if (!player){
            if(message.guild.me.voice.channel) {
            player.destroy()
            // @ts-ignore
                return message.channel.send({ embeds: [new MessageEmbed()
                    .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`)
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)]});
            }
            else {
            return { err: `${emoji.msg.ERROR} Error`, description: `No song is currently playing in this guild.` };
            }
            return
        }
        
        if (player.queue && !player.queue.current) {
            if(message.guild.me.voice.channel) {
            player.destroy()
            // @ts-ignore
                return message.channel.send({ embeds: [new MessageEmbed()
                    .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`)
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)]});
            }
            else {
            return { err: `${emoji.msg.ERROR} Error`, description: `No song is currently playing in this guild.` };
            }
            return
        }
            
        setTimeout(()=>{
            try{
            player.destroy();
            }catch{ }
            try{
            player.destroy()
            }catch{ }
        }, 4000)

        const irc = await this.client.util.reqChannel(this.client, player.textChannel, player.guild);
        if(irc) {
            this.client.util.editReqTrack(this.client, player, player.queue.current, "destroy");
            return;
        }
        //stop playing
        player.destroy();
        //send success message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`)
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