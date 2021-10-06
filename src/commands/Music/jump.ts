import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class Jump extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Jump",
      aliases: ["jump", "skipto"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const skipto: any = args.join(" ");
    const player = this.client.manager.players.get(message.guild.id);
    try {
      if (!skipto)
        return {
          err: `${emoji.msg.ERROR} ERROR | please include to which track you want to jump`,
          description: `Example: \`jump ${
            player.queue.size - 2 <= 0
              ? player.queue.size
              : player.queue.size - 2
          }\``,
        };
      if (isNaN(skipto))
        return {
          err: `${emoji.msg.ERROR} ERROR`,
          description: "It has to be a queue **Number**",
        };
      if (Number(skipto) > player.queue.size)
        return {
          err: `${emoji.msg.ERROR} ERROR`,
          description: "That song is not in the queue, sorry!",
        };

      player.queue.remove(0, Number(skipto) - 1);
      player.stop();

      //@ts-ignore
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${emoji.msg.SUCCESS} Success | Jumped to the: \`${skipto}\` Song`
            )
            .setDescription(
              `${emoji.msg.skip_track} Skipped \`${Number(skipto)}\` Songs`
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
