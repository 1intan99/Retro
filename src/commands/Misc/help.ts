import { Message } from "discord.js";
import Retro from "../..";
import { Command } from "../../handlers/command";
import { CmdReturn } from "../../TSConfig";

export default class Help extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "help",
      aliases: ["help", "h"],
    });
  }

  public async start(message: Message): Promise<CmdReturn | void> {
    message.channel.send("JOKOWI LEWAT AWAS!!!!");
  }
}
