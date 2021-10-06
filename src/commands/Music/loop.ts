import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class Loop extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Loop",
      aliases: ["loop", "repeat"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const loop = args.join(" ");
    const player = this.client.manager.players.get(message.guild.id);
    try {
      if (!loop)
        return {
          err: `${emoji.msg.ERROR} ERROR | Please add yout method!`,
          description: `\`loop song\` / \`loop queue\``,
        };
      if (
        loop.toLowerCase() === "song" ||
        loop.toLowerCase() === "track" ||
        loop.toLowerCase() === "s" ||
        loop.toLowerCase() === "t"
      ) {
        const embeds = new MessageEmbed()
          .setTitle(
            `${emoji.msg.SUCCESS} Success | ${
              emoji.msg.repeat_mode
            } Changed Track loop to: ${
              player.trackRepeat
                ? `${emoji.msg.disabled} disabled`
                : `${emoji.msg.enabled} active`
            }`
          )
          .setColor(embed.color as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon);
        if (player.queue.remove) {
          embeds.setDescription(
            `And **Queue** Repeat got **${emoji.msg.disabled} disabled**`
          );
          player.setQueueRepeat(false);
        }
        player.setTrackRepeat(!player.trackRepeat);
        // @ts-ignore
        return message.channel.send({ embeds: [embeds] });
      } else {
        // @ts-ignore
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.color as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon)
              .setTitle(`${emoji.msg.ERROR} Error | Please add your method!`)
              .setDescription(`\`loop song\` / \`loop queue\``),
          ],
        });
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
