import {
  IMofuDetails,
  IMofuLeaderboard,
  IMofuUser,
} from '@/interface/document/mofu.document';

import { AliasService } from './alias.service';
import { MofuNotFoundError } from '@/utils/error';
import { Service } from 'typedi';
import caller from '@/utils/mofu-axios.instance';
import { load } from 'cheerio';

const MOFU_PROFILE_VIEW_URL = '/profile/view';
const NOT_FOUND_TEXT = 'Invalid or non-existent Player ID.';
const DETAILS_ENUM = {
  'Arena Bracket': 'arena_bracket',
  'P. Arena Bracket': 'p_arena_bracket',
  'Total Power': 'total_power',
  'Units Owned': 'unit_owned',
  'Likes Received': 'like_received',
  'Likes Given': 'live_given',
  'Arena Score': 'arena_score',
  'P. Arena Score': 'p_arena_score',
  'Last Updated': 'last_updated',
};
const LEADERBOARD_ENUM = {
  'Likes Received': 'like_received_rank',
  'Likes Given': 'like_given_rank',
  'Total Power': 'total_power_rank',
  'Arena Score': 'arena_score_rank',
  'P. Arena Score': 'p_arena_score_rank',
};

@Service()
export class MofuService {
  public name: string = 'Mofu';

  /**
   * Check if an alias is existed for alias
   * @param {string} alias - Provided alias's alias
   */
  public async getDataById(id: string): Promise<IMofuUser> {
    const { data } = await caller.get(`${MOFU_PROFILE_VIEW_URL}/${id}`);
    const $ = load(data);
    const container = $('.container');

    const isNotFound =
      container
        .children('.row')
        .filter((_, el) => $(el).find('p').html() === NOT_FOUND_TEXT).length >
      0;

    if (isNotFound) throw new MofuNotFoundError();

    const infoContainer = container.children('div').last();

    // First container (general info)
    const firstContainer = infoContainer
      .first()
      .find('div.card-body')
      .find('div.d-flex');
    const username = firstContainer.find('h4').first().text().trim();
    const level = firstContainer.find('div').text().trim().slice(6);
    const clan = firstContainer
      .find('small')
      .find('em')
      .first()
      .text()
      .trim()
      .slice(10);
    const friends = firstContainer
      .find('small')
      .last()
      .text()
      .trim()
      .split('\n')[0];

    // Second container (More details info)
    const secondContainer = infoContainer
      .children('div:nth-child(2)')
      .find('div.card-body');

    const details = {} as IMofuDetails;
    secondContainer.children('.row').each((_, el) => {
      const outerBox = $(el).find('.col');
      const title = outerBox.first().text().trim();
      const value = outerBox.last().text().trim();
      details[DETAILS_ENUM[title]] = value;
    });

    // Third container (leaderboard)
    const thirdContainer = infoContainer
      .children('div:nth-child(3)')
      .find('div.card-body');

    const leaderboard = {} as IMofuLeaderboard;
    thirdContainer.children('.row').each((_, el) => {
      const outerBox = $(el).find('.col');
      const title = outerBox.first().text().trim();
      const value = outerBox.last().text().trim();
      leaderboard[LEADERBOARD_ENUM[title]] = value;
    });

    return {
      username,
      level,
      clan,
      friends,
      details,
      leaderboard,
      message: 'Data retrieve succeeded',
    };
  }
}
