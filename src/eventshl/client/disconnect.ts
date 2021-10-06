import { TextChannel } from "discord.js";
import Retro from "../..";
import Event from "../../handlers/events";

export default class Disconnect extends Event {
  public constructor(client: Retro) {
    super(client, {
      name: "Disconnect",
      emiter: "shardDisconnect",
    });
  }

  public async run(): Promise<void> {
    console.log(
      `${this.client.user.tag} has been disconnected at ${new Date()}`.red
    );
  }
}
