import Retro from "../..";
import Event from "../../handlers/events";

export default class Reconnect extends Event {
  public constructor(client: Retro) {
    super(client, {
      name: "Reconnect",
      emiter: "shardReconnecting",
    });
  }

  public async run(): Promise<void> {
    console.log(`${this.client.user.tag} Reconnecting at ${new Date()}`.yellow);
  }
}
