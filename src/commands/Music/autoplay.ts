import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class AutoPlay extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Auto Play",
      aliases: ["autoplay", "ap"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const player = this.client.manager.players.get(message.guild.id);
    try {
      player.set("autoplay", !player.get("autoplay"));
      // @ts-ignore
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${emoji.msg.SUCCESS} Success | ${
                player.get(`autoplay`)
                  ? `${emoji.msg.enabled} Enabled`
                  : `${emoji.msg.disabled} Disabled`
              } Autoplay`
            )
            .setDescription(
              `To ${
                player.get(`autoplay`) ? `disable` : `enable`
              } it type: \`rautoplay\``
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
