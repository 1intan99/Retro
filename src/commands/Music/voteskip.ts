import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class VoteSkip extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Vote Skip',
            aliases: ['voteskip', 'vs'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //Check if there is a Dj Setup
        const channel = message.member.voice.channel
        if (this.client.settings.get(message.guild.id, `djroles`).toString() !== ``) {

            let channelmembersize = channel.members.size;
            let voteamount = 0;
            if (channelmembersize <= 3) voteamount = 1;
            voteamount = Math.ceil(channelmembersize / 3);

            if (!player.get(`vote-${message.author.id}`)) {
            player.set(`vote-${message.author.id}`, true);
            player.set(`votes`, String(Number(player.get(`votes`)) + 1));
            if (voteamount <= Number(player.get(`votes`))) {
                message.channel.send({ embeds: [new MessageEmbed()
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)
                    .setTitle(`${emoji.msg.SUCCESS} Success | Added your Vote!`)
                    .setDescription(`There are now: \`${player.get(`votes`)}\` of \`${voteamount}\` needed Votes\n\n> Amount reached! Skipping ⏭`)]});
                if (player.queue.size == 0) {
                const irc = await this.client.util.reqChannel(this.client, player.textChannel, player.guild);
                if(irc) {
                    return this.client.util.editReqTrack(this.client, player, player.queue.current, "destroy");
                }
                //stop playing
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
                } else {
                player.stop();
                }
            } else {
                // @ts-ignore
                return message.channel.send({ embeds: [new MessageEmbed()
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)
                    .setTitle(`${emoji.msg.SUCCESS} Success | Added your Vote!`)
                    .setDescription(`There are now: \`${player.get(`votes`)}\` of \`${voteamount}\` needed Votes`)]});
            }
            } else {
            return { err: `${emoji.msg.ERROR} ERROR | You have already Voted!!`, description: `There are: \`${player.get(`votes`)}\` of \`${voteamount}\` needed Votes` };
            }
        } else {
            //if ther is nothing more to skip then stop music and leave the Channel
            if (player.queue.size == 0) {
            //if its on autoplay mode, then do autoplay before leaving...
            if (player.get(`autoplay`)) return this.client.util.autoplay(this.client, player, `skip`);
            const irc = await this.client.util.reqChannel(this.client, player.textChannel, player.guild);
            if(irc) {
                return this.client.util.editReqTrack(this.client, player, player.queue.current, "destroy");
            }
            //stop playing
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
                .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.skip_track} Skipped to the next Song`)
                .setColor(embed.color as ColorResolvable)
                .setFooter(embed.footertext, embed.footericon)]});
        }
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}