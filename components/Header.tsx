
import React from 'react';
import { Page } from '../types';
import { GamepadIcon, BarChartIcon, GiftIcon, QuestionMarkCircleIcon, CurrencyDollarIcon, ArrowLeftOnRectangleIcon } from './icons/Icons';

interface HeaderProps {
  playerEmail: string;
  marczBalance: number;
  onNavigate: (page: Page) => void;
  onShowTrivia: () => void;
  onLogout: () => void;
}

const NavButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
    <button onClick={onClick} className="flex items-center space-x-2 px-3 py-2 text-cyan-200 hover:bg-cyan-500/20 rounded-md transition-all duration-300 hover:text-white">
        {icon}
        <span className="hidden md:inline">{label}</span>
    </button>
);


const Header: React.FC<HeaderProps> = ({ playerEmail, marczBalance, onNavigate, onShowTrivia, onLogout }) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="font-orbitron text-xl font-bold text-glow-cyan tracking-wider">MARCZ MAZE</h1>
          </div>
          <nav className="flex items-center space-x-1 md:space-x-2">
            <NavButton onClick={() => onNavigate(Page.GAME)} icon={<GamepadIcon className="h-5 w-5"/>} label="Game"/>
            <NavButton onClick={() => onNavigate(Page.LEADERBOARD)} icon={<BarChartIcon className="h-5 w-5"/>} label="Leaderboard"/>
            <NavButton onClick={() => onNavigate(Page.REWARDS)} icon={<GiftIcon className="h-5 w-5"/>} label="Rewards"/>
            <NavButton onClick={onShowTrivia} icon={<QuestionMarkCircleIcon className="h-5 w-5"/>} label="Trivia"/>
          </nav>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm">
                <CurrencyDollarIcon className="h-5 w-5 text-fuchsia-400" />
                <span className="font-bold text-white">{marczBalance.toFixed(2)}</span>
                <span className="text-fuchsia-300 font-orbitron text-xs">$MARCZ</span>
            </div>
            <div className="hidden lg:block text-sm text-slate-400 truncate max-w-[150px]">{playerEmail}</div>
             <button onClick={onLogout} title="Logout" className="flex items-center p-2 text-slate-400 hover:bg-cyan-500/20 rounded-full transition-all duration-300 hover:text-white">
                <ArrowLeftOnRectangleIcon className="h-5 w-5"/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
