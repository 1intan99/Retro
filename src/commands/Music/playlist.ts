import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { CmdReturn } from "../../TSConfig";
import { playermanger } from "../../handlers/playermanager";

export default class Playlist extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Playlist",
      aliases: ["playlist", "pl"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const search = args.join(" ");
    try {
      if (!search)
        // @ts-ignore
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.wrongcolor as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon)
              .setTitle(
                `${emoji.msg.ERROR} Error | You need to give me a URL or a Search term.`
              ),
          ],
        });
      message.channel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.color as ColorResolvable)
              .setTitle(`**Searching** 🔎`)
              .setDescription(`\`\`\`${search}\`\`\``),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg
              .delete()
              .catch((e) =>
                console.log("Could not delete, this prevents a bug")
              );
          }, 5000);
        });
      playermanger(this.client, message as Message, args, "playlist");
    } catch (e) {
      console.log(String(e.stack).bgRed);
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
