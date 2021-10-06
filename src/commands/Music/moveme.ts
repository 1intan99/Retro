import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable, VoiceChannel } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Moveme extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Move Me',
            aliases: [`mm`, "mvm", "my", "mvy", "moveyou", "moveme"],
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        try {
            let channel = message.member.voice.channel as VoiceChannel;
            let botchannel = message.guild.me.voice.channel as VoiceChannel;
            if (!botchannel) {
                return { err: `${emoji.msg.ERROR} | Error`, description: `I am connected nowhere` };
            }
            if (!channel) {
                return { err: `${emoji.msg.ERROR} | Error`, description: `Please Connect first` };
            }
            if (botchannel.userLimit >= botchannel.members.size) {
                return { err: `${emoji.msg.ERROR} | Error`, description: `The channel is full, I can't move you` };
            }
            message.member.voice.setChannel(botchannel);
            // @ts-ignore
            return message.channel.send({ embeds: [new MessageEmbed()
                .setColor(embed.color as ColorResolvable)
                .setFooter(embed.footertext, embed.footericon)
                .setTitle(`${emoji.msg.SUCCESS} SUCCESS | moved you to: \`${botchannel.name}\``)]})
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}