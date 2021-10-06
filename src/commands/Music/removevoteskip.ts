import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Removevoteskip extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Remove Vote Skip',
            aliases: [`rvs`, `removeskip`, `removevs`, `votestop`, `stopvote`],
            developer: true
        });
    }

    public async start(message: Message, args: string[], prefix: string): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //Check if there is a Dj Setup
        const channel = message.member.voice.channel
        if (this.client.settings.get(message.guild.id, `djroles`).toString() !== ``) {
            let channelmembersize = channel.members.size;
            let voteamount = 0;
            if (channelmembersize <= 3) voteamount = 1;

            voteamount = Math.ceil(channelmembersize / 3);

            if (player.get(`vote-${message.author.id}`)) {
            player.set(`vote-${message.author.id}`, false)
            player.set(`votes`, String(Number(player.get(`votes`)) - 1));
            // @ts-ignore
            return message.channel.send(new MessageEmbed()
                .setColor(embed.color as ColorResolvable)
                .setFooter(embed.footertext, embed.footericon)
                .setTitle(`${emoji.msg.SUCCESS} Success | Removed your Vote!`)
                .setDescription(`There are now: \`${player.get(`votes`)}\` of \`${voteamount}\` needed Votes`)
            );
            } else {
            return { err: `${emoji.msg.ERROR} ERROR | You havn't voted yet!!`, description: `There are: \`${player.get(`votes`)}\` of \`${voteamount}\` needed Votes`};
            }
        } else
            return { err: `${emoji.msg.ERROR} ERROR | Cannot remove your Vote!`, description: `Because ther is no DJ-Role Setup created yet, create it by typing \`${prefix}adddj @DJ-Setup\`` };
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}