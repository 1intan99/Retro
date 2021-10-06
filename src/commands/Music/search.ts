import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Retro from "../..";
import { embed, emoji } from "../../conf/botconfig";
import Command from "../../handlers/command";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class Search extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Search",
      aliases: ["search", "sc"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const search = args.join(" ");
    try {
      if (!search) {
        // @ts-ignore
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.wrongcolor as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon)
              .setTitle(
                `${emoji.msg.ERROR} Error | You need to give me a URL or a search term.`
              ),
          ],
        });
      }
      playermanger(this.client, message as Message, args, `search:youtube`);
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
