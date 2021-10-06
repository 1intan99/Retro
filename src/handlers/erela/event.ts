import {
  MessageEmbed,
  TextChannel,
  VoiceChannel,
  ColorResolvable,
  Message,
  User,
  MessageReaction,
} from "discord.js";
import Retro from "../..";
import { defaultEQ } from "../variable";
import { settings, embed, emoji } from "../../conf/botconfig";
import { playermanger } from "../playermanager";
import ms from "ms";
let mi;
const hasmap = new Map();

export default class ErlEvent {
  client: Retro;
  public constructor(client: Retro) {
    this.client = client;
  }

  public event() {
    this.client.manager
      .on("playerCreate", async (player) => {
        player.setVolume(100);
        player.set("autoplay", false);
        player.set(`afk-${player.guild}`, false);
        player.set(`afk-${player.get("playerauthor")}`, false);
        player.setEQ(defaultEQ);
        this.client.util.databasing(
          this.client,
          player.guild,
          player.get("playerauthor")
        );

        const vc = this.client.channels.cache.get(
          player.voiceChannel
        ) as VoiceChannel;
        const ch = this.client.channels.cache.get(
          player.textChannel
        ) as TextChannel;
        const embed = new MessageEmbed();
        embed.setTitle(`**Joined** \`${vc.name}\``);
        embed.setDescription(`**Command bound to:** <#${vc.id}>`);

        const irc = await this.client.util.reqChannel(
          this.client,
          player.textChannel,
          player.guild
        );
        if (!irc)
          ch.send({
            embeds: [embed.setColor(embed.color as ColorResolvable)],
          }).catch((e) => console.log("this prevents a crash"));
        if (settings.serverDef) {
          for (let i = 0; i <= 5; i++) {
            await new Promise((res) => {
              setTimeout(() => {
                res(2);
                const guild = this.client.guilds.cache.get(player.guild);
                guild.me.voice
                  .setDeaf(true)
                  .catch((e) => console.log("ignore that log".gray));
                i = 10;
              }, 1000);
            });
          }
        }
      })
      .on("playerMove", async (player, oldChannel, newChannel) => {
        const vc = this.client.channels.cache.get(
          player.voiceChannel
        ) as VoiceChannel;
        if (!newChannel) {
          const embeds = new MessageEmbed()
            .setColor(embed.color as ColorResolvable)
            .setFooter(embed.footertext, embed.footericon)
            .setTitle(`❌ Queue has ended.`)
            .setDescription(`I left the Channel \`🔈 ${vc.name}\``);
          const irc = await this.client.util.reqChannel(
            this.client,
            player.textChannel,
            player.guild
          );
          if (irc) this.client.util.editReqTrack(this.client, player);

          try {
            const ch = this.client.channels.cache.get(
              player.textChannel
            ) as TextChannel;
            ch.messages.fetch(player.get("playermessage")).then((msg) => {
              if (msg && msg.deletable) {
                setTimeout(() => {
                  msg
                    .delete()
                    .catch((e) =>
                      console.log(
                        "Couldn't delete message this is a catch to prevet a crash"
                          .grey
                      )
                    );
                }, 1500);
              }
            });
          } catch (e) {
            console.log(String(e.stack).yellow);
          }

          const irc2 = await this.client.util.reqChannel(
            this.client,
            player.textChannel,
            player.guild
          );
          if (irc2)
            return this.client.util.editReqTrack(
              this.client,
              player,
              player.queue.current,
              "destroy"
            );
          player.destroy();
        } else {
          player.voiceChannel = newChannel;
          if (player.pause) return;
          setTimeout(() => {
            player.pause(true);
            setTimeout(() => player.pause(false), this.client.ws.ping * 2);
          }, this.client.ws.ping * 2);
        }
      })
      .on("trackStart", async (player: any, track) => {
        try {
          player.set("votes", "0");
          for (const userid of this.client.guilds.cache
            .get(player.guild)
            .members.cache.map((member) => member.user.id)) {
            player.set(`vote-${userid}`, false);
            player.set("previoustrack", track);
            this.client.stats.inc(player.guild, "songs");
            this.client.stats.inc("global", "songs");

            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(2);
              }, 500);
            });
            const user = track.requester as User;
            const embeds = new MessageEmbed().setColor(
              embed.color as ColorResolvable
            );
            embeds.setTitle(`**${emoji.msg.playing} | ${track.title}**`);
            embeds.setURL(track.uri);
            embeds.setThumbnail(
              `https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`
            );
            embeds.addField(
              `**${emoji.msg.time} Duration: **`,
              `\`❯ ${
                track.isStream
                  ? `LIVE STREAM`
                  : this.client.util.formatTime(track.duration)
              }\``,
              true
            );
            embeds.addField(
              `**${emoji.msg.song_by} Song By:**`,
              `\`❯ ${track.author}\``,
              true
            );
            embeds.addField(
              `**${emoji.msg.repeat_mode} Queue length:**`,
              `\`❯ ${player.queue.length} Songs\``,
              true
            );
            embeds.setFooter(
              `Requested by: ${user.tag}`,
              user.displayAvatarURL({ dynamic: true })
            );

            const irc = await this.client.util.reqChannel(
              this.client,
              player.textChannel,
              player.guild
            );
            if (irc) {
              try {
                clearInterval(mi);
              } catch {}
              mi = setInterval(() => {
                if (!this.client.manager.players.get(player.guild))
                  return clearInterval(mi);
                if (!player.queue) return clearInterval(mi);
                if (!player.queue.current) return clearInterval(mi);
                let message: any = player.get("message");
                if (player && !message.guild)
                  this.client.channels
                    .fetch(player.textChannel)
                    .then((ch: any) => {
                      message = ch.lastMessage;
                    });
                if (message && message.guild) {
                  message.channel.messages
                    .fetch(
                      this.client.setups.get(message.guild.id)
                        .message_track_info
                    )
                    .then((msg) => {
                      msg
                        .edit({
                          embeds: [
                            msg.embeds[0].setDescription(
                              `${this.client.util.createBarl(player)}`
                            ),
                          ],
                        })
                        .catch((e) =>
                          console.log(
                            "Couldn't delet msg, this if for preventing a bug"
                              .gray
                          )
                        );
                    });
                }
              }, 10000);
              return this.client.util.editReqTrack(
                this.client,
                player,
                player.queue.current
              );
            }
            const ch1 = this.client.channels.cache.get(
              player.textChannel
            ) as TextChannel;
            // @ts-ignore
            if (this.client.settings.get(player.guild, "pruning")) {
              return ch1.send({ embeds: [embeds] }).then((msg) => {
                try {
                  // @ts-ignore
                  if (
                    player.get("playingsongmsg") &&
                    msg.id !== player.get("playingsongmsg").id
                  )
                    player
                      .get("playingsongmsg")
                      .delete()
                      .catch((e) =>
                        console.log(
                          "Couldn't delete message this a catch prevent a crash"
                            .grey
                        )
                      );
                } catch {}
                player.set(`playingsongmsg`, msg);
                let failed = false;
                msg.react(emoji.react.rewind).catch((e) => (failed = true)); //rewind 20 seconds
                msg.react(emoji.react.forward).catch((e) => (failed = true)); //forward 20 seconds
                msg
                  .react(emoji.react.pause_resume)
                  .catch((e) => (failed = true)); //pause / resume
                msg.react(emoji.react.stop).catch((e) => (failed = true)); //stop playing music
                msg
                  .react(emoji.react.previous_track)
                  .catch((e) => (failed = true)); //skip back  track / (play previous)
                msg.react(emoji.react.skip_track).catch((e) => (failed = true)); //skip track / stop playing
                msg
                  .react(emoji.react.replay_track)
                  .catch((e) => (failed = true)); //replay track
                msg
                  .react(emoji.react.reduce_volume)
                  .catch((e) => (failed = true)); //reduce volume by 10%
                msg
                  .react(emoji.react.raise_volume)
                  .catch((e) => (failed = true)); //raise volume by 10%
                msg
                  .react(emoji.react.toggle_mute)
                  .catch((e) => (failed = true)); //toggle mute
                msg
                  .react(emoji.react.repeat_mode)
                  .catch((e) => (failed = true)); //change repeat mode --> track --> Queue --> none
                msg
                  .react(emoji.react.autoplay_mode)
                  .catch((e) => (failed = true)); //toggle autoplay mode
                msg.react(emoji.react.shuffle).catch((e) => (failed = true)); //shuffle the Queue
                msg.react(emoji.react.show_queue).catch((e) => (failed = true)); //shows the Queue
                msg
                  .react(emoji.react.show_current_track)
                  .catch((e) => (failed = true)); //shows the current Track

                if (failed) {
                  msg.channel.send({
                    embeds: [
                      new MessageEmbed()
                        .setColor(embed.color as ColorResolvable)
                        .setFooter(embed.footertext, embed.footericon)
                        .setTitle(`❌ Error | Couldn't add Reaction`)
                        .setDescription(
                          `Make sure that I have premissions to add (custom) REACTION`
                        ),
                    ],
                  });
                }
                let filter = (reaction, user) =>
                  user.id !== this.client.user.id;
                const collector = msg.createReactionCollector({
                  filter,
                  time: track.duration > 0 ? track.duration : 600000,
                });
                collector.on(
                  "collect",
                  async (reaction: MessageReaction, user) => {
                    try {
                      if (user.bot) return;

                      const { message } = reaction;
                      try {
                        reaction.users
                          .remove(user.id)
                          .catch((e) => console.log(String(e.stack).yellow));
                      } catch {}
                      const member = message.guild.members.cache.get(user.id);
                      const { channel } = member.voice;
                      if (!channel) {
                        return message.channel.send({
                          embeds: [
                            new MessageEmbed()
                              .setColor(embed.wrongcolor as ColorResolvable)
                              .setFooter(embed.footertext, embed.footericon)
                              .setTitle(
                                `${emoji.msg.ERROR} ERROR | You need to join a voice channel.`
                              ),
                          ],
                        });
                      }
                      const player = this.client.manager.players.get(
                        message.guild.id
                      );
                      const vc = message.guild.channels.cache.get(
                        player.voiceChannel
                      ) as VoiceChannel;
                      if (player && channel.id !== player.voiceChannel)
                        return message.channel.send({
                          embeds: [
                            new MessageEmbed()
                              .setColor(embed.wrongcolor as ColorResolvable)
                              .setFooter(embed.footertext, embed.footericon)
                              .setTitle(
                                `${emoji.msg.ERROR} ERROR | I am already playing somewhere else!`
                              )
                              .setDescription(
                                `You can listen to me in: ${vc.name}`
                              ),
                          ],
                        });
                      const reactionemoji =
                        reaction.emoji.id || reaction.emoji.name;
                      switch (reactionemoji) {
                        case String(emoji.react.rewind):
                          let rewind = player.position - 20 * 1000;
                          if (
                            rewind >=
                              player.queue.current.duration - player.position ||
                            rewind < 0
                          ) {
                            rewind = 0;
                          }
                          player.seek(Number(rewind));

                          message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${
                                      emoji.msg.rewind
                                    } Rewinded the song for: 20 Seconds, to: ${this.client.util.formatTime(
                                      Number(player.position)
                                    )}`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
                                setTimeout(() => {
                                  msg
                                    .delete()
                                    .catch((e) =>
                                      console.log(
                                        "Couldn't delet message this is a catch to prevent a crash"
                                          .grey
                                      )
                                    );
                                }, 4000);
                              }
                            });
                          break;
                        case String(emoji.react.forward):
                          let forward = Number(player.position) + 20 * 1000;
                          if (
                            Number(forward) >= player.queue.current.duration
                          ) {
                            forward = player.queue.current.duration - 1000;
                          }
                          player.seek(Number(forward));

                          message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${
                                      emoji.msg.forward
                                    } Forwarded the Song for: 20 Seconds, to: ${this.client.util.formatTime(
                                      Number(player.position)
                                    )}`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
                                setTimeout(() => {
                                  msg
                                    .delete()
                                    .catch((e) =>
                                      console.log(
                                        "Couldn't delet message this is a catch to prevent crash"
                                          .grey
                                      )
                                    );
                                }, 4000);
                              }
                            });
                          break;
                        case String(emoji.react.pause_resume):
                          player.pause(player.playing);

                          message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${
                                      player.playing
                                        ? `${emoji.msg.resume}  Resumed`
                                        : `${emoji.msg.pause} Paused`
                                    } the Player `
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
                                setTimeout(() => {
                                  msg
                                    .delete()
                                    .catch((e) =>
                                      console.log(
                                        "Couldn't delet message this is a catch to prevent crash"
                                          .grey
                                      )
                                    );
                                }, 4000);
                              }
                            });
                          break;
                        case String(emoji.react.stop):
                          const irc = await this.client.util.reqChannel(
                            this.client,
                            player.textChannel,
                            player.guild
                          );
                          if (irc)
                            return this.client.util.editReqTrack(
                              this.client,
                              player,
                              player.queue.current,
                              "destroy"
                            );
                          player.destroy();

                          message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.stop} Stopped and left your channel`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
                                setTimeout(() => {
                                  msg
                                    .delete()
                                    .catch((e) =>
                                      console.log(
                                        `Couldn't delete message this is a catach to prevent a crash`
                                          .gray
                                      )
                                    );
                                }, 4000);
                              }
                            });
                          break;
                        case String(emoji.react.previous_track):
                          if (
                            !player.queue.previous ||
                            player.queue.previous === null
                          ) {
                            return message.channel
                              .send({
                                embeds: [
                                  new MessageEmbed()
                                    .setColor(embed.color as ColorResolvable)
                                    .setFooter(
                                      embed.footertext,
                                      embed.footericon
                                    )
                                    .setTitle(
                                      `${emoji.msg.ERROR} Error | There is no previous song yet!`
                                    ),
                                ],
                              })
                              .then((msg) => {
                                if (msg && msg.deletable) {
                                  setTimeout(() => {
                                    msg
                                      .delete()
                                      .catch((e) =>
                                        console.log(
                                          `Couldn't delete message this is a catach to prevent a crash`
                                            .gray
                                        )
                                      );
                                  }, 4000);
                                }
                              });
                          }
                          let type = "skiptrack:youtube";
                          if (player.queue.previous.uri.includes("soundcloud"))
                            type = "skiptrack:soundcloud";
                          playermanger(
                            this.client,
                            message as Message,
                            Array(player.queue.previous.uri),
                            type
                          );
                          break;
                        case String(emoji.react.skip_track):
                          if (
                            this.client.settings
                              .get(message.guild.id, "djroles")
                              .toString() !== ""
                          ) {
                            const channelmembersize = channel.members.size;
                            let votemount = 0;
                            if (channelmembersize <= 3) votemount = 1;
                            votemount = Math.ceil(channelmembersize / 3);

                            if (!player.get(`vote-${user.id}`)) {
                              player.set(`vote-${user.id}`, true);
                              player.set(
                                `votes`,
                                String(Number(player.get(`votes`)) + 1)
                              );
                              if (votemount <= Number(player.get("votes"))) {
                                message.channel.send({
                                  embeds: [
                                    new MessageEmbed()
                                      .setColor(embed.color as ColorResolvable)
                                      .setFooter(
                                        embed.footertext,
                                        embed.footericon
                                      )
                                      .setTitle(
                                        `${emoji.msg.SUCCESS} Success | Added your Vote!`
                                      )
                                      .setDescription(
                                        `There are now: ${player.get(
                                          "votes"
                                        )} of ${votemount} needed Votes\n\n> Amount reached! Skipping ${
                                          emoji.msg.skip_track
                                        }`
                                      ),
                                  ],
                                });
                                if (player.queue.size == 0) {
                                  const irc3 =
                                    await this.client.util.reqChannel(
                                      this.client,
                                      player.textChannel,
                                      player.guild
                                    );
                                  if (irc3)
                                    return this.client.util.editReqTrack(
                                      this.client,
                                      player,
                                      player.queue.current,
                                      "destroy"
                                    );
                                  player.destroy();
                                } else {
                                  player.stop();
                                }
                              } else {
                                return message.channel.send({
                                  embeds: [
                                    new MessageEmbed()
                                      .setColor(embed.color as ColorResolvable)
                                      .setFooter(
                                        embed.footertext,
                                        embed.footericon
                                      )
                                      .setTitle(
                                        `${emoji.msg.SUCCESS} Success | Added your Vote!`
                                      )
                                      .setDescription(
                                        `There are now: ${player.get(
                                          "votes"
                                        )} of ${votemount} needed Votes`
                                      ),
                                  ],
                                });
                              }
                            } else {
                              player.set(`vote-${user.id}`, false);
                              player.set(
                                "votes",
                                String(Number(player.get("votes")) - 1)
                              );
                              return message.channel.send({
                                embeds: [
                                  new MessageEmbed()
                                    .setColor(embed.color as ColorResolvable)
                                    .setFooter(
                                      embed.footertext,
                                      embed.footericon
                                    )
                                    .setTitle(
                                      `${emoji.msg.SUCCESS} Success | Removed your Vote!`
                                    )
                                    .setDescription(
                                      `There are now: ${player.get(
                                        "votes"
                                      )} of ${votemount} needed Votes`
                                    ),
                                ],
                              });
                            }
                          } else {
                            if (player.queue.size == 0) {
                              if (player.get("autoplay"))
                                return this.client.util.autoplay(
                                  this.client,
                                  player,
                                  "skip"
                                );
                              const irc4 = await this.client.util.reqChannel(
                                this.client,
                                player.textChannel,
                                player.guild
                              );
                              if (irc4)
                                return this.client.util.editReqTrack(
                                  this.client,
                                  player,
                                  player.queue.current,
                                  "destroy"
                                );
                              player.destroy();
                              return message.channel.send({
                                embeds: [
                                  new MessageEmbed()
                                    .setTitle(
                                      `${emoji.msg.SUCCESS} Success | ${emoji.msg.stop} Stopped and left your Channel`
                                    )
                                    .setColor(embed.color as ColorResolvable)
                                    .setFooter(
                                      embed.footertext,
                                      embed.footericon
                                    ),
                                ],
                              });
                            }
                            player.stop();
                            return message.channel.send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.SUCCESS} Success | ${emoji.msg.skip_track} Skipped to the next Song`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            });
                          }
                          break;
                        case String(emoji.react.replay_track):
                          player.seek(0);
                          return message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.replay_track} Replaying Current Track`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.reduce_volume):
                          let volumedown = player.volume - 10;
                          if (volumedown < 0) volumedown = 0;
                          player.setVolume(volumedown);
                          return message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.reduce_volume} Volume set to: **${player.volume} %**`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.raise_volume):
                          let volumeup = player.volume + 10;
                          if (volumeup > 150) volumeup = 0;
                          player.setVolume(volumeup);
                          return message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.raise_volume} Volume set to: **${player.volume} %**`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.toggle_mute):
                          const volumemute = player.volume === 0 ? 50 : 0;
                          player.setVolume(volumemute);
                          return message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${
                                      player.volume === 0
                                        ? `${emoji.msg.toggle_mute} Muted the Player`
                                        : `${emoji.msg.reduce_volume} Unmuted the Player`
                                    }`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.repeat_mode):
                          if (
                            !player.trackRepeat &&
                            !hasmap.get(message.guild.id)
                          ) {
                            hasmap.set(message.guild.id, 1);
                            // and queue repeat mode to off
                            player.setQueueRepeat(!player.queueRepeat);
                            // set track repeat mode to on
                            player.setTrackRepeat(!player.trackRepeat);
                            // Send an informational message
                            message.channel
                              .send({
                                embeds: [
                                  new MessageEmbed()
                                    .setTitle(
                                      `${
                                        emoji.msg.repeat_mode
                                      } Track Loop is now ${
                                        player.trackRepeat
                                          ? `${emoji.msg.enabled} Enabled`
                                          : `${emoji.msg.disabled} Disabled`
                                      }.`
                                    )
                                    .setDescription(
                                      `And Queue Loop is now ${
                                        player.queueRepeat
                                          ? `${emoji.msg.enabled} Enabled`
                                          : `${emoji.msg.disabled} Disabled`
                                      }.`
                                    )
                                    .setColor(embed.color as ColorResolvable)
                                    .setFooter(
                                      embed.footertext,
                                      embed.footericon
                                    ),
                                ],
                              })
                              .then((msg) => {
                                if (msg && msg.deletable) {
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
                          } else if (
                            player.trackRepeat &&
                            hasmap.get(member.guild.id) === 1
                          ) {
                            hasmap.set(message.guild.id, 2);
                            // set track repeat mode off
                            player.setTrackRepeat(!player.trackRepeat);
                            // set queue repeat mode on
                            player.setQueueRepeat(!player.queueRepeat);
                            // send informational message
                            message.channel
                              .send({
                                embeds: [
                                  new MessageEmbed()
                                    .setTitle(
                                      `${
                                        emoji.msg.repeat_mode
                                      } Queue Loop is now ${
                                        player.queueRepeat
                                          ? `${emoji.msg.enabled} Enabled`
                                          : `${emoji.msg.disabled} Disabled`
                                      }.`
                                    )
                                    .setDescription(
                                      `And Track Loop is now ${
                                        player.trackRepeat
                                          ? `${emoji.msg.enabled} Enabled`
                                          : `${emoji.msg.disabled} Disabled`
                                      }.`
                                    )
                                    .setColor(embed.color as ColorResolvable)
                                    .setFooter(
                                      embed.footertext,
                                      embed.footericon
                                    ),
                                ],
                              })
                              .then((msg) => {
                                if (msg && msg.deletable) {
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
                          } else {
                            hasmap.delete(message.guild.id);
                            // set track repeat mode off
                            player.setTrackRepeat(false);
                            // set queue repeat mode off
                            player.setQueueRepeat(false);

                            message.channel
                              .send({
                                embeds: [
                                  new MessageEmbed()
                                    .setTitle(
                                      `${
                                        emoji.msg.repeat_mode
                                      } Queue Loop is now ${
                                        player.queueRepeat
                                          ? `${emoji.msg.enabled} Enabled`
                                          : `${emoji.msg.disabled} Disabled`
                                      }.`
                                    )
                                    .setDescription(
                                      `And Track Loop is now ${
                                        player.trackRepeat
                                          ? `${emoji.msg.enabled} Enabled`
                                          : `${emoji.msg.disabled} Disabled`
                                      }.`
                                    )
                                    .setColor(embed.color as ColorResolvable)
                                    .setFooter(
                                      embed.footertext,
                                      embed.footericon
                                    ),
                                ],
                              })
                              .then((msg) => {
                                if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.autoplay_mode):
                          player.set("autoplay", !player.get("autoplay"));
                          message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.SUCCESS} Success | ${
                                      player.get("autoplay")
                                        ? `${emoji.msg.enabled} Enabled`
                                        : `${emoji.msg.disabled} Disabled`
                                    } Autoplay`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.shuffle):
                          player.queue.shuffle();
                          message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.shuffle} The queue is now shuffled.`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.show_queue):
                          const embeds = new MessageEmbed()
                            .setAuthor(
                              `Queue for ${message.guild.name}  -  [ ${player.queue.length} Tracks ]`,
                              message.guild.iconURL({ dynamic: true })
                            )
                            .setColor(embed.color as ColorResolvable);
                          // if there is something playing rn, then add it to the embed
                          if (player.queue.current)
                            embeds.addField(
                              "**0) CURRENT TRACK**",
                              `[${player.queue.current.title.substr(0, 35)}](${
                                player.queue.current.uri
                              }) - ${
                                player.queue.current.isStream
                                  ? "LIVE STREAM"
                                  : this.client.util
                                      .formatTime(player.queue.current.duration)
                                      .split(" | ")[0]
                              } - request by: **${
                                player.queue.current.requester
                              }**`
                            );
                          // get the right tracks of the current tracks
                          const tracks = player.queue;
                          if (!tracks.length) {
                            return message.channel
                              .send({
                                embeds: [
                                  embeds.setDescription(
                                    `${emoji.msg.ERROR} No tracks in the queue`
                                  ),
                                ],
                              })
                              .then((msg) => {
                                if (msg && msg.deletable) {
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
                          if (tracks.length < 15) {
                            return message.channel
                              .send({
                                embeds: [
                                  embeds.setDescription(
                                    tracks
                                      .map(
                                        (track, i) =>
                                          `**${++i})** [${track.title.substr(
                                            0,
                                            35
                                          )}](${track.uri}) - ${
                                            track.isStream
                                              ? "LIVE STREAM"
                                              : this.client.util
                                                  .formatTime(track.duration)
                                                  .split(" | ")[0]
                                          } - **requested by: ${
                                            track.requester
                                          }**`
                                      )
                                      .join("\n")
                                  ),
                                ],
                              })
                              .then((msg) => {
                                if (msg && msg.deletable) {
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
                          const quelist = [];
                          for (let i = 0; i < tracks.length; i = 15) {
                            const songs = tracks.slice(i, i + 15);
                            quelist.push(
                              songs
                                .map(
                                  (track, index) =>
                                    `**${i + ++index})** [${track.title
                                      .split("[")
                                      .join("{")
                                      .split("]")
                                      .join("}")
                                      .substr(0, 35)}](${track.uri}) - ${
                                      track.isStream
                                        ? "LIVE STREAM"
                                        : this.client.util
                                            .formatTime(track.duration)
                                            .split(" | ")[0]
                                    } - **requested by: ${track.requester}**`
                                )
                                .join("\n")
                            );
                          }
                          const limit =
                            quelist.length <= 5 ? quelist.length : 5;
                          for (let i = 0; i < limit; i++) {
                            await user.send({
                              embeds: [
                                embeds.setDescription(
                                  String(quelist[i]).substr(0, 2048)
                                ),
                              ],
                            });
                          }
                          user.send({
                            embeds: [
                              new MessageEmbed()
                                .setDescription(
                                  `${emoji.msg.SUCCESS} Sent from <#${
                                    message.channel.id
                                  }>${
                                    quelist.length <= 5
                                      ? ""
                                      : "\nNote: Send 5 Embeds, but there would be more..."
                                  }`
                                )
                                .setColor(embed.color as ColorResolvable)
                                .setFooter(embed.footertext, embed.footericon),
                            ],
                          });
                          message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setTitle(
                                    `${emoji.msg.SUCCESS} Check your direct messages to see the Queue`
                                  )
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(
                                    embed.footertext,
                                    embed.footericon
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                          break;
                        case String(emoji.react.show_current_track):
                          return message.channel
                            .send({
                              embeds: [
                                new MessageEmbed()
                                  .setAuthor(
                                    "Current song playing:",
                                    user.displayAvatarURL({ dynamic: true })
                                  )
                                  .setThumbnail(
                                    `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
                                  )
                                  .setURL(player.queue.current.uri)
                                  .setColor(embed.color as ColorResolvable)
                                  .setFooter(embed.footertext, embed.footericon)
                                  .setTitle(
                                    `${
                                      player.playing
                                        ? emoji.msg.resume
                                        : emoji.msg.pause
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
                                    `${player.queue.length} Songs`,
                                    true
                                  )
                                  .addField(
                                    `${emoji.msg.time} Progress: `,
                                    this.client.util.createBar(player)
                                  )
                                  .setFooter(
                                    `Requested by: ${user.tag}`,
                                    user.displayAvatarURL({ dynamic: true })
                                  ),
                              ],
                            })
                            .then((msg) => {
                              if (msg && msg.deletable) {
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
                    } catch (e) {
                      console.log(String(e.stack).yellow);
                    }
                  }
                );
              });
            }
          }
        } catch (e) {
          console.log(String(e.stack).yellow); /* */
        }
      })
      .on("trackStuck", (player, track, payload) => {
        const embeds = new MessageEmbed()
          .setTitle(`${emoji.msg.ERROR} Track got stuck!`)
          .setDescription(
            `${emoji.msg.skip_track} I skipped the track: [${track.title}](${track.uri})`
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`
          )
          .setColor(embed.color as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon);
        const ch = this.client.channels.cache.get(
          player.textChannel
        ) as TextChannel;
        ch.send({ embeds: [embeds] }).then((msg) => {
          if (msg && msg.deletable) {
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
          }
        });
        player.stop();
      })
      .on("trackError", (player, track, payload) => {
        const embeds = new MessageEmbed()
          .setTitle(`${emoji.msg.ERROR} Track got errored!`)
          .setDescription(
            `${emoji.msg.skip_track} I skipped the track: **${track.title}**`
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`
          )
          .setColor(embed.color as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon);
        const ch = this.client.channels.cache.get(
          player.textChannel
        ) as TextChannel;
        ch.send({ embeds: [embeds] }).then((msg) => {
          if (msg && msg.deletable) {
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
          }
        });
      })
      .on("queueEnd", async (player) => {
        this.client.util.databasing(
          this.client,
          player.guild,
          player.get("playerauthor")
        );
        if (player.get("autoplay"))
          return this.client.util.autoplay(this.client, player);
        if (settings.LeaveOnEmpty_Queue.enable) {
          setTimeout(async () => {
            const vc = this.client.channels.cache.get(
              player.voiceChannel
            ) as VoiceChannel;
            const ch = this.client.channels.cache.get(
              player.textChannel
            ) as TextChannel;
            try {
              player = this.client.manager.players.get(player.guild);
              if (!player.queue || !player.queue.current) {
                const embeds = new MessageEmbed()
                  .setTitle(`${emoji.msg.ERROR} Queue has ended.`)
                  .setDescription(
                    `I left the Channel: ${
                      vc ? vc.name : "UNKNOWN"
                    } because the Queue was empty for: ${ms(
                      settings.LeaveOnEmpty_Queue.time_delay,
                      { long: true }
                    )}`
                  )
                  .setColor(embed.color as ColorResolvable)
                  .setFooter(embed.footertext, embed.footericon);
                const irc = await this.client.util.reqChannel(
                  this.client,
                  player.textChannel,
                  player.guild
                );
                if (irc) this.client.util.editReqTrack(this.client, player);
                if (
                  player.get(`afk-${player.get("playerauthor")}`) ||
                  player.get(`afk-${player.guild}`)
                ) {
                  return ch
                    .send({
                      embeds: [
                        embeds.setDescription(
                          `I will not Leave the Channel, cause afk is ✔️ Enabled`
                        ),
                      ],
                    })
                    .then((msg) => {
                      if (msg && msg.deletable) {
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
                ch.send({ embeds: [embeds] }).then((msg) => {
                  if (msg && msg.deletable) {
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

                ch.messages.fetch(player.get("playermessage")).then((msg) => {
                  if (msg && msg.deletable) {
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
                const irc5 = await this.client.util.reqChannel(
                  this.client,
                  player.textChannel,
                  player.guild
                );
                if (irc5)
                  this.client.util.editReqTrack(
                    this.client,
                    player,
                    player.queue.current,
                    "destroy"
                  );
                player.destroy();
              }
            } catch (e) {
              console.log(String(e.stack).yellow);
            }
          }, settings.LeaveOnEmpty_Queue.time_delay);
        }
      });
  }
}
