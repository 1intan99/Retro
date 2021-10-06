import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Retro from "../..";
import { embed, settings } from "../../conf/botconfig";

export async function playlist(
  client: Retro,
  message: Message,
  args?: any,
  type?: any
) {
  const search = args.join(" ");

  try {
    let res;
    let player = client.manager.players.get(message.guild.id);
    if (!player) {
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: settings.selfDef,
      });
    }
    const state = player.state;
    if (state !== "CONNECTED") {
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      player.stop();
    }
    try {
      res = await client.manager.search(search, message.author);
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "SEARCH_RESULT")
        throw message.channel.send({
          content:
            "Search are not suppedted with this command. Use r.play or r.search",
        });
    } catch (e) {
      console.log(String(e.stack).red);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(`❌ Error | There was an error while searchingL`)
            .setDescription(`\`\`\`${e.message}\`\`\``),
        ],
      });
    }
    if (!res.tracks[0]) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(
              `${String(`❌ Error | Found nothing for: **\`${search}`).substr(
                0,
                256 - 3
              )}\`**`
            )
            .setDescription(`Please retry!`),
        ],
      });
    }

    if (player.state !== "CONNECTED") {
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      player.queue.add(res.tracks);
      player.play();
      player.pause(false);

      const irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqTrack(client, player, player.queue.current);
        client.util.editReqQueue(client, player);
      }
    } else if (!player.queue || !player.queue.current) {
      player.queue.add(res.tracks);
      player.play();
      player.pause(false);

      const irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqTrack(client, player, player.queue.current);
        client.util.editReqQueue(client, player);
      }
    } else {
      player.queue.add(res.trakcs);
      const irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqQueue(client, player);
      }
    }
    const playlistembed = new MessageEmbed()
      .setTitle(
        `${`Added Playlist 🩸 **\`${res.playlist.name}`.substr(0, 256 - 3)}\`**`
      )
      .setURL(res.playlist.uri)
      .setColor(embed.color as ColorResolvable)
      .setFooter(embed.footertext, embed.footericon)
      .setThumbnail(embed.footericon)
      .addField(
        "⌛ Duration: ",
        `\`${client.util.formatTime(res.playlist.duration)}\``,
        true
      )
      .addField("🔂 Queue length: ", `\`${player.queue.length} Songs\``, true)
      .setFooter(
        `Requested by: ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      );
    message.channel.send({ embeds: [playlistembed] }).then((msg) => {
      if (msg) {
        setTimeout(() => {
          msg
            .delete()
            .catch((e) =>
              console.log(
                "couldn't delete message this is a catch to prevent a crash"
                  .grey
              )
            );
        }, 4000);
      }
    });
  } catch (e) {
    console.log(String(e.stack).red);
    message.channel
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.wrongcolor as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(
              `${String(`❌ Error | Found nothing for: **\`${search}`).substr(
                0,
                256 - 3
              )}\`**`
            ),
        ],
      })
      .then((msg) => {
        if (msg) {
          setTimeout(() => {
            msg
              .delete()
              .catch((e) =>
                console.log(
                  "Couldn't delet message this is a catch to prevent a crash"
                    .grey
                )
              );
          }, 5000);
        }
      });
  }
}
