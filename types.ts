
export interface MazeCell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  isStart: boolean;
  isEnd: boolean;
  hasItem: boolean;
  hasBonus: boolean;
  visited: boolean;
}

export interface PlayerPosition {
  x: number;
  y: number;
}

export enum Page {
  GAME = 'game',
  LEADERBOARD = 'leaderboard',
  REWARDS = 'rewards',
}

export interface PlayerStats {
  level: number;
  totalPoints: number;
  marczBalance: number;
  fastestTime: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  marcz: number;
  fastestTime: number | null;
  level: number;
  isPlayer?: boolean;
}

export interface TriviaQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    lore: string;
}

export interface User {
  email: string;
  password: string; // NOTE: In a real-world app, this should be a securely hashed password.
  stats: PlayerStats;
}
