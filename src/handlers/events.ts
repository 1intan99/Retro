import { EnvOpt } from "../TSConfig";
import Retro from "..";
import { Message, ClientEvents } from "discord.js";

class Event {
  client: Retro;
  options: EnvOpt;
  name: string;
  emiter: keyof ClientEvents;
  disable: boolean;
  once: boolean;
  type: "on" | "once";
  constructor(client: Retro, options: EnvOpt) {
    this.client = client;
    this.name = options.name;
    this.emiter = options.emiter;
    this.disable = options.disable || false;
    this.type = options.type || "on";
  }

  async load(...args: unknown[]): Promise<void> {
    await this.run(...args).catch((er) => {
      this.client.cvent.emit(
        "logger",
        "error",
        `Error at Event ${this.name}\n${er.stack}`
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(...args: unknown[]): Promise<void | Message> {
    throw new Error("Method not implemented.");
  }
}

export default Event;
