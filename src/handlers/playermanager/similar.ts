import {
  ColorResolvable,
  Message,
  MessageEmbed,
  TextChannel,
  User,
} from "discord.js";
import Retro from "../..";
import { embed } from "../../conf/botconfig";

export async function similar(
  client: Retro,
  message: Message,
  args?: string[],
  type?: any
) {
  try {
    const mixURL = args.join(" ");
    var player = client.manager.players.get(message.guild.id);
    const res = await client.manager.search(mixURL, message.author);
    if (
      !res ||
      res.loadType === "LOAD_FAILED" ||
      res.loadType !== "PLAYLIST_LOADED"
    ) {
      const ch = client.channels.cache.get(player.textChannel) as TextChannel;
      return ch.send({
        embeds: [
          new MessageEmbed()
            .setTitle("❌ Error | Found nothing related for the latest Song")
            .setColor(embed.wrongcolor as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon),
        ],
      });
    }
    if (type.split(":")[1] === "add") {
      player.queue.add(res.tracks[0]);
      const irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqQueue(client, player);
      }
      const user = res.tracks[0].requester as User;
      const embed2 = new MessageEmbed()
        .setTitle(
          `${`Added to Queue 🩸 **\`${res.tracks[0].title}`.substr(
            0,
            256 - 3
          )}\`**`
        )
        .setURL(res.tracks[0].uri)
        .setColor(embed.color as ColorResolvable)
        .setFooter(embed.footertext, embed.footericon)
        .setThumbnail(
          `https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`
        )
        .addField(
          "⌛ Duration: ",
          `\`${
            res.tracks[0].isStream
              ? "LIVE STREAM"
              : client.util.formatTime(res.tracks[0].duration)
          }\``,
          true
        )
        .addField("💯 Song By: ", `\`${res.tracks[0].author}\``, true)
        .addField("🔂 Queue length: ", `\`${player.queue.length} Songs\``, true)
        .setFooter(
          `Requested by: ${user.tag}`,
          user.displayAvatarURL({ dynamic: true })
        );

      return message.channel.send({ embeds: [embed2] }).then((msg) => {
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
    }
    if (type.split(":")[1] === "search") {
      let max = 15;
      let collected;
      let track;
      const filter = (m) =>
        m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
      if (res.tracks.length < max) max = res.tracks.length;
      track = res.tracks[0];

      const results = res.tracks
        .slice(0, max)
        .map(
          (track, index) =>
            `**${++index})** [\`${String(track.title)
              .substr(0, 60)
              .split("[")
              .join("{")
              .split("]")
              .join("}")}\`](${track.uri}) - \`${
              client.util.formatTime(track.duration).split(" | ")[0]
            }\``
        )
        .join("\n");

      const searchembed = new MessageEmbed()
        .setTitle(
          `${`Search result for: 🔎 **\`${player.queue.current.title}`.substr(
            0,
            256 - 3
          )}\`**`
        )
        .setColor(embed.color as ColorResolvable)
        .setDescription(results)
        .setFooter(
          `Search-Request by: ${track.requester.tag}`,
          track.requester.displayAvatarURL({ dynamic: true })
        );
      message.channel.send({ embeds: [searchembed] });
      await message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle("👍 Pick your Song with the `INDEX Number`"),
        ],
      });
      try {
        collected = await message.channel.awaitMessages({
          filter,
          max: 1,
          time: 30e3,
          errors: ["time"],
        });
      } catch (e) {
        if (!player.queue.current) player.destroy();
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("❌ Error | You didn't provide a selection")
              .setColor(embed.wrongcolor as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon),
          ],
        });
      }
      const first = collected.first().content;
      if (first.toLowerCase() === "end") {
        if (!player.queue.current) player.destroy();
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.wrongcolor as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon)
              .setTitle("❌ Error | Cancelled selection."),
          ],
        });
      }
      const index = Number(first) - 1;
      if (index < 0 || index > max - 1) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(embed.wrongcolor as ColorResolvable)
              .setFooter(embed.footertext, embed.footericon)
              .setTitle(
                `❌ Error | The number you provided too small or too big (1-${max}).`
              ),
          ],
        });
      }
      if (player.state !== "CONNECTED") {
        // set the variables
        player.set("message", message);
        player.set("playerauthor", message.author.id);
        // Connect to the voice channel and add the track to the queue

        player.connect();
        player.queue.add(track);
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
        player.queue.add(track);
        const embeds = new MessageEmbed()
          .setTitle(
            `${`Added to Queue 🩸 **\`${track.title}`.substr(0, 256 - 3)}\`**`
          )
          .setURL(track.uri)
          .setColor(embed.color as ColorResolvable)
          .setThumbnail(track.displayThumbnail(1))
          .addField(
            "⌛ Duration: ",
            `\`${
              track.isStream
                ? "LIVE STREAM"
                : client.util.formatTime(track.duration)
            }\``,
            true
          )
          .addField("💯 Song By: ", `\`${track.author}\``, true)
          .addField(
            "🔂 Queue length: ",
            `\`${player.queue.length} Songs\``,
            true
          )
          .setFooter(
            `Requested by: ${track.requester.tag}`,
            track.requester.displayAvatarURL({ dynamic: true })
          );

        const irc = await client.util.reqChannel(
          client,
          player.textChannel,
          player.guild
        );
        if (irc) {
          client.util.editReqQueue(client, player);
        }
        return message.channel.send({ embeds: [embeds] }).then((msg) => {
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
      }
    }
  } catch (e) {
    console.log(String(e.stack).red);
    return message.channel
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.wrongcolor as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(
              `${String(
                `❌ Error | Found nothing for: **\`${player.queue.current.title}`
              ).substr(0, 256 - 3)}\`**`
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
