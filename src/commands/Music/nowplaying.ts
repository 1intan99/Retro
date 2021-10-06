import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable, User } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Nowplaying extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Now Playing',
            aliases: [`np`, `current`, `nowplaying`]
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
            if (!player.queue.current) {
                return { err: `${emoji.msg.ERROR} | Error`, description: `There is nothing playing` };
            }
            let user = player.queue.current.requester as User
            // @ts-ignore
            return message.channel.send({ embeds: [new MessageEmbed()
                .setAuthor(`Current song playing:`, message.author.displayAvatarURL({
                dynamic: true
                }))
                .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
                .setURL(player.queue.current.uri)
                .setColor(embed.color as ColorResolvable)
                .setFooter(embed.footertext, embed.footericon)
                .setTitle(`${player.playing ? `${emoji.msg.resume}` : `${emoji.msg.pause}`} **${player.queue.current.title}**`)
                .addField(`${emoji.msg.time} Duration: `, `\`${this.client.util.formatTime(player.queue.current.duration)}\``, true)
                .addField(`${emoji.msg.song_by} Song By: `, `\`${player.queue.current.author}\``, true)
                .addField(`${emoji.msg.repeat_mode} Queue length: `, `\`${player.queue.length} Songs\``, true)
                .addField(`${emoji.msg.time} Progress: `, this.client.util.createBar(player))
                .setFooter(`Requested by: ${user.tag}`, user.displayAvatarURL({
                dynamic: true
                }))]});
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}