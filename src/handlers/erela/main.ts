import { Manager } from "erela.js";
import Spotify from "erela.js-spotify";
import Retro from "../..";
import ErlEvent from "./event";
import ErlNode from "./node_connect";
import ErlClient from "./client";
import { nodes, clientID, clientSecret } from "../../conf/botconfig";

export default class ErlMain {
  public client: Retro;
  public erela: ErlEvent;
  public node: ErlNode;
  public erelacl: ErlClient;
  public constructor(client: Retro) {
    this.client = client;
    this.erela = new ErlEvent(client);
    this.node = new ErlNode(client);
    this.erelacl = new ErlClient(client);
  }

  public async main(): Promise<void> {
    const Deezer = require("erela.js-deezer");
    const client = this.client;
    if (!clientID || !clientSecret) {
      this.client.manager = new Manager({
        nodes,
        plugins: [new Deezer()],
        send(id, payload) {
          const guild = client.guilds.cache.get(id);
          if (guild) guild.shard.send(payload);
        },
      });
    } else {
      this.client.manager = new Manager({
        nodes,
        plugins: [
          new Spotify({
            clientID,
            clientSecret,
          }),
          new Deezer(),
        ],
        send(id, payload) {
          const guild = client.guilds.cache.get(id);
          if (guild) guild.shard.send(payload);
        },
      });
    }
    await this.erelacl.start();
    await this.node.node();
    this.erela.event();
  }
}
