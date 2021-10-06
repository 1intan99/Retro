import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';

export default class Playprevious extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Play Previous',
            aliases: [`pp`, `ppre`, `playprevius`, `playprevios`],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild.id);
        try {
            let type = `skiptrack:youtube`;
            if (player.queue.previous.uri.includes(`soundcloud`)) type = `skiptrack:soundcloud`;
            playermanger(this.client, message as Message, Array(player.queue.previous.uri), type);
        } catch (e) {
            console.log(String(e.stack).red);
            return {
            err: `${emoji.react.ERROR} ERROR`,
            description: `\`\`\`${e.message}\`\`\``,
            };
        }
    }
}