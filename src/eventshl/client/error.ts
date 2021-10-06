import Retro from "../..";
import Event from "../../handlers/events";

export default class Error extends Event {
  public constructor(client: Retro) {
    super(client, {
      name: "Error",
      emiter: "error",
    });
  }

  public async run(): Promise<void> {
    console.error();
  }
}
