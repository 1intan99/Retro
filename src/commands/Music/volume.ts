import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Volume extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Volume',
            aliases: ['volume', 'vol'],
            developer: true
        });
    }

    public async start(message: Message, args: any): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
        //if the Volume Number is out of Range return error msg
        if (Number(args[0]) <= 0 || Number(args[0]) > 150)
            return { err: `${emoji.msg.ERROR} Error`, description: `You may set the volume \`1\` - \`150\``};
        //if its not a Number return error msg
        if (isNaN(args[0]))
            return { err: `${emoji.msg.ERROR} Error`, description: `You may set the volume \`1\` - \`150\``};
        //change the volume
        player.setVolume(Number(args[0]));
        //send success message
        // @ts-ignore
        return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`${emoji.msg.SUCCESS} Success | ${emoji.msg.raise_volume} Volume set to: \`${player.volume}%\``)
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