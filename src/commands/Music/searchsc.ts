import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class SearchSc extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Search Soundcloud',
            aliases: ['searchsoundcloud', 'sch'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        const song = args.join(" ");
        try {
            if (!song) return { err: `${emoji.msg.ERROR} Error`, description: `You need to give me a URL or a search term.`};
            playermanger(this.client, message as Message, args, `search:soundcloud`)
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}