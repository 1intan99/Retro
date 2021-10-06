import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class AddPrevious extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Add Prevois",
      aliases: ["addprevious", "addp"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const player = this.client.manager.players.get(message.guild.id);
    try {
      //define the type
      let type = `song:youtube`;
      //if the previous was from soundcloud, then use type soundcloud
      if (player.queue.previous.uri.includes(`soundcloud`))
        type = `song:soundcloud`;
      playermanger(
        this.client,
        message,
        Array(player.queue.previous.uri),
        type
      );
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
