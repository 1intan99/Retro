import Retro from "..";
import { sync } from "glob";
import { dirname, sep, parse } from "path";
import Command from "../handlers/command";
import Event from "../handlers/events";
import { Collection } from "discord.js";

class Handler {
  public client: Retro;
  public constructor(client: Retro) {
    this.client = client;
  }

  private get direction(): string {
    return `${dirname(require.main.filename)}${sep}`;
  }

  public async loadCommand(): Promise<void> {
    const commands = await sync(`${this.direction}commands/**/*.js`);
    let i = 0;

    for (const command of commands) {
      const { name } = parse(command);
      delete require.cache[command];

      const File = require(command).default;
      const cmd = new File(this.client);
      if (!(cmd instanceof Command))
        throw new TypeError(
          `Please maek ${name} as intance of Command Constructor.`.yellow
        );

      const { aliases } = cmd;

      this.client.command.set(aliases[0], cmd);
      this.client.cooldown.set(aliases[0], new Collection());
      for (const alias of aliases.slice(1))
        this.client.alises.set(alias, aliases[0]);
      i++;
    }
    try {
      const stringlength = 69;
      console.log("\n");
      console.log(
        `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
          .yellow
      );
      console.log(
        `     ┃ `.yellow +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          `Command Loaded`.yellow +
          " ".repeat(
            -1 + stringlength - ` ┃ `.length - `Command Loaded`.length
          ) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          ` /--/ ${i} /--/ `.yellow +
          " ".repeat(
            -1 + stringlength - ` ┃ `.length - ` /--/ ${i} /--/ `.length
          ) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".yellow
      );
      console.log(
        `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
          .yellow
      );
    } catch (err) {
      console.error(String(err).red);
    }
  }

  public async loadEvent(): Promise<void> {
    const events = await sync(`${this.direction}events/**/*.js`);
    let i = 0;

    for (const event of events) {
      delete require.cache[event];
      const fl = parse(event);

      const File = require(event).default;
      const ev = new File(this.client);
      if (!(ev instanceof Event))
        throw new TypeError(
          `Please make ${fl.name} as intance of Commands Constructor.`.yellow
        );

      const { name } = ev;
      this.client.event.set(name as any, ev);
      i++;
    }
    try {
      const stringlength = 69;
      console.log("\n");
      console.log(
        `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
          .yellow
      );
      console.log(
        `     ┃ `.yellow +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          `Event Loaded`.yellow +
          " ".repeat(-1 + stringlength - ` ┃ `.length - `Event Loaded`.length) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          ` /--/ ${i} /--/ `.yellow +
          " ".repeat(
            -1 + stringlength - ` ┃ `.length - ` /--/ ${i} /--/ `.length
          ) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".yellow
      );
      console.log(
        `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
          .yellow
      );
    } catch (err) {
      console.error(String(err).red);
    }
  }

  public async loadEventHandler(): Promise<void> {
    const events = await sync(`${this.direction}eventshl/**/*.js`);
    let i = 0;
    for (const event of events) {
      delete require.cache[event];
      const fl = parse(event);

      const File = require(event).default;
      const ev = new File(this.client);
      if (!(ev instanceof Event))
        throw new TypeError(
          `Please make ${fl.name} as instance of Commands Constructor`.yellow
        );

      const { emiter, type } = ev;
      this.client[type](emiter, ev.load.bind(ev));
      i++;
    }
    try {
      const stringlength = 69;
      console.log("\n");
      console.log(
        `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
          .yellow
      );
      console.log(
        `     ┃ `.yellow +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          `Event Handler Loaded`.yellow +
          " ".repeat(
            -1 + stringlength - ` ┃ `.length - `Event Handler Loaded`.length
          ) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          ` /--/ ${i} /--/ `.yellow +
          " ".repeat(
            -1 + stringlength - ` ┃ `.length - ` /--/ ${i} /--/ `.length
          ) +
          "┃".yellow
      );
      console.log(
        `     ┃ `.yellow +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".yellow
      );
      console.log(
        `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
          .yellow
      );
    } catch (err) {
      console.error(String(err).red);
    }
  }
}

export default Handler;
