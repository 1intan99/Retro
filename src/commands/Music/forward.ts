import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class Forward extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Forward",
      aliases: ["forward", "fw"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const fw = args.join(" ");
    const player = this.client.manager.players.get(message.guild.id);
    try {
      if (!fw)
        return {
          err: `${emoji.msg.ERROR} ERROR`,
          description: `You may forward for \`1\` - \`${player.queue.current.duration}\``,
        };
      let seektime = Number(player.position) + Number(fw) * 1000;
      if (Number(fw) <= 0) seektime = Number(player.position);
      if (Number(seektime) >= player.queue.current.duration)
        seektime = player.queue.current.duration - 1000;
      player.seek(Number(seektime));
      // @ts-ignore
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${emoji.msg.SUCCESS} Success | ${emoji.msg.forward} Forwarded the Song `
            )
            .setDescription(
              `Forwarded for \`${
                args[0]
              } Seconds\` to: ${this.client.util.formatTime(
                Number(player.position)
              )}`
            )
            .addField(
              `${emoji.msg.time} Progress: `,
              this.client.util.createBar(player)
            )
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon),
        ],
      });
    } catch (e) {
      console.log(String(e.stack).red);
      return {
        err: `${emoji.react.ERROR} ERROR`,
        description: `\`\`\`${e.message}\`\`\``,
      };
    }
  }
}
