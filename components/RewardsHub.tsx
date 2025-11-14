
import React, { useState } from 'react';
import { PlayerStats } from '../types';
import { GiftIcon, CurrencyDollarIcon, ArrowRightCircleIcon } from './icons/Icons';

interface RewardsHubProps {
    playerStats: PlayerStats;
    onConvert: (points: number) => number;
}

const RewardsHub: React.FC<RewardsHubProps> = ({ playerStats, onConvert }) => {
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const handleConvert = () => {
        if (playerStats.totalPoints > 0) {
            const marczEarned = onConvert(playerStats.totalPoints);
            setConvertedAmount(marczEarned);
            setMessage(`Successfully converted ${playerStats.totalPoints} points to ${marczEarned.toFixed(2)} $MARCZ!`);
        } else {
            setMessage("You have no points to convert.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
                <h2 className="font-orbitron text-3xl text-glow-cyan mb-6">Rewards Hub</h2>
                <div className="space-y-4">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-300">Unconverted Points</p>
                        <p className="text-3xl font-bold font-mono text-white">{playerStats.totalPoints.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-sm text-fuchsia-300">$MARCZ Balance</p>
                        <p className="text-3xl font-bold font-mono text-white">{playerStats.marczBalance.toFixed(2)}</p>
                    </div>
                    <div className="pt-4">
                        <button 
                            onClick={handleConvert}
                            disabled={playerStats.totalPoints <= 0}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-500 transition-all transform hover:scale-105 neon-glow-cyan disabled:bg-slate-600 disabled:text-slate-400 disabled:scale-100 disabled:shadow-none"
                        >
                           <ArrowRightCircleIcon className="w-6 h-6" /> Convert All Points
                        </button>
                    </div>
                    {message && (
                        <p className={`mt-4 text-center text-sm ${convertedAmount ? 'text-green-400' : 'text-yellow-400'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="font-orbitron text-2xl text-glow-fuchsia mb-6">Redeem $MARCZ</h3>
                <p className="text-slate-400 mb-6 text-sm">The following rewards are part of the game simulation. Redeem your earned $MARCZ for cosmetic upgrades and bonuses.</p>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="font-semibold">Neon Trail FX</span>
                        <button className="text-xs font-bold bg-fuchsia-600 px-3 py-1 rounded-full hover:bg-fuchsia-500">150 $MARCZ</button>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="font-semibold">Ancient Glyph Skin</span>
                        <button className="text-xs font-bold bg-fuchsia-600 px-3 py-1 rounded-full hover:bg-fuchsia-500">300 $MARCZ</button>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="font-semibold">Bonus Level Access</span>
                        <button className="text-xs font-bold bg-fuchsia-600 px-3 py-1 rounded-full hover:bg-fuchsia-500">500 $MARCZ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsHub;
