import Retro from "../..";
import Event from "../../handlers/events";
import { Interaction, MessageActionRow, MessageButton } from "discord.js";

export default class Seles extends Event {
  public constructor(client: Retro) {
    super(client, {
      name: "Seles",
      emiter: "interactionCreate",
    });
  }

  public async run(int: Interaction): Promise<void> {
    if (!int.isCommand()) return;

    const { commandName } = int;

    if (commandName === "ping") {
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("primary")
          .setLabel("Primary")
          .setStyle("PRIMARY")
      );

      await int.reply({ content: "Pong!", components: [row] });
    }
  }
}
