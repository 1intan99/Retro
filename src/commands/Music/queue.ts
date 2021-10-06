import Retro from '../..';
import Command from '../../handlers/command';
import { Message, MessageEmbed, ColorResolvable, User, GuildMember } from 'discord.js';
import { embed, emoji } from '../../conf/botconfig';
import { playermanger } from '../../handlers/playermanager';
import { CmdReturn } from '../../TSConfig';
const emj = ["⬅️", "➡️"];

export default class Queue extends Command {
    public constructor(client: Retro) {
        super(client, {
            name: 'Queue',
            aliases: ['queue', 'qu', 'q', 'list'],
            developer: true
        });
    }

    public async start(message: Message, args: string[]): Promise<CmdReturn | void> {
        const player = this.client.manager.players.get(message.guild!.id);
        if (!player) return { err: `${emoji.msg.ERROR} | Error`, description: `There is nothing playing here!`};

        let map = player.queue.map((track, index) => `${++index} - [${track.title}](${track.uri}) Request by: ${track.requester}`);
        let array = [];
        for (const m of map) { array.push(m); }
        map = await this.chunk(array);
        const x = map.length;
        const y = 1;
        const start = y * x;
        const end = start - x;
        const Embed = new MessageEmbed()
        .setAuthor(`Queue list for ${message.guild.name}`)
        .setDescription(String(array.slice(end, start).join("\n")));
        const msg = await message.channel.send({ embeds: [Embed] });
        msg.react(emj[0]);
        msg.react(emj[1]);
        await this.page(msg, message.author, map);
    }

    public async page(message: Message, user: any, data: any, page = 0) {
        const filter: any = (x: any, i: GuildMember) => i.id === user.id && emj.includes(x.emoji.name);
        let res = await message.awaitReactions({filter, max: 1, time: 60000, errors: ["time"] }) as any;
        if (!res) return message.reactions.removeAll();

        res = res.first();
        res.users.remove(user.id);
        const { name } = res.emoji;
        if (name === emj[0]) --page;
        if (name === emj[1]) ++page;

        page = page > data.length - 1 ? 0 : page < 0 ? data.length - 1 : page;

        const Embed = new MessageEmbed()
            .setColor(embed.color as ColorResolvable)
            .setDescription(String(data[page].join("\n")))
            .setFooter(`Page ${page + 1}/${data.length}`);
        message.edit({ embeds: [Embed] });
        this.page(message, user, data, page);
    }

    public async chunk(data: any, chunkSize = 5): Promise<any> {
        const temp = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            temp.push(data.slice(i, i + chunkSize));
        }
        return temp;
        }
    }

