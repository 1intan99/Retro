import {
  ColorResolvable,
  MessageEmbed,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import ms from "ms";
import Retro from "../..";
import { embed, emoji, settings } from "../../conf/botconfig";

export default class ErlClient {
  public client: Retro;
  public constructor(client: Retro) {
    this.client = client;
  }

  public async start(): Promise<void> {
    this.client
      .once("ready", () => {
        this.client.manager.init(this.client.user.id);
      })
      .on("raw", (d) => this.client.manager.updateVoiceState(d))
      .on("channelDelete", async (channel) => {
        try {
          if (channel.type === "GUILD_VOICE") {
            if (channel.members.has(this.client.user.id)) {
              const player = this.client.manager.players.get(channel.guild.id);
              if (!player) return;
              if (channel.id === player.voiceChannel) {
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
              }
            }
          }
        } catch (e) {}
      })
      .on("guildDelete", async (guild) => {
        try {
          const player = this.client.manager.players.get(guild.id);
          if (!player) return;
          if (guild.id == player.guild) {
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
            // destroy
            player.destroy();
          }
        } catch (e) {}
      })
      .on("voiceStateUpdate", async (oldState, newState) => {
        if (
          newState.id === this.client.user.id &&
          oldState.serverDeaf &&
          !newState.serverDeaf
        ) {
          try {
            const channel = newState.member.guild.channels.cache.find(
              (channel: TextChannel) =>
                channel.type === "GUILD_TEXT" &&
                (channel.name.toLowerCase().includes("cmd") ||
                  channel.name.toLowerCase().includes("command") ||
                  channel.name.toLowerCase().includes("bot")) &&
                channel
                  .permissionsFor(newState.member.guild.me)
                  .has("SEND_MESSAGES")
            ) as TextChannel;
            channel.send(
              "Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience"
            );
            newState.setDeaf(true);
          } catch (e) {
            try {
              console.log("could not send info msg in a botchat");
              const channel = newState.member.guild.channels.cache.find(
                (channel: TextChannel) =>
                  channel.type === "GUILD_TEXT" &&
                  (channel.name.toLowerCase().includes("cmd") ||
                    channel.name.toLowerCase().includes("command") ||
                    channel.name.toLowerCase().includes("bot")) &&
                  channel
                    .permissionsFor(newState.member.guild.me)
                    .has("SEND_MESSAGES")
              ) as TextChannel;
              channel.send(
                "Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience"
              );
              newState.setDeaf(true);
            } catch (error) {
              console.log("could not send info msg in a random chat");
              newState.setDeaf(true);
            }
          }
        }
        if (oldState.channelId && !newState.channelId) {
          try {
            if (oldState.member.user.id === this.client.user.id) {
              const player = this.client.manager.players.get(oldState.guild.id);
              if (!player) return;
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
            }
          } catch (e) {}
        }
        let player = this.client.manager.players.get(newState.guild.id);
        if (!player) return;
        this.client.util.databasing(
          this.client,
          player.guild,
          player.get("playerauthor")
        );
        if (
          settings.leaveOnEmpty_Channel.enable &&
          oldState &&
          oldState.channel
        ) {
          player = this.client.manager.players.get(oldState.guild.id);
          if (!oldState.guild.me.voice.channelId) {
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
          }
          const vc = oldState.guild.channels.cache.get(
            player.voiceChannel
          ) as VoiceChannel;
          if (player && vc.members.size === 1) {
            setTimeout(async () => {
              try {
                player = this.client.manager.players.get(oldState.guild.id);
                if (!oldState.guild.me.voice.channelId && player) {
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
                  return player.destroy();
                }
                if (player && vc && vc.members.size === 1) {
                  const embeds = new MessageEmbed()
                    .setTitle(
                      `${emoji.msg.ERROR} Queue has ended | Channel Empty`
                    )
                    .setDescription(
                      `I left the Channel: ${
                        vc.name
                      } because the Channel was empty for: ${ms(
                        settings.leaveOnEmpty_Channel.time_delay,
                        { long: true }
                      )}`
                    )
                    .setColor(embed.wrongcolor as ColorResolvable)
                    .setFooter(embed.footertext, embed.footericon);
                  const ch = this.client.channels.cache.get(
                    player.textChannel
                  ) as TextChannel;
                  if (
                    player.get(`afk-${player.get(`playerauthor`)}`) ||
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
                          }, 4000);
                        } catch (e) {}
                      });
                  }
                  ch.send({ embeds: [embeds] }).then((msg) => {
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
                      }, 4000);
                    } catch (e) {}
                  });
                  try {
                    ch.messages
                      .fetch(player.get("playermessage"))
                      .then((msg) => {
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
                          }, 4000);
                        } catch (e) {}
                      });
                  } catch (e) {
                    console.log(String(e.stack).yellow);
                  }
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
                }
              } catch (e) {
                console.log(String(e.stack).yellow);
              }
            }, settings.leaveOnEmpty_Channel.time_delay);
          }
        }
      });
  }
}
