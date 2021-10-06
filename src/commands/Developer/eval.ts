import { Message, MessageEmbed } from "discord.js";
import Retro from "../..";
import Command from "../../handlers/command";
import { CmdReturn } from "../../TSConfig";
import b from "beautify";
import { inspect } from "util";

export default class Eval extends Command {
  public constructor(client: Retro) {
    super(client, {
      name: "Eval",
      aliases: ["eval", "e"],
      developer: true,
      hide: true,
    });
  }

  public async start(
    message: Message,
    args: string[]
  ): Promise<CmdReturn | void> {
    const codes = args.join(" ");
    if (!codes)
      return {
        err: "Missing Arguments",
        description: "Please write some codes",
      };

    let evad = async () => eval(codes);
    evad = await evad();
    const e = new MessageEmbed()
      .addFields(
        {
          name: "Input",
          value: `\`\`\`js\n${b(codes, { format: "js" })}\n\`\`\``,
        },
        {
          name: "Output",
          value: `\`\`\`js\n${inspect(evad, { depth: 0 })}\n\`\`\``,
        },
        { name: "Type", value: typeof evad }
      )
      .setTimestamp()
      .setColor("BLUE")
      .setFooter(this.client.user.username, this.client.user.avatarURL());

    message.channel.send({ embeds: [e] });
  }
}
