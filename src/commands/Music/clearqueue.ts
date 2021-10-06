import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class ClearQueue extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Clear Queue",
      aliases: ["clearqueue", "cq"],
      hide: true,
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const player = this.client.manager.players.get(message.guild.id);
    try {
      player.queue.clear();
      // @ts-ignore
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${emoji.msg.SUCCESS} Success | ${emoji.msg.cleared} The queue is now cleared.`
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
