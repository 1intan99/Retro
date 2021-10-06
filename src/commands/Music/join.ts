import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Retro from "../..";
import { embed, emoji, settings } from "../../conf/botconfig";
import Command from "../../handlers/command";
import { CmdReturn } from "../../TSConfig";

export default class Join extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Join",
      aliases: ["join"],
    });
  }

  public async start(message: Message): Promise<CmdReturn | void> {
    try {
      const { channel } = message.member.voice;
      if (!channel)
        return {
          err: `${emoji.msg.ERROR} Error`,
          description: `You're not connected to Voice Channel`,
        };
      let player = this.client.manager.players.get(message.guild.id);

      if (player) {
        const vc = player.voiceChannel;
        const voiceChannel = message.guild.channels.cache.get.arguments(
          player.voiceChannel
        );
        // @ts-ignore
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.wrongcolor as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon)
              .setTitle(
                `${emoji.msg.ERROR} ERROR | I am already connected somewhere`
              )
              .setDescription(
                `I am connected in: \`${
                  vc
                    ? voiceChannel
                      ? voiceChannel.name
                      : vc
                    : "could not get voicechanneldata"
                }\``
              ),
          ],
        });
      }
      player = this.client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: settings.selfDef,
      });
      if (player.state !== "CONNECTED") {
        player.connect();
        player.stop();
      } else {
        const vc = player.voiceChannel;
        const voiceChannel = message.guild.channels.cache.get.arguments(
          player.voiceChannel
        );
        // @ts-ignore
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.wrongcolor as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon)
              .setTitle(
                `${emoji.msg.ERROR} ERROR | I am already connected somewhere`
              )
              .setDescription(
                `I am connected in: \`${
                  vc
                    ? voiceChannel
                      ? voiceChannel.name
                      : vc
                    : "could not get voicechanneldata"
                }\``
              ),
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
