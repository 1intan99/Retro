import { Client, Collection, Intents } from "discord.js";
import { EventEmitter } from "events";
import { Command } from "./handlers/command";
import Event from "./handlers/events";
import Handler from "./module/handler";
import { Util } from "./Utils";
import { dev } from "./conf/botconfig";
import { Manager } from "erela.js";
import ErlMain from "./handlers/erela/main";
import colors from "colors";
import Enmap from "enmap";
const color = require("colors");

class Retro extends Client {
  public command: Collection<string, Command>;
  public event: Collection<ScrollSetting, Event>;
  public alises: Collection<string, string>;
  public cooldown: Collection<string, Collection<string, number>>;
  public handler: Handler;
  public cvent: EventEmitter;
  public dev: string[];
  public util: Util;
  public manager: Manager;
  public erela: ErlMain;
  public premium: Enmap;
  public stats: Enmap;
  public settings: Enmap;
  public setups: Enmap;
  public queuesaves: Enmap;
  public modActions: Enmap;
  public userProfiles: Enmap;
  public constructor() {
    super({
      restTimeOffset: 0,
      shards: "auto",
      restWsBridgeTimeout: 100,
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      ],
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
    });
    this.command = new Collection();
    this.event = new Collection();
    this.alises = new Collection();
    this.cooldown = new Collection();
    this.handler = new Handler(this);
    this.util = new Util(this);
    this.erela = new ErlMain(this);
    this.premium = new Enmap({
      name: "premium",
      dataDir: "./database/premium",
    });
    this.stats = new Enmap({ name: "stats", dataDir: "./database/stats" });
    this.settings = new Enmap({
      name: "setups",
      dataDir: "./database/settings",
    });
    this.setups = new Enmap({ name: "setups", dataDir: "./database/setups" });
    this.queuesaves = new Enmap({
      name: "queuesaves",
      dataDir: "./database/queuesaves",
      ensureProps: false,
    });
    this.modActions = new Enmap({
      name: "actions",
      dataDir: "./database/warns",
    });
    this.userProfiles = new Enmap({
      name: "userProfiles",
      dataDir: "./database/warns",
    });
    this.dev = dev;
  }

  public async start(): Promise<void> {
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
        `Bot Starup...`.red +
        " ".repeat(-1 + stringlength - ` ┃ `.length - `Bot Starup...`.length) +
        "┃".red
    );
    console.log(
      `     ┃ `.red +
        ` /--/ RaRNime /--/ `.red +
        " ".repeat(
          -1 + stringlength - ` ┃ `.length - ` /--/ RaRNime /--/ `.length
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
    await this.handler.loadCommand();
    await this.handler.loadEventHandler();
    await this.erela.main();
    this.login(process.env.TOKEN);
  }
}

export default Retro;
