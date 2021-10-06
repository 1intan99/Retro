import { ColorResolvable, Message, MessageEmbed, User } from "discord.js";
import Retro from "../..";
import { embed, settings } from "../../conf/botconfig";
import { LoadType, Player } from "erela.js";

export async function search(client: Retro, message: Message, args: string[], type: any) {
  let search = args.join(" ");
  try {
    var res;
    let player = client.manager.players.get(message.guild.id);
    if (!player) 
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: settings.selfDef
    });
    let state = player.state;
    if (state !== "CONNECTED") {
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      player.stop();
    }

    try {
      res = await client.manager.search({
        query: search,
        source: type.split(":")[1]
      }, message.author);
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "PLAYLIST_LOADED") throw {
        message: `Playlist are not supportyed with this command. Use rplaylist`
      };
    } catch (e) {
      console.log(String(e.stack).red);
      return message.channel.send({ embeds: [new MessageEmbed()
      .setColor(embed.color as ColorResolvable)
      .setFooter(embed.footertext, embed.footericon)
      .setTitle(`❌ Error | There was an error while searching:`)
      .setDescription(`\`\`\`${e.message}\`\`\``)]})
    }
    var max = 10; var collected; var filter = m => m.author.id === message.author.id && /^(\d+|cancel)$/i.test(m.content);
    if (res.tracks.length < max) max = res.tracks.length;

    var results = res.tracks
        .slice(0, max)
        .map((track, index) => `${++index} - \`${track.title}\``)
        .join("\n");

    var e = new MessageEmbed()
        .setAuthor(`🎶 Result of ${search} 🎶`)
        .setDescription(results)
        .setFooter(`Request By: ${message.author.tag} | Type "cancel" to cancel the selection`, message.author.avatarURL());
    message.channel.send({ embeds: [e] });
        try {
          collected = await message.channel.awaitMessages({ filter, max: 1, time: 30e3, errors: ['time'] });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle("❌ Error | You didn't provide a selection")
            .setColor(embed.wrongcolor as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)]});
        }

        let first = collected.first().content;
        if (first.toLowerCase() === 'end') {
          if (!player.queue.current) player.destroy();
          return message.channel.send({ embeds: [new MessageEmbed()
            .setColor(embed.wrongcolor as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle('❌ Error | Cancelled selection.')]})
        }
        let index = Number(first) - 1;
        if (index < 0 || index > max -1) return message.channel.send({ embeds: [new MessageEmbed()
          .setColor(embed.wrongcolor as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon)
          .setTitle(`❌ Error | The number you provided too small or too big (1-${max}).`)]})
        var track = res.tracks[index];
        if (!res.tracks[0]) return message.channel.send({ embeds: [new MessageEmbed()
          .setColor(embed.wrongcolor as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon)
          .setTitle(String("❌ Error | Found nothing for: **`" + search).substr(0, 256 - 3) + "`**")
          .setDescription(`Please retry!`)]});

          if (player.state !== "CONNECTED") {
          //set the variables
          player.set("message", message);
          player.set("playerauthor", message.author.id);
          player.connect();
          //add track
          player.queue.add(track);
          //set the variables
          //play track
          player.play();
          player.pause(false);
          const irc = await client.util.reqChannel(client, player.textChannel, player.guild);
          if (irc) {
            client.util.editReqTrack(client, player, player.queue.current);
            client.util.editReqQueue(client, player);
          }
        } else if (!player.queue || !player.queue.current) {
          //add track
          player.queue.add(track);
          //play track
          player.play();
          player.pause(false);
          //if its inside a request channel edit the msg
          const irc = await client.util.reqChannel(client, player.textChannel, player.guild);
          if (irc) {
            client.util.editReqTrack(client, player, player.queue.current);
            client.util.editReqQueue(client, player);
          }
        } 
        else {
          player.queue.add(track);
          const irc = await client.util.reqChannel(client, player.textChannel, player.guild);
          if (irc) {
            client.util.editReqQueue(client, player);
          } 
            const embed3 = new MessageEmbed()
            .setTitle(`Added to Queue 🩸 **\`${track.title}`.substr(0, 256 - 3) + "`**")
            .setURL(track.uri)
            .setColor(embed.color as ColorResolvable)
            .setThumbnail(track.displayThumbnail(1))
            .addField("⌛ Duration: ", `\`${track.isStream ? "LIVE STREAM" : client.util.formatTime(track.duration)}\``, true)
            .addField("💯 Song By: ", `\`${track.author}\``, true)
            .addField("🔂 Queue length: ", `\`${player.queue.length} Songs\``, true)
            .setFooter(`Reques by: ${message.author.tag, message.author}`, message.author.displayAvatarURL({ dynamic: true }))
            return message.channel.send({ embeds: [embed3] }).then(msg => {
              if (msg) {
                setTimeout(() => {
                  message.delete().catch(e => console.log("couldn't delete message this is a catch to prevent a crash".grey));
                }, 4000);
              }
            });
        }
  } catch (e) {
    console.log(String(e.stack).red);
    return message.channel.send({ embeds: [new MessageEmbed()
      .setColor(embed.wrongcolor as ColorResolvable)
      .setFooter(embed.footertext, embed.footericon)
      .setTitle(String("❌ Error | Found nothing for: **`" + search).substr(0, 256 - 3) + "`**")]})
  }
}