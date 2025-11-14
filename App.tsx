
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Game from './components/Game';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import RewardsHub from './components/RewardsHub';
import TriviaModal from './components/TriviaModal';
import { Page, PlayerStats, LeaderboardEntry, User } from './types';
import { MOCK_LEADERBOARD_DATA } from './constants';

const App: React.FC = () => {
  const [playerEmail, setPlayerEmail] = useState<string | null>(() => sessionStorage.getItem('marcz_maze_currentUser'));
  const [currentPage, setCurrentPage] = useState<Page>(Page.GAME);
  const [isTriviaVisible, setTriviaVisible] = useState(false);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    totalPoints: 0,
    marczBalance: 0,
    fastestTime: null,
  });

  // Simulated database helpers using localStorage
  const db = useMemo(() => ({
    getUsers: (): Record<string, User> => {
        const users = localStorage.getItem('marcz_maze_users');
        return users ? JSON.parse(users) : {};
    },
    saveUser: (user: User) => {
        const users = db.getUsers();
        users[user.email] = user;
        localStorage.setItem('marcz_maze_users', JSON.stringify(users));
    }
  }), []);

  // Effect to load player data on login
  useEffect(() => {
    if (playerEmail) {
      const users = db.getUsers();
      const currentUser = users[playerEmail];
      if (currentUser) {
        setPlayerStats(currentUser.stats);
      }
      sessionStorage.setItem('marcz_maze_currentUser', playerEmail);
    } else {
      sessionStorage.removeItem('marcz_maze_currentUser');
    }
  }, [playerEmail, db]);

  // Effect to save player stats when they change
  useEffect(() => {
    if (playerEmail) {
      const users = db.getUsers();
      const currentUser = users[playerEmail];
      if (currentUser && JSON.stringify(currentUser.stats) !== JSON.stringify(playerStats)) {
        const updatedUser = { ...currentUser, stats: playerStats };
        db.saveUser(updatedUser);
      }
    }
  }, [playerStats, playerEmail, db]);

  const handleLogin = (email: string) => {
    setPlayerEmail(email);
  };

  const handleLogout = () => {
      setPlayerEmail(null);
  };

  const updatePlayerStats = useCallback((points: number, time: number) => {
    setPlayerStats(prev => {
      const newFastestTime = prev.fastestTime === null || time < prev.fastestTime ? time : prev.fastestTime;
      return {
        ...prev,
        level: prev.level + 1,
        totalPoints: prev.totalPoints + points,
        fastestTime: newFastestTime,
      };
    });
  }, []);

  const convertPointsToMarcz = useCallback((points: number) => {
    const marczEarned = points / 10; // 10 points = 1 $MARCZ
    setPlayerStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints - points,
      marczBalance: prev.marczBalance + marczEarned,
    }));
    return marczEarned;
  }, []);
  
  const leaderboardData: LeaderboardEntry[] = useMemo(() => {
    if (!playerEmail) return MOCK_LEADERBOARD_DATA;
    const playerData: LeaderboardEntry = {
        rank: 0,
        name: playerEmail.split('@')[0],
        marcz: playerStats.marczBalance,
        fastestTime: playerStats.fastestTime,
        level: playerStats.level,
        isPlayer: true
    };
    return [...MOCK_LEADERBOARD_DATA, playerData];
  }, [playerEmail, playerStats]);


  if (!playerEmail) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900/50 text-cyan-100 flex flex-col">
      <Header 
        playerEmail={playerEmail} 
        marczBalance={playerStats.marczBalance} 
        onNavigate={setCurrentPage}
        onShowTrivia={() => setTriviaVisible(true)}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {currentPage === Page.GAME && <Game level={playerStats.level} onLevelComplete={updatePlayerStats} />}
        {currentPage === Page.LEADERBOARD && <Leaderboard data={leaderboardData} />}
        {currentPage === Page.REWARDS && <RewardsHub playerStats={playerStats} onConvert={convertPointsToMarcz} />}
      </main>
      {isTriviaVisible && <TriviaModal onClose={() => setTriviaVisible(false)} />}
       <footer className="text-center p-4 text-xs text-slate-500 font-mono">
        <p>&copy; 2024 MARCZ MAZE PROTOCOL. ALL RIGHTS RESERVED.</p>
        <p>This is a fictional game concept.</p>
      </footer>
    </div>
  );
};

export default App;
