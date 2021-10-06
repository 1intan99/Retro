import { CmdOpt, CmdReturn } from "../TSConfig";
import Retro from "..";
import {
  Message,
  BitFieldResolvable,
  PermissionString,
  MessageEmbed,
} from "discord.js";

export class Command {
  client: Retro;
  name: string;
  aliases: string[];
  clientPermissions: BitFieldResolvable<PermissionString, number>;
  userPermissions: BitFieldResolvable<PermissionString, number>;
  cooldown: number;
  category: string;
  description: string;
  usage: string;
  developer?: boolean;
  hide: boolean;
  status: { mt: boolean; reason: string };

  public constructor(client: Retro, opt: CmdOpt) {
    this.client = client;
    this.name = opt.name;
    this.aliases = opt.aliases;
    this.clientPermissions = opt.clientPermissions || ["EMBED_LINKS"];
    this.userPermissions = opt.userPermissions || [];
    this.cooldown = opt.cooldown || 5;
    this.category = opt.developer ? "Dev" : opt.category || "Misc";
    this.description = opt.description || "No description provided";
    this.usage = opt.usage || "No usage provided";
    this.developer = opt.developer || false;
    this.hide = opt.hide || false;
    this.status = opt.status || { mt: false, reason: "Fixing some bugs" };
  }

  public async start(
    message: Message,
    args: string[],
    prefix: string
  ): Promise<CmdReturn | void> {
    throw new Error("Method not implemented.".red);
  }

  public async run(
    message: Message,
    args: string[],
    prefix: string
  ): Promise<void> {
    throw new Error("Method not implemented.".red);
  }

  public async allowed(message: Message): Promise<boolean | void> {
    throw new Error("Methor not implemented.".red);
  }
}

export default Command;
