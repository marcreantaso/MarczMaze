
import type { LeaderboardEntry, TriviaQuestion } from './types';

export const POINTS = {
  LEVEL_COMPLETE: 100,
  HIDDEN_ITEM: 25,
  BONUS_OBJECTIVE: 50,
  TIME_BONUS_PER_SECOND: 1,
};

export const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 1, name: 'CypherRunner', marcz: 15234, fastestTime: 28.4, level: 42 },
    { rank: 2, name: 'GlitchWitch', marcz: 14890, fastestTime: 31.2, level: 40 },
    { rank: 3, name: 'NeonNinja', marcz: 13500, fastestTime: 29.8, level: 38 },
    { rank: 4, name: 'DataDrifter', marcz: 12100, fastestTime: 35.1, level: 35 },
    { rank: 5, name: 'ChronoByte', marcz: 11560, fastestTime: 33.5, level: 33 },
    { rank: 6, name: 'VoidWalker', marcz: 10800, fastestTime: 38.0, level: 31 },
    { rank: 7, name: 'SyntaxShadow', marcz: 9750, fastestTime: 40.3, level: 29 },
    { rank: 8, name: 'GridGhost', marcz: 8900, fastestTime: 42.1, level: 27 },
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
    {
        question: "What is the 'Echo Shard' said to contain?",
        options: ["The maze's source code", "Memories of the first runner", "A fragment of $Marcz", "A map to the core"],
        correctAnswer: "Memories of the first runner",
        lore: "The Echo Shards are crystallized data-fragments, believed to hold the residual consciousness of the first beings to navigate the digital labyrinth. They whisper forgotten paths to those who listen closely."
    },
    {
        question: "The ancient maze builders were known by what name?",
        options: ["The Architects", "The Weavers", "The Codewrights", "The Masons"],
        correctAnswer: "The Codewrights",
        lore: "The Codewrights were not just programmers; they were digital artisans who wove logic and light into the very fabric of the maze, embedding their philosophies into its algorithms."
    },
    {
        question: "What does the symbol of the $Marcz token represent?",
        options: ["A key and a coin", "An infinite loop", "A stylized labyrinth", "A digital eye"],
        correctAnswer: "A stylized labyrinth",
        lore: "The dual-spirals of the $Marcz symbol represent the endless journey inwards to find truth, and outwards to share knowledge, mirroring the structure of the mazes themselves."
    }
];

export const AVATARS: string[] = [
    'avatar-glitch-cat',
    'avatar-neon-skull',
    'avatar-circuit-brain',
    'avatar-data-ghost',
    'avatar-ruin-golem',
    'avatar-tech-oracle',
];
