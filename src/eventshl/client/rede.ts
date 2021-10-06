import { TextChannel } from "discord.js";
import Retro from "../..";
import Event from "../../handlers/events";

export default class Ready extends Event {
  public constructor(client: Retro) {
    super(client, {
      name: "ReDe",
      emiter: "ready",
    });
  }

  public async run(): Promise<void> {
    const stringlength = 69;
    console.log("\n");
    console.log(
      `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
        .green
    );
    console.log(
      `     ┃ `.green + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".green
    );
    console.log(
      `     ┃ `.green +
        `Discord Bot is online!`.green +
        " ".repeat(
          -1 + stringlength - ` ┃ `.length - `Discord Bot is online!`.length
        ) +
        "┃".green
    );
    console.log(
      `     ┃ `.green +
        ` /--/ ${this.client.user.tag} /--/ `.green +
        " ".repeat(
          -1 +
            stringlength -
            ` ┃ `.length -
            ` /--/ ${this.client.user.tag} /--/ `.length
        ) +
        "┃".green
    );
    console.log(
      `     ┃ `.green + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".green
    );
    console.log(
      `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
        .green
    );
  }
}
