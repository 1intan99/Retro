import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Retro from "../..";
import { embed, settings } from "../../conf/botconfig";

export async function skiptrack(
  client: Retro,
  message: Message,
  args?: string[],
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
      // set the variables
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      player.stop();
    }
    try {
      if (
        type.split(":")[1] === "youtube" ||
        type.split(":")[1] === "soundcloud"
      ) {
        res = await client.manager.search(
          { query: search, source: type.split(":")[1] },
          message.author
        );
      } else {
        res = await client.manager.search(search, message.author);
      }
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "PLAYLIST_LOADED")
        throw message.channel.send({
          content:
            "Playlists are not supported with this command. Use   r.playlist  ",
        });
    } catch (e) {
      console.log(String(e.stack).red);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.wrongcolor as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(`❌ Error | There was an error while searching:`)
            .setDescription(`\`\`\`${e.message}\`\`\``),
        ],
      });
    }
    if (!res.tracks[0]) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(embed.wrongcolor as ColorResolvable)
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
    if (state !== "CONNECTED") {
      // set the variables
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      // add track
      player.queue.add(res.tracks[0]);
      // play track
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
      // add track
      player.queue.add(res.tracks[0]);
      // play track
      player.play();
      player.pause(false);
      // if its inside a request channel edit the msg

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
      player.queue.add(res.tracks[0]);
      player.queue[player.queue.length - 1];

      const QueueArray = client.util.arrayMove(
        player.queue,
        player.queue.length - 1,
        0
      );
      player.queue.clear();
      for (const track of QueueArray) {
        player.queue.add(track);
        player.stop();

        const irc = await client.util.reqChannel(
          client,
          player.textChannel,
          player.guild
        );
        if (irc) {
          client.util.editReqQueue(client, player);
        }
        return;
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
