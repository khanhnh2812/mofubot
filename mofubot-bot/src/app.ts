import 'reflect-metadata';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { Collection, EmbedBuilder } from 'discord.js';

import Container from 'typedi';
import { DiscordInstanceFactory } from './factory/discord.factory';
import { ISlashCommand } from './interface/utils/command.interface';
import MofuApiService from '@/utils/mofu.instance';
import { omit } from 'lodash';

dotenv.config();

declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>;
  }
}

const discord = Container.get(DiscordInstanceFactory).create();

discord.login(process.env.BOT_TOKEN).then((_) => {
  console.log('Logged in successfully');
});

discord.on('ready', () => {
  console.log('Ready!');
});

// Read commands
discord.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandsFile = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('command.ts'));

for (const file of commandsFile) {
  const filePath = path.join(commandsPath, file);
  const fileExport = require(filePath);
  const fileClass = fileExport[Object.keys(fileExport)[0]];
  const fileInstance = Container.get<ISlashCommand>(fileClass);

  if (!(fileInstance.execute instanceof Function)) continue;

  discord.commands.set(fileInstance.name, fileInstance);
}

discord.on('messageCreate', async (message) => {
  const content = message.content;

  if (message.author.bot) return;

  const prefix = process.env.PREFIX;
  if (content.startsWith(prefix)) {
    const withoutPrefix = message.content.slice(prefix.length);
    const messageArgs = withoutPrefix.split(' ');
    const command = messageArgs[0];

    if (command === 'list') {
      const { data } = await getListAlias();
      const list = data.data.docs;
      const embeds = new EmbedBuilder().setTitle('Alias list').addFields(
        {
          name: 'Name',
          value: list.map((x) => x.alias).join('\n'),
          inline: true,
        },
        {
          name: 'Prc id',
          value: list.map((x) => x.prc_id).join('\n'),
          inline: true,
        }
      );

      message.reply({
        embeds: [embeds],
      });
    }

    if (command === 'alias') {
      const alias = messageArgs[1];

      try {
        const { data } = await getMofuAlias(alias);

        message.reply({
          embeds: mofuEmbedBuilder(data),
        });
      } catch (_) {
        message.reply(`Could not found user with alias ${alias}`);
      }
    }

    if (command === 'id') {
      const id = messageArgs[1];

      try {
        const { data } = await getMofuId(id);

        message.reply({
          embeds: mofuEmbedBuilder(data),
        });
      } catch (_) {
        message.reply(`Could not found user with id ${id}`);
      }
    }

    if (command === 'add') {
      const alias = messageArgs[1];
      const id = messageArgs[2];

      try {
        await createAlias({ alias, prc_id: id });
        message.reply(`Created new alias ${alias} - ${id}`);
      } catch (e) {
        if (e?.response?.data?.message) {
          message.reply(e?.response?.data?.message);
          return;
        }
        message.reply('Could not create this alias for some reason');
      }
    }
  }
});

const getListAlias = () => {
  return MofuApiService.get('/Alias');
};

const createAlias = (body) => {
  return MofuApiService.post('/Alias', body);
};

const getMofuAlias = (alias) => {
  return MofuApiService.get(`/Mofu/Alias/${alias}`);
};

const getMofuId = (id) => {
  return MofuApiService.get(`/Mofu/Id/${id}`);
};

const mofuEmbedBuilder = (data) => {
  const generalInfo = omit(data, ['details', 'leaderboard', 'message']);
  const detailInfo = data.details;
  const leaderboardInfo = data.leaderboard;

  const generalEmbeds = new EmbedBuilder().setTitle('General Info').addFields(
    ...Object.keys(generalInfo).map((item) => ({
      name: snakeCaseConverter(item),
      value: `${generalInfo[item]}`,
      inline: true,
    }))
  );

  const detailEmbed = new EmbedBuilder().setTitle('Detail Info').addFields(
    ...Object.keys(detailInfo).map((item) => ({
      name: snakeCaseConverter(item),
      value: `${detailInfo[item]}`,
      inline: true,
    }))
  );

  const leaderboardEmbed = new EmbedBuilder()
    .setTitle('Leaderboard Info')
    .addFields(
      ...Object.keys(leaderboardInfo).map((item) => ({
        name: snakeCaseConverter(item),
        value: `${leaderboardInfo[item]}`,
        inline: true,
      }))
    );

  return [generalEmbeds, detailEmbed, leaderboardEmbed];
};

const snakeCaseConverter = (str) => {
  return str
    .split('_')
    .map((x) => upperFirstLetter(x))
    .join(' ');
};

const upperFirstLetter = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};
