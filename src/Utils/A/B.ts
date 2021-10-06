import Retro from "../..";
import {
  Guild,
  Message,
  TextChannel,
  NewsChannel,
  Role,
  MessageEmbed,
  ColorResolvable,
} from "discord.js";
import m from "pretty-ms";
import ms from "ms";
import { embed, settings } from "../../conf/botconfig";
import { Player } from "erela.js";

export class Util {
  client: Retro;
  guild?: Guild;
  constructor(client: Retro, guild?: Guild) {
    this.client = client;
    this.guild = guild;
  }

  prefixReg(message: Message): string[] {
    const escapeReg = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regu = this.client.user.username.match(/\w+/)[0];
    const def = "r";
    const reg = new RegExp(
      `^(<@!?${this.client.user.id}>|${escapeReg(regu[0])}|${escapeReg(
        def
      )})\\s*`,
      "i"
    );
    const prefix = message.content.match(reg)?.[0];

    return [def, prefix];
  }

  async reqChannel(client: Retro, channelid: any, guildid: any) {
    // @ts-ignore
    if (client.setups.get(guildid, "textChannel") !== "0") {
      try {
        const channel = (await client.channels
          .fetch(String(client.setups.get(guildid, "textChannel")))
          .catch((e) => false)) as TextChannel;

        if (!channel) {
          return false;
        }

        if (channel.id === channelid) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }

  async editReqTrack(client: any, player: any, track?: any, type?: any) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 50);
    });

    try {
      const Player = client.manager.players.get(player.guild);

      let message = player.get("message");
      if (player && !message.guild) {
        client.channels.fetch(player.textChannel).then((ch) => {
          message = ch.lastMessage;
        });
      }
    } catch {}
  }

  async editReqQueue(client: Retro, player: any) {
    try {
      const queue = player.queue;
      const embeds = new MessageEmbed().setAuthor(`Lava Music | Music Queue`);
      const multiple = 15;
      const page = 1;
      const end = page * multiple;
      const start = end - multiple;
      const tracks = queue.slice(start, end);
      if (queue.current) {
        embeds.addField(
          "**0) CURRENT TRACK**",
          `${queue.current.title
            .split("[")
            .join("[")
            .split("]")
            .join("]")
            .substr(0, 60)} [${
            queue.current.isStream
              ? "LIVE STREAM"
              : this.formatTime(queue.current.duration).split(" | ")[0]
          }]\nby: ${queue.current.requester}`
        );
      }
      if (!tracks.length) {
        embeds.setDescription(
          `No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`
        );
      } else {
        embeds.setDescription(
          tracks
            .map(
              (track, i) =>
                `**${start + ++i})** ${track.title
                  .split("[")
                  .join("[")
                  .split("]")
                  .join("]")
                  .substr(0, 60)} [${
                  track.isStream
                    ? "LIVE STREAM"
                    : this.formatTime(track.duration).split(" | ")[0]
                }]\nby: ${track.requester}`
            )
            .join("\n")
        );
      }
      embeds.setColor(embed.color as ColorResolvable);
      embeds.setImage(
        "https://cdn.discordapp.com/attachments/752548978259787806/820014471556759601/ezgif-1-2d764d377842.gif"
      );
      embeds.setFooter(embed.footertext, embed.footericon);
      embeds;
      let message = player.get("message");
      if (player && !message.guild)
        client.channels.fetch(player.textChanel).then((ch: any) => {
          message = ch.lastMessage;
        });
      const db = client.setups.get(message.guild.id);
      const queue_info_msg = await message.channel.messages.fetch(
        db.message_queue_info
      );
      const track_info_msg = await message.channel.messages.fetch(
        db.message_track_info
      );

      const oldembd = track_info_msg[0];
      track_info_msg
        .edit(
          oldembd.setFooter(
            `Queue: ${player.queue.size}  •  Volume: ${
              player.volume
            }%  •  Autoplay: ${
              player.get(`autoplay`) ? `✔️` : `❌`
            }  •  Loop: ${
              player.queueRepeat
                ? `✔️ Queue`
                : player.trackRepeat
                ? `✔️ Song`
                : `❌`
            }`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          )
        )
        .catch((e) =>
          console.log("Couldn't delete msg, this is for preventing a bug".gray)
        );
      queue_info_msg
        .edit(embed)
        .catch((e) =>
          console.log("Couldn't delete msg, this is for preventing a bug".gray)
        );
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  }

  formatTime(ms) {
    const time = {
      d: 0,
      h: 0,
      m: 0,
      s: 0,
    };
    time.s = Math.floor(ms / 1000);
    time.m = Math.floor(time.s / 60);
    time.s %= 60;
    time.h = Math.floor(time.m / 60);
    time.m %= 60;
    time.d = Math.floor(time.h / 24);
    time.h %= 24;

    const res = [];
    for (const [k, v] of Object.entries(time)) {
      let first = false;
      if (v < 1 && !first) continue;

      res.push(v < 10 ? `0${v}` : `${v}`);
      first = true;
    }
    return res.join(":");
  }

  databasing(client: Retro, guildid: any, userid: any) {
    try {
      client.stats.ensure("global", {
        commands: 0,
        songs: 0,
        setups: 0
      });
      client.premium.ensure("premiumlist", {
        list: [{
          "u": "XXXYYYXXXYYYXXXYYY"
        }, {
          "g": "XXXYYYXXXYYYXXXYYY"
        }]
      })
      if (guildid) {
        client.stats.ensure(guildid, {
          commands: 0,
          songs: 0
        });
        client.premium.ensure(guildid, {
          enabled: false,
        })
        client.setups.ensure(guildid, {
          textchannel: "0",
          voicechannel: "0",
          category: "0",
          message_cmd_info: "0",
          message_queue_info: "0",
          message_track_info: "0"
        });
        client.settings.ensure(guildid, {
          prefix: 'r',
          pruning: true,
          requestonly: true,
          djroles: [],
          djonlycmds: ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"],
          botchannel: [],
        });
      }
      if (userid) {
        client.premium.ensure(userid, {
          enabled: false,
        })
        client.queuesaves.ensure(userid, {
          "TEMPLATEQUEUEINFORMATION": ["queue", "sadasd"]
        });
      }
      if (userid && guildid) {
        client.userProfiles.ensure(userid, {
          id: userid,
          guild: guildid,
          totalActions: 0,
          warnings: [],
          kicks: []
        });
      }
      return;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }

  createBarl(player: any) {
    try {
      const current =
        player.queue.current.duration !== 0
          ? player.position
          : player.queue.current.duration;
      const total = player.queue.current.duration;
      const size = 25;
      const line = "▬";
      const slider = settings.progressbar_emoji;
      const bar =
        current > total
          ? [line.repeat((size / 2) * 2), (current / total) * 100]
          : [
              line
                .repeat(Math.round((size / 2) * (current / total)))
                .replace(/.$/, slider) +
                line.repeat(size - Math.round(size * (current / total)) + 1),
              current / total,
            ];
      if (!player.queue.current)
        return `**[${settings.progressbar_emoji}${line.repeat(
          size - 1
        )}]**\n**00:00:00 / 00:00:00**`;
      if (!String(bar[0]).includes(settings.progressbar_emoji))
        return `**[${bar[0]}]**\n**${`${new Date(player.position)
          .toISOString()
          .substr(11, 8)} / ${
          player.queue.current.duration == 0
            ? "Live"
            : new Date(player.queue.current.duration)
                .toISOString()
                .substr(11, 8)
        }`}**`;
    } catch (e) {
      console.log(String(e.stack).red);
    }
  }

  arrayMove(array: any, from: any, to: any) {
    try {
      array = [...array];
      const startIndex = from < 0 ? array.length + from : from;
      if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = to < 0 ? array.length + to : to;
        const [item] = array.splice(from, 1);
        array.splice(endIndex, 0, item);
      }
      return array;
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  }

  async autoplay(client: Retro, player: any, type?: any) {
    try {
      if (player.queue.size > 0) return;
      const previoustrack = player.get("previoustrack");
      if (!previoustrack) return;

      const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
      const response = await client.manager.search(
        mixURL,
        previoustrack.requester
      );
      // if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
      if (
        !response ||
        response.loadType === "LOAD_FAILED" ||
        response.loadType !== "PLAYLIST_LOADED"
      ) {
        const ch = client.channels.cache.get(player.textChannel) as TextChannel;
        const embeds1 = new MessageEmbed()
          .setTitle("❌ Error | Found nothing related for the latest Song!")
          .setDescription(
            settings.LeaveOnEmpty_Queue.enable && type != "skip"
              ? `I'll leave the Channel: ${ch.name} in: ${ms(
                  settings.LeaveOnEmpty_Queue.time_delay,
                  { long: true }
                )} If the Queue stays Empty! `
              : `I left the Channel: ${
                  ch.name
                } because the Queue was empty for: ${ms(
                  settings.LeaveOnEmpty_Queue.time_delay,
                  { long: true }
                )}`
          )
          .setColor(embed.wrongcolor as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon);
        ch.send({ embeds: [embeds1] });
        if (settings.LeaveOnEmpty_Queue.enable && type != "skip") {
          return setTimeout(() => {
            try {
              player = client.manager.players.get(player.guild);
              const ch2 = client.channels.cache.get(
                player.voiceChannel
              ) as TextChannel;
              if (player.queue.size === 0) {
                const embeds = new MessageEmbed();
                try {
                  embeds.setTitle("❌ Queue has ended.");
                } catch {}
                try {
                  embeds.setDescription(
                    `I left the Channel: ${
                      ch2.name
                    } because the Queue was empty for: ${ms(
                      settings.LeaveOnEmpty_Queue.time_delay,
                      { long: true }
                    )}`
                  );
                } catch {}
                try {
                  embeds.setColor(embed.color as ColorResolvable);
                } catch {}
                try {
                  embeds.setFooter(embed.footertext, embed.footericon);
                } catch {}
                const ch = client.channels.cache.get(
                  player.textChannel
                ) as TextChannel;
                ch.send({ embeds: [embeds] });
                try {
                  const ch = client.channels.cache.get(
                    player.textChannel
                  ) as TextChannel;
                  ch.messages.fetch(player.get("playermessage")).then((msg) => {
                    try {
                      setTimeout(() => {
                        msg
                          .delete()
                          .catch((e) =>
                            console.log(
                              "couldn't delete message this is a catch to prevent a crash"
                                .grey
                            )
                          );
                      }, 7500);
                    } catch {
                      /* */
                    }
                  });
                } catch (e) {
                  console.log(String(e.stack).yellow);
                }
                player.destroy();
              }
            } catch (e) {
              console.log(String(e.stack).yellow);
            }
          }, settings.LeaveOnEmpty_Queue.time_delay);
        }
        player.destroy();
      }
      player.queue.add(
        response.tracks[
          Math.floor(Math.random() * Math.floor(response.tracks.length))
        ]
      );
      return player.play();
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  }

  createBar(player: any) {
    try {
      // player.queue.current.duration == 0 ? player.position : player.queue.current.duration, player.position, 25, "▬", config.settings.progressbar_emoji)
      const current =
        player.queue.current.duration !== 0
          ? player.position
          : player.queue.current.duration;
      const total = player.queue.current.duration;
      const size = 25;
      const line = "▬";
      const slider = settings.progressbar_emoji;
      const bar =
        current > total
          ? [line.repeat((size / 2) * 2), (current / total) * 100]
          : [
              line
                .repeat(Math.round((size / 2) * (current / total)))
                .replace(/.$/, slider) +
                line.repeat(size - Math.round(size * (current / total)) + 1),
              current / total,
            ];
      if (!player.queue.current)
        return `**[${settings.progressbar_emoji}${line.repeat(
          size - 1
        )}]**\n**00:00:00 / 00:00:00**`;
      if (!String(bar[0]).includes(settings.progressbar_emoji))
        return `**[${settings.progressbar_emoji}${line.repeat(
          size - 1
        )}]**\n**00:00:00 / 00:00:00**`;
      return `**[${bar[0]}]**\n**${`${new Date(player.position)
        .toISOString()
        .substr(11, 8)} / ${
        player.queue.current.duration == 0
          ? " ◉ LIVE"
          : new Date(player.queue.current.duration).toISOString().substr(11, 8)
      }`}**`;
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  }

  async swap_pages2(client, message, embeds) {
    let currentPage = 0;
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds] });
    const queueEmbed = await message.channel.send({
      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      embeds: [embeds]
    });
    let reactionemojis = ["⬅️", "⏹", "➡️"];
    try {
      for (const emoji of reactionemojis)
        await queueEmbed.react(emoji);
    } catch {}
  
    const filter = (reaction, user) =>
      (reactionemojis.includes(reaction.emoji.name) || reactionemojis.includes(reaction.emoji.name)) && message.author.id === user.id;
    const collector = queueEmbed.createReactionCollector(filter, {
      time: 45000
    });
  
    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === reactionemojis[2] || reaction.emoji.id === reactionemojis[2]) {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          } else {
            currentPage = 0
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else if (reaction.emoji.name === reactionemojis[0] || reaction.emoji.id === reactionemojis[0]) {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          } else {
            currentPage = embeds.length - 1
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(message.author.id);
      } catch {}
    });
  
  }
}
