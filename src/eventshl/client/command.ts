import Event from "../../handlers/events";
import Retro from "../..";
import {
  ColorResolvable,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import ms from "pretty-ms";
import { Command as Cmd } from "../../handlers/command";
import { embed } from "../../conf/botconfig";

export default class RunCmd extends Event {
  public constructor(client: Retro) {
    super(client, {
      name: "Command Event",
      emiter: "messageCreate",
    });
  }

  public async run(message: Message): Promise<Message | void> {
    if (message.author.bot || !message.guild) return;
    const [cp, prefix] = await this.client.util.prefixReg(message);
    if (!prefix && cp) return;
    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command =
      this.client.command.get(cmd.toLowerCase()) ||
      this.client.command.get(this.client.alises.get(cmd.toLowerCase()));
    if (!command) return;

    const {
      aliases,
      cooldown,
      developer,
      status,
      userPermissions,
      clientPermissions,
    } = command;
    const now = Date.now();
    const ts = this.client.cooldown.get(aliases[0]);
    const cd = cooldown * 1000;
    let is = ts.get(message.author.id);

    if (is) {
      is += cd;
      if (now < is) {
        const tl = is - now;
        message.reply(`Tunggu lerr.... ${ms(tl, { verbose: true })}`);
        return;
      }
    }

    const bm = new RegExp(`<@!?${this.client.user.id}>`);
    const men = message.mentions.users;

    if (bm.test(prefix) && men.size && !bm.test(args.join(" "))) {
      men.delete(this.client.user.id);
    }

    const isDev: boolean = this.client.dev.includes(message.author.id);
    if (isDev) return this.cmd(command, message, args, cp);
    if (developer && !isDev) return;
    if (status.mt && !isDev)
      return message.reply(
        `This command is currently under maintenanance for reason \`${status.reason}\``
      );
    if (userPermissions[0] === "Custom") {
      const alow = await command.allowed(message);
      if (alow) return this.cmd(command, message, args, cp);
      return message.reply(`YNKTS`);
    }
    if (
      userPermissions[0] &&
      !message.member.permissions.has(userPermissions[0])
    )
      return message.reply(`GABOLEH SAMA JOKOWI!`);
    const myp = await message.guild.me.permissionsIn(
      message.channel as TextChannel
    );
    if (!myp.has(clientPermissions[0]))
      return message.reply(
        `BILANGIN PAK JOKOWI GW MINTA \`${clientPermissions.toLocaleString}\``
      );

    this.cmd(command, message, args, cp);
  }

  async cmd(
    command: Cmd,
    message: Message,
    args: string[],
    prefix: string
  ): Promise<Message | void> {
    const e = new MessageEmbed().setColor(embed.color as ColorResolvable);

    const isd = this.client.dev.includes(message.author.id);
    try {
      const cmd = await command.start(message, args, prefix);
      if (cmd && cmd.err) {
        let ex = cmd.example || cmd.description || command.usage;
        ex = ex.replace(/{prefix}/g, prefix);
        e.setColor(embed.wrongcolor as ColorResolvable);
        e.setFooter(embed.footertext, embed.footericon);
        e.setTitle(cmd.err);
        e.setDescription(cmd.description);
        // @ts-ignore
        return message.channel.send({ embeds: [e] });
      }
      const cd = this.client.cooldown.get(command.aliases[0]);
      if (!isd) {
        cd.set(message.author.id, Date.now());
        setTimeout(() => cd.delete(message.author.id), command.cooldown * 1000);
      }
    } catch (er) {
      const is = (err: Error) => (isd ? err.stack : err.message);
      message.channel.send({ content: `Ooops... An error occured\n${is(er)}` });
      this.client.cvent.emit("logger", "error", er.stack);
    }
  }
}
