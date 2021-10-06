import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable, TextChannel } from 'discord.js';
import { CmdReturn } from '../../TSConfig';
import { embed, emoji } from '../../conf/botconfig';

export default class TogglePremium extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Toggle Premium',
            aliases: ['togglepremium', 'tp'],
            developer: true
        });
    }

    public async start(message: Message, args: string[], prefix: string): Promise<CmdReturn | void> {
        if (!args[0]) {
            return { err: `${emoji.msg.ERROR}  ERROR | Please add the **TYPE**!`, description: `Usage: \`${prefix}togglepremium <user/guild> <Userid/Guildid>\`` };
            }
            if (!args[1]) {
            return { err: `${emoji.msg.ERROR}  ERROR | Please add the **ID**!`, description: `Usage: \`${prefix}togglepremium <user/guild> <Userid/Guildid>\`` };
            }
            if (args[1].length !== 18) {
                return { err: `${emoji.msg.ERROR}  ERROR | Please add the **valid ID**!`, description: `Usage: \`${prefix}togglepremium <user/guild> <Userid/Guildid>\`` };
            }
            this.client.util.databasing(this.client, args[1], args[1]);
            try {
                if(args[0].toLowerCase() === 'user') {
                    this.client.premium.set(args[1], true, `enable`);
                    try {
                        if (this.client.premium.get(args[1], `enable`)) this.client.premium.push(`premiumlist`, {
                            u: args[1]
                        }, `list`);
                        if (!this.client.premium.get(args[1], `enable`)) this.client.premium.remove(`premiumlist`, (value) => value.u === args[1], `list`);
                    } catch (e) {
                        console.log(String(e.stack).red);
                    }
                    let user = await this.client.users.fetch(args[1]);
                    console.log(user)
                    if (!user) {
                        try {
                            this.client.premium.remove(`premiumlist`, (value) => value.u === args[1], `list`);
                            this.client.premium.set(args[1], false, `enabled`);
                            return { err: `${emoji.msg.ERROR} Error`, description: `I cant reach out to that user, sorry!` };
                        } catch {
                            return { err: `${emoji.msg.ERROR} Error`, description: `I cant reach out to that user, sorry!`}
                        }
                    }
                    message.channel.send({ embeds: [new MessageEmbed()
                        .setFooter(embed.footertext, embed.footericon)
                        .setColor(this.client.premium.get(args[1], `enabled`) ? embed.color as ColorResolvable : embed.wrongcolor as ColorResolvable)
                        .setTitle(`${emoji.msg.SUCCESS}  SUCCESS | **${user.tag}** is now ${this.client.premium.get(args[1], `enabled`) ? `` : `**not**`} allowed to use the Premium Commands!`)]});
                    user.send({ embeds: [new MessageEmbed()
                        .setFooter(embed.footertext, embed.footericon)
                        .setColor(this.client.premium.get(args[1], `enabled`) ? embed.color as ColorResolvable : embed.wrongcolor as ColorResolvable)
                        .setTitle(`${this.client.premium.get(args[1], `enabled`) ? `${emoji.msg.SUCCESS}  You are now allowed and able to use Premium Commands` : `${emoji.msg.ERROR}  You are not allowed to use premium Commands anymore`}`)]});
                } 
                if (args[0].toLowerCase() === `guild`) {
                this.client.premium.set(args[1], !this.client.premium.get(args[1], `enabled`), `enabled`);
                try {
                    if (this.client.premium.get(args[1], `enabled`)) this.client.premium.push(`premiumlist`, {
                    g: args[1]
                    }, `list`);
                    if (!this.client.premium.get(args[1], `enabled`)) this.client.premium.remove(`premiumlist`, (value) => value.g === args[1], `list`);
                } catch (e) {
                    console.log(String(e.stack).red);
                }
                let guild = this.client.guilds.cache.get(args[1]);
                if (!guild) {
                    try {
                    this.client.premium.remove(`premiumlist`, (value) => value.g === args[1], `list`);
                    this.client.premium.set(args[1], false, `enabled`);
                    return { err: `${emoji.msg.ERROR} Error`, description: `I cant reach out to that guild, sorry!` };
                    } catch {
                    return { err: `${emoji.msg.ERROR} Error`, description: `I cant reach out to that guild, sorry!` };
                    }
                }
                const owner = message.guild.members.cache.get(message.guild.ownerId)
                owner.send({ embeds: [new MessageEmbed()
                    .setFooter(embed.footertext, embed.footericon)
                    .setColor(this.client.premium.get(args[1], `enabled`) ? embed.color as ColorResolvable : embed.wrongcolor as ColorResolvable)
                    .setTitle(`${this.client.premium.get(args[1], `enabled`) ? `${emoji.msg.SUCCESS} Your Guild \`${guild.name}\` is now allowed and able to use Premium Commands` : `${emoji.msg.ERROR} Your Guild\`${guild.name}\`is not allowed and able to use Premium Commands anymore`}`)]});
                let channel = guild.channels.cache.find((channel) => channel.type === `GUILD_TEXT` && channel.permissionsFor(guild.me).has(`SEND_MESSAGES`)) as TextChannel;
                message.channel.send({ embeds: [new MessageEmbed()
                    .setFooter(embed.footertext, embed.footericon)
                    .setColor(this.client.premium.get(args[1], `enabled`) ? embed.color as ColorResolvable : embed.wrongcolor as ColorResolvable)
                    .setTitle(`${emoji.msg.SUCCESS}  SUCCESS | **${guild.name}** is now ${this.client.premium.get(args[1], `enabled`) ? `` : `**not**`} allowed to use the Premium Commands!`)]})
                channel.send({ embeds: [new MessageEmbed()
                    .setFooter(embed.footertext, embed.footericon)
                    .setColor(this.client.premium.get(args[1], `enabled`) ? embed.color as ColorResolvable : embed.wrongcolor as ColorResolvable)
                    .setTitle(`${this.client.premium.get(args[1], `enabled`) ? `${emoji.msg.SUCCESS} This Guild is now allowed and able to use Premium Commands` : `${emoji.msg.ERROR}  This Guild is not allowed and able to use Premium Commands anymore`}`)]})
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