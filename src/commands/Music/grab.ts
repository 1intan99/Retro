import Retro from "../..";
import Command from "../../handlers/command";
import { Message, MessageEmbed, ColorResolvable, User } from "discord.js";
import { embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../../handlers/playermanager";
import { CmdReturn } from "../../TSConfig";

export default class Garb extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Grab",
      aliases: ["grab", "save"],
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const player = this.client.manager.players.get(message.guild.id);
    const user = player.queue.current.requester as User;
    message.author
      .send({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              `Save song`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(embed.footericon)
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(
              `${
                player.playing ? `${emoji.msg.resume}` : `${emoji.msg.pause}`
              } **${player.queue.current.title}**`
            )
            .addField(
              `${emoji.msg.time} Duration: `,
              `\`${this.client.util.formatTime(
                player.queue.current.duration
              )}\``,
              true
            )
            .addField(
              `${emoji.msg.song_by} Song By: `,
              `\`${player.queue.current.author}\``,
              true
            )
            .addField(
              `${emoji.msg.repeat_mode} Queue length: `,
              `\`${player.queue.length} Songs\``,
              true
            )
            .addField(
              `${emoji.msg.playing} Play it:`,
              `\`rplay ${player.queue.current.uri}\``
            )
            .addField(
              `${emoji.msg.search} Saved in:`,
              `<#${message.channel.id}>`
            )
            .setFooter(
              `Requested by: ${user.tag} | in: ${message.guild.name}`,
              user.displayAvatarURL({ dynamic: true })
            ),
        ],
      })
      .catch((e) => {
        return message.channel.send({
          content: "**❌ Your Dm's are disabled**",
        });
      });
    message
      .react(emoji.react.SUCCESS)
      .catch((e) => console.log("Could not react"));
  }
}
