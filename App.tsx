
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Game from './components/Game';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import RewardsHub from './components/RewardsHub';
import TriviaModal from './components/TriviaModal';
import Profile from './components/Profile';
import { Page, PlayerStats, LeaderboardEntry, User } from './types';
import { MOCK_LEADERBOARD_DATA } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.GAME);
  const [isTriviaVisible, setTriviaVisible] = useState(false);

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

  // Effect to load user data on initial app load
  useEffect(() => {
    const userEmail = sessionStorage.getItem('marcz_maze_currentUser');
    if (userEmail) {
      const users = db.getUsers();
      const user = users[userEmail];
      if (user) {
        setCurrentUser(user);
      }
    }
  }, [db]);

  // Effect to save user data whenever it changes
  useEffect(() => {
    if (currentUser) {
      db.saveUser(currentUser);
    }
  }, [currentUser, db]);

  const handleLogin = (email: string) => {
    const users = db.getUsers();
    const user = users[email];
    if (user) {
        setCurrentUser(user);
        sessionStorage.setItem('marcz_maze_currentUser', email);
    }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      sessionStorage.removeItem('marcz_maze_currentUser');
  };

  const updatePlayerStats = useCallback((points: number, time: number) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const newFastestTime = prevUser.stats.fastestTime === null || time < prevUser.stats.fastestTime ? time : prevUser.stats.fastestTime;
      const newStats: PlayerStats = {
        ...prevUser.stats,
        level: prevUser.stats.level + 1,
        totalPoints: prevUser.stats.totalPoints + points,
        fastestTime: newFastestTime,
      };
      return { ...prevUser, stats: newStats };
    });
  }, []);

  const convertPointsToMarcz = useCallback((points: number) => {
    const marczEarned = points / 10; // 10 points = 1 $MARCZ
    setCurrentUser(prevUser => {
        if (!prevUser) return null;
        const newStats: PlayerStats = {
            ...prevUser.stats,
            totalPoints: prevUser.stats.totalPoints - points,
            marczBalance: prevUser.stats.marczBalance + marczEarned,
        };
        return { ...prevUser, stats: newStats };
    });
    return marczEarned;
  }, []);

  const handleProfileUpdate = useCallback((data: { username: string; avatar: string }) => {
    setCurrentUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, ...data };
    });
  }, []);
  
  const leaderboardData: LeaderboardEntry[] = useMemo(() => {
    if (!currentUser) return MOCK_LEADERBOARD_DATA;
    const playerData: LeaderboardEntry = {
        rank: 0,
        name: currentUser.username,
        marcz: currentUser.stats.marczBalance,
        fastestTime: currentUser.stats.fastestTime,
        level: currentUser.stats.level,
        isPlayer: true
    };
    return [...MOCK_LEADERBOARD_DATA, playerData];
  }, [currentUser]);


  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900/50 text-cyan-100 flex flex-col">
      <Header 
        username={currentUser.username} 
        marczBalance={currentUser.stats.marczBalance} 
        onNavigate={setCurrentPage}
        onShowTrivia={() => setTriviaVisible(true)}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {currentPage === Page.GAME && <Game level={currentUser.stats.level} onLevelComplete={updatePlayerStats} />}
        {currentPage === Page.LEADERBOARD && <Leaderboard data={leaderboardData} />}
        {currentPage === Page.REWARDS && <RewardsHub playerStats={currentUser.stats} onConvert={convertPointsToMarcz} />}
        {currentPage === Page.PROFILE && <Profile user={currentUser} onUpdateProfile={handleProfileUpdate} />}
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
