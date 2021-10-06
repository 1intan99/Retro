import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class ForceSkip extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Force Skip",
      aliases: ["forceskip", "fs"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const player = this.client.manager.players.get(message.guild.id);
    try {
      if (player.queue.size === 0) {
        if (player.get("autoplay"))
          return this.client.util.autoplay(this.client, player, `skip`);
        player.destroy();
        // @ts-ignore
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle(
                `${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`
              )
              .setColor(embed.color as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon),
          ],
        });
      }
      player.stop();
      // @ts-ignore
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${emoji.msg.SUCCESS} Success | ${emoji.msg.skip_track} Skipped to the next Song`
            )
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon),
        ],
      });
    } catch (e) {
      console.log(String(e.stack).red);
      // @ts-ignore
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.wrongcolor as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(`${emoji.msg.ERROR} ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``),
        ],
      });
    }
  }
}
