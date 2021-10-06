import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { CmdReturn } from '../../TSConfig';
import { embed, emoji, settings } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';

export default class Afk extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Afk',
            aliases: ['afk', '24/7', 'noleave']
        });
    }

    public async start(message: Message, args: string[], prefix: string): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
            this.client.util.databasing(this.client, message.guild.id, message.author.id);
            const { channel } = message.member.voice;
            if (!channel) return { err: `${emoji.msg.ERROR} Error`, description: `You need to join a voice channel.` };
            if (!player) return { err: `${emoji.msg.ERROR} Error`, description: `There is nothing playing.`};
            if (playermanger && channel.id !== player.voiceChannel) return { err: `${emoji.msg.ERROR}  Error | You need to be in my voice channel to use this command!`, description: `Channelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\`` };
            let gpremium = this.client.premium.get(message.guild.id);
            let ppremium = this.client.premium.get(message.author.id);
            let ownerstringarray = ``;
            for (let i = 0; i < this.client.dev.length; i++) {
                try {
                    let user = await this.client.users.fetch(this.client.dev[i]);
                    ownerstringarray += `\`${user.tag}\` /`;
                } catch (e) { }
            }
            ownerstringarray = ownerstringarray.substr(0, ownerstringarray.length - 2);
            if (!gpremium.enable && !ppremium.enable) return { err: `${emoji.msg.ERROR}  Error | No Premium Commands Available`, description: `Dm to get premium:\n ${ownerstringarray}`.substr(0, 2040) };
            if (!args[0]) return { err: `${emoji.msg.ERROR}  Error | Invalid Input method`, description: `Usage: \`${prefix}afk [guild/user]\`\n${emoji.msg.premium} Player Premium: ${ppremium ? (ppremium.enabled ? `${emoji.msg.enabled} Enabled` : `${emoji.msg.ERROR}  Disabled\nDm to enable:\n> ${ownerstringarray.substr(0, ownerstringarray.length - 1)}`.substr(0, 1020)) : `${emoji.msg.ERROR}  Disabled`}\n${emoji.msg.premium} Guild Premium: ${gpremium ? (gpremium.enabled ? `${emoji.msg.enabled} Enabled` : `${emoji.msg.ERROR}  Disabled\nDm to enable:\n> ${ownerstringarray.substr(0, ownerstringarray.length - 1)}`.substr(0, 1020)) : `${emoji.msg.ERROR}  Disabled`}` };

            if(args[0].toLocaleLowerCase() === `guild`) {
                if (!gpremium.enable) return { err: `${emoji.msg.ERROR}  Error | No Premium Commands Available for this Guild`, description: `Dm to get premium:\n ${ownerstringarray}`.substr(0, 2040) };
                player.set(`afk-${message.guild.id}`, !player.get(`afk-${message.guild.id}`));
                // @ts-ignore
                return message.channel.send({ embeds: [new MessageEmbed()
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)
                    .setTitle(`${emoji.msg.premium} Successfully ${player.get(`afk-${message.guild.id}`) ? `${emoji.msg.enabled} Enabled` : `${emoji.msg.disabled}  Disabled`} 24/7`)
                    .setDescription(`For the Guild: \`${message.guild.name}\``)]})
            } else if (args[0].toLowerCase() === `user`) {
                if (!ppremium.enable) return { err: `${emoji.msg.ERROR}  Error | No Premium Commands Available for this Guild`, description: `Dm to get premium:\n ${ownerstringarray}`.substr(0, 2040) };
                if (message.author.id !== player.get(`playerauthor`)) return { err: `${emoji.msg.ERROR}  Error | You did not created that player!`, description: `*The one who requests, the first Song is the Creator of the Player: * ${message.guild.members.cache.get(player.get(`playerauthor`)) ? message.guild.members.cache.get(player.get(`playerauthor`)).user : "could not get the data of the USER"}` };
                player.set(`afk-${player.get('playerauthor')}`,  !player.get(`afk-${player.get('playerauthor')}`));
                // @ts-ignore
                return message.channel.send({ embeds: [new MessageEmbed()
                    .setColor(embed.color as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon)
                    .setTitle(`${emoji.msg.premium} Successfully ${player.get(`afk-${player.get(`playerauthor`)}`) ? `${emoji.msg.enabled} Enabled` : `${emoji.msg.disabled}  Disabled`} 24/7`)
                    .setDescription(`For the Player: \`${message.author.tag}\``)]})
            } else {
                return { err: `${emoji.msg.ERROR}  Error | Invalid Input method`, description: `Usage: \`${prefix}afk [guild/user]\`` };
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