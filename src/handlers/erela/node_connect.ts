import Retro from "../..";

export default class ErlNode {
  client: Retro;
  public constructor(client: Retro) {
    this.client = client;
  }

  public async node(): Promise<void> {
    const stringlength = 69;
    this.client.manager
      .on("nodeConnect", (node) => {
        console.log("\n");
        console.log(
          `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
            .green
        );
        console.log(
          `     ┃ `.green +
            " ".repeat(-1 + stringlength - ` ┃ `.length) +
            "┃".green
        );
        console.log(
          `     ┃ `.green +
            `Node connected: `.green +
            " ".repeat(
              -1 + stringlength - ` ┃ `.length - `Node connected: `.length
            ) +
            "┃".green
        );
        console.log(
          `     ┃ `.green +
            ` { ${node.options.identifier} } `.green +
            " ".repeat(
              -1 +
                stringlength -
                ` ┃ `.length -
                ` { ${node.options.identifier} } `.length
            ) +
            "┃".green
        );
        console.log(
          `     ┃ `.green +
            " ".repeat(-1 + stringlength - ` ┃ `.length) +
            "┃".green
        );
        console.log(
          `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
            .green
        );
      })
      .on("nodeCreate", (node) => {
        console.log("\n");
        console.log(
          `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
            .green
        );
        console.log(
          `     ┃ `.green +
            " ".repeat(-1 + stringlength - ` ┃ `.length) +
            "┃".green
        );
        console.log(
          `     ┃ `.green +
            `Node created: `.green +
            " ".repeat(
              -1 + stringlength - ` ┃ `.length - `Node created: `.length
            ) +
            "┃".green
        );
        console.log(
          `     ┃ `.green +
            ` { ${node.options.identifier} } `.green +
            " ".repeat(
              -1 +
                stringlength -
                ` ┃ `.length -
                ` { ${node.options.identifier} } `.length
            ) +
            "┃".green
        );
        console.log(
          `     ┃ `.green +
            " ".repeat(-1 + stringlength - ` ┃ `.length) +
            "┃".green
        );
        console.log(
          `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
            .green
        );
      })
      .on("nodeReconnect", (node) => {
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
            `Node reconnected: `.yellow +
            " ".repeat(
              -1 + stringlength - ` ┃ `.length - `Node reconnected: `.length
            ) +
            "┃".yellow
        );
        console.log(
          `     ┃ `.yellow +
            ` { ${node.options.identifier} } `.yellow +
            " ".repeat(
              -1 +
                stringlength -
                ` ┃ `.length -
                ` { ${node.options.identifier} } `.length
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
      })
      .on("nodeDisconnect", (node) => {
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
            `Node disconnected: `.red +
            " ".repeat(
              -1 + stringlength - ` ┃ `.length - `Node disconnected: `.length
            ) +
            "┃".red
        );
        console.log(
          `     ┃ `.red +
            ` { ${node.options.identifier} } `.red +
            " ".repeat(
              -1 +
                stringlength -
                ` ┃ `.length -
                ` { ${node.options.identifier} } `.length
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
      })
      .on("nodeError", (node, error) => {
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
            `Node reconnected: `.red +
            " ".repeat(
              -1 + stringlength - ` ┃ `.length - `Node reconnected: `.length
            ) +
            "┃".red
        );
        console.log(
          `     ┃ `.red +
            ` { ${node.options.identifier} } `.red +
            " ".repeat(
              -1 +
                stringlength -
                ` ┃ `.length -
                ` { ${node.options.identifier} } `.length
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
      });
  }
}
