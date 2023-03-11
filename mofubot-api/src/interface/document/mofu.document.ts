export interface IMofuDetails {
  arena_bracket: string;
  p_arena_bracket: string;
  total_power: string;
  unit_owned: string;
  like_received: string;
  live_given: string;
  arena_score: string;
  p_arena_score: string;
  last_updated: string;
}

export interface IMofuLeaderboard {
  like_received_rank: string;
  like_given_rank: string;
  total_power_rank: string;
  arena_score_rank: string;
  p_arena_score_rank: string;
}

export interface IMofuUser {
  username: string;
  level: string;
  clan: string;
  friends: string;
  details: IMofuDetails;
  leaderboard: IMofuLeaderboard;
  message: string;
}
