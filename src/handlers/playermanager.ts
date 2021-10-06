import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Retro from "..";
import { embed } from "../conf/botconfig";
import {
  playlist,
  request,
  search,
  similar,
  skiptrack,
  song,
} from "./playermanager/index";

export const playermanger = (
  client: Retro,
  message: Message,
  args: string[],
  type: string
) => {
  let method = type.includes(":") ? type.split(":") : Array(type);
  if (!message.guild) return;

  try {
    let guildstring = ` - ${
      message.guild ? message.guild.name : "Unknown Guild Name"
    } `.substr(0, 22);
    let userstring = ` - ${message.author.tag} `.substr(0, 22);

    const stringlength = 69;
    console.log("\n");
    console.log(
      `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
        .red
    );
    console.log(
      `     ┃ `.red + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".red
    );
    console.log(
      `     ┃ `.red +
        `NEW SONG REQUEST: `.green +
        " ".repeat(
          -1 + stringlength - ` ┃ `.length - `NEW SONG REQUEST: `.length
        ) +
        "┃".red
    );
    console.log(
      `     ┃ `.red +
        ` - ${args.join(" ")}`.substr(0, 60).cyan +
        " ".repeat(
          -1 +
            stringlength -
            ` ┃ `.length -
            ` - ${args.join(" ")}`.substr(0, 60).length
        ) +
        "┃".red
    );
    console.log(
      `     ┃ `.red + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".red
    );
    console.log(
      `     ┃ `.red +
        `REQUESTED BY: `.green +
        " ".repeat(-1 + stringlength - ` ┃ `.length - `REQUESTED BY: `.length) +
        "┃".red
    );
    console.log(
      `     ┃ `.red +
        userstring.cyan +
        "━".repeat(stringlength / 3 - userstring.length).red +
        "━━>".red +
        ` ${message.author.id}`.cyan +
        " ".repeat(
          -1 +
            stringlength -
            ` ┃ `.length -
            userstring.length -
            "━━>".length -
            ` ${message.author.id}`.length -
            "━".repeat(stringlength / 3 - userstring.length).length
        ) +
        "┃".red
    );
    console.log(
      `     ┃ `.red + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".red
    );
    console.log(
      `     ┃ `.red +
        `REQUESTED IN: `.green +
        " ".repeat(-1 + stringlength - ` ┃ `.length - `REQUESTED IN: `.length) +
        "┃".red
    );
    console.log(
      `     ┃ `.red +
        guildstring.cyan +
        "━".repeat(stringlength / 3 - guildstring.length).red +
        "━━>".red +
        ` ${message.guild.id}`.cyan +
        " ".repeat(
          -1 +
            stringlength -
            ` ┃ `.length -
            guildstring.length -
            "━━>".length -
            ` ${message.guild.id}`.length -
            "━".repeat(stringlength / 3 - guildstring.length).length
        ) +
        "┃".red
    );
    console.log(
      `     ┃ `.red + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".red
    );
    console.log(
      `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
        .red
    );
    console.log("\n");
  } catch (e) {
    console.log(e);
  }

  let { channel } = message.member.voice;
  const permission = channel.permissionsFor(client.user);

  if (!permission.has("CONNECT"))
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(embed.wrongcolor as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon)
          .setTitle("❌ Error | I need permissions to speak in your channel"),
      ],
    });

  if (method[0] === "song") {
    song(client, message, args, type);
  } else if (method[0] === "request") {
    request(client, message, args, type);
  } else if (method[0] === "playlist") {
    playlist(client, message, args, type);
  } else if (method[0] === "similar") {
    similar(client, message, args, type);
  } else if (method[0] === "search") {
    search(client, message, args, type);
  } else if (method[0] === "skiptrack") {
    skiptrack(client, message, args, type);
  } else {
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(embed.wrongcolor as ColorResolvable)
          .setFooter(embed.footertext, embed.footericon)
          .setTitle(
            "❌ Error | No valid search Term? ... Please Contact: `Kanjeng Raden Supri#6583`"
          ),
      ],
    });
  }
};
