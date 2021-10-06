import { Message } from "discord.js";
import Retro from "../..";
import { settings } from "../../conf/botconfig";

export async function request(
  client: Retro,
  message: Message,
  args?: string[],
  type?: any
) {
  const search = args.join(" ");
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
  res = await client.manager.search(
    {
      query: search,
      source: type.split(":")[1],
    },
    message.author
  );

  if (res.loadType === "LOAD_FAILED") {
    throw res.exception;
  } else if (res.loadType === "PLAYLIST_LOADED") {
    playlist_();
  } else {
    song_();
  }

  async function song_() {
    // if no tracks found return info msg
    if (!res.tracks[0]) {
      return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
    }
    // create a player if not created

    // if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      // set the variables
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      // add track
      player.queue.add(res.tracks[0]);
      // play track
      player.play();
      player.pause(false);
      // if its in a request channel edit it
      var irc = await client.util.reqChannel(
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
      var irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqTrack(client, player, player.queue.current);
        client.util.editReqQueue(client, player);
      }
    }
    // otherwise
    else {
      // add track
      player.queue.add(res.tracks[0]);

      // if its in a request channel edit it
      var irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqQueue(client, player);
      }
    }
  }

  async function playlist_() {
    if (!res.tracks[0]) {
      return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
    }
    // if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      // set the variables
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      // add track
      player.queue.add(res.tracks);
      // play track
      player.play();
      player.pause(false);
      // if its in a request channel edit it
      var irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqQueue(client, player);
      }
    } else if (!player.queue || !player.queue.current) {
      // add track
      player.queue.add(res.tracks);
      // play track
      player.play();
      player.pause(false);
      // if its inside a request channel edit the msg
      var irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqTrack(client, player, player.queue.current);
        client.util.editReqQueue(client, player);
      }
    } else {
      player.queue.add(res.tracks);
      // if its in a request channel edit it
      var irc = await client.util.reqChannel(
        client,
        player.textChannel,
        player.guild
      );
      if (irc) {
        client.util.editReqQueue(client, player);
      }
    }
  }
}
