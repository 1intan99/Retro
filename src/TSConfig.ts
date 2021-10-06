import { PermissionString, ClientEvents, MessageEmbed } from "discord.js";

export interface CmdOpt {
  name: string;
  aliases: string[];
  clientPermissions?: Array<PermissionString>;
  userPermissions?: Array<PermissionString>;
  cooldown?: number;
  category?: string;
  description?: string;
  usage?: string;
  developer?: boolean;
  hide?: boolean;
  status?: { mt: boolean; reason: string };
}

export interface EnvOpt {
  name: string;
  emiter: keyof ClientEvents;
  disable?: boolean;
  type?: "on" | "once";
}

export interface CmdReturn {
  err: string;
  description?: string;
  example?: string;
  send?: string;
}
