
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateMaze } from '../services/mazeGenerator';
import { MazeCell, PlayerPosition } from '../types';
import { POINTS } from '../constants';
import { ClockIcon, StarIcon, TrophyIcon, ArrowPathIcon } from './icons/Icons';

const CELL_SIZE_PX = 24;

interface GameProps {
  level: number;
  onLevelComplete: (points: number, time: number) => void;
}

// Helper component defined outside to prevent re-renders
const MemoizedMazeCell: React.FC<{ cell: MazeCell }> = React.memo(({ cell }) => {
    const wallClasses = {
        top: cell.walls.top ? 'border-t-2' : '',
        right: cell.walls.right ? 'border-r-2' : '',
        bottom: cell.walls.bottom ? 'border-b-2' : '',
        left: cell.walls.left ? 'border-l-2' : '',
    };
    
    return (
        <div 
            className={`relative w-6 h-6 border-cyan-500/50 ${Object.values(wallClasses).join(' ')}`}
            style={{ 
                width: `${CELL_SIZE_PX}px`,
                height: `${CELL_SIZE_PX}px`,
                transition: 'background-color 0.3s ease',
            }}
        >
            {cell.isEnd && <div className="absolute inset-0 bg-fuchsia-500/50 animate-pulse"></div>}
            {cell.hasItem && <div className="absolute inset-1.5 rounded-full bg-yellow-400 neon-glow-fuchsia animate-pulse"></div>}
        </div>
    );
});
MemoizedMazeCell.displayName = 'MemoizedMazeCell';


const Game: React.FC<GameProps> = ({ level, onLevelComplete }) => {
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [itemsCollected, setItemsCollected] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won'>('ready');
  
  const mazeSize = useMemo(() => Math.min(10 + level * 2, 30), [level]);

  const startNewLevel = useCallback(() => {
    const newMaze = generateMaze(mazeSize, mazeSize);
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setTime(0);
    setScore(0);
    const items = newMaze.flat().filter(c => c.hasItem).length;
    setTotalItems(items);
    setItemsCollected(0);
    setGameState('playing');
  }, [mazeSize]);

  useEffect(() => {
    startNewLevel();
  }, [level, startNewLevel]);

  // FIX: Replaced `NodeJS.Timeout` with a browser-compatible timer implementation.
  // This also fixes a potential runtime error by ensuring `clearInterval` is only called when a timer is set.
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const handleWin = useCallback(() => {
    setGameState('won');
    const timeBonus = Math.max(0, (mazeSize * 5 - time) * POINTS.TIME_BONUS_PER_SECOND);
    const finalScore = score + POINTS.LEVEL_COMPLETE + timeBonus;
    onLevelComplete(finalScore, time);
  }, [time, score, onLevelComplete, mazeSize]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;

    const { x, y } = playerPos;
    const currentCell = maze[y]?.[x];
    if (!currentCell) return;

    let newPos = { ...playerPos };

    if (e.key === 'ArrowUp' || e.key === 'w') {
      if (!currentCell.walls.top) newPos.y -= 1;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      if (!currentCell.walls.bottom) newPos.y += 1;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      if (!currentCell.walls.left) newPos.x -= 1;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      if (!currentCell.walls.right) newPos.x += 1;
    }
    
    if (newPos.x !== x || newPos.y !== y) {
      const nextCell = maze[newPos.y][newPos.x];
      if (nextCell.hasItem) {
          nextCell.hasItem = false; // Mutating state here for performance, re-render is triggered by setPlayerPos
          setItemsCollected(prev => prev + 1);
          setScore(prev => prev + POINTS.HIDDEN_ITEM);
      }
      setPlayerPos(newPos);
      if(nextCell.isEnd) {
        handleWin();
      }
    }
  }, [gameState, playerPos, maze, handleWin]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/3 bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 space-y-4">
            <h2 className="font-orbitron text-2xl text-glow-cyan">LEVEL {level}</h2>
            <div className="flex justify-between items-center text-lg">
                <span className="flex items-center gap-2 text-slate-300"><ClockIcon className="w-5 h-5 text-cyan-400" /> Time:</span>
                <span className="font-mono font-bold text-white">{time}s</span>
            </div>
            <div className="flex justify-between items-center text-lg">
                <span className="flex items-center gap-2 text-slate-300"><TrophyIcon className="w-5 h-5 text-cyan-400" /> Score:</span>
                <span className="font-mono font-bold text-white">{score}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
                <span className="flex items-center gap-2 text-slate-300"><StarIcon className="w-5 h-5 text-cyan-400" /> Items:</span>
                <span className="font-mono font-bold text-white">{itemsCollected} / {totalItems}</span>
            </div>
            <p className="text-sm text-slate-400 pt-4 border-t border-slate-700">Use Arrow Keys or WASD to navigate. Reach the glowing purple square to complete the level.</p>
        </div>

        <div className="flex-grow flex items-center justify-center">
            {gameState === 'won' && (
                <div className="absolute inset-0 z-10 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                    <h2 className="font-orbitron text-5xl text-glow-fuchsia mb-4">LEVEL CLEARED</h2>
                    <p className="text-xl mb-2">Final Score: <span className="font-bold text-white">{score + POINTS.LEVEL_COMPLETE}</span></p>
                    <p className="text-xl mb-6">Time: <span className="font-bold text-white">{time}s</span></p>
                    <button 
                        onClick={() => {
                            // The App component will provide a new level prop, triggering a re-render and new maze
                            console.log("Next level triggered by parent state change.")
                        }}
                        className="flex items-center gap-2 bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-fuchsia-500 transition-all transform hover:scale-105 neon-glow-fuchsia"
                    >
                        <ArrowPathIcon className="w-6 h-6"/> Proceed to Next Level
                    </button>
                </div>
            )}
            <div className="bg-slate-900 p-2 border-2 border-cyan-700 rounded-lg shadow-2xl shadow-cyan-500/20">
                <div className="relative" style={{ width: mazeSize * CELL_SIZE_PX, height: mazeSize * CELL_SIZE_PX }}>
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${mazeSize}, 1fr)` }}>
                        {maze.flat().map(cell => <MemoizedMazeCell key={`${cell.x}-${cell.y}`} cell={cell} />)}
                    </div>
                     <div 
                        className="absolute w-4 h-4 bg-green-400 rounded-full transition-all duration-100 ease-linear border-2 border-green-200"
                        style={{
                            left: playerPos.x * CELL_SIZE_PX + (CELL_SIZE_PX / 2) - 8,
                            top: playerPos.y * CELL_SIZE_PX + (CELL_SIZE_PX / 2) - 8,
                            boxShadow: '0 0 10px #4ade80, 0 0 15px #4ade80'
                        }}>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Game;
