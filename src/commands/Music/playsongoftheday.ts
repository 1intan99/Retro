import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji, songoftheday } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Playsongoftheday extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Play Song Of The Day',
            aliases: ['psongoftheday', 'pstd'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        try {
            playermanger(this.client, message as Message, Array(songoftheday.track.url), `song:youtube`);
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}