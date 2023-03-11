import { ISlashCommand } from '@/interface/utils/command.interface';
import { Service } from 'typedi';
import { SlashCommandBuilder } from 'discord.js';

@Service()
export class PingCommand extends SlashCommandBuilder implements ISlashCommand {
  name = 'ping';
  description = 'test';

  async execute(interaction) {
    await interaction.reply('test');
  }
}
