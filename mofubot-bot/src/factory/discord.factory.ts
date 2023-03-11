import { Client, GatewayIntentBits, Partials } from 'discord.js';

import { IFactory } from '@/interface/utils/factory.interface';
import { Service } from 'typedi';

@Service()
export class DiscordInstanceFactory implements IFactory<Client> {
  public instance: Client;

  constructor() {}

  public create() {
    const client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Channel, Partials.ThreadMember],
    });

    this.instance = client;
    return this.instance;
  }
}
