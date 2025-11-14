
import React, { useState, useMemo } from 'react';
import { LeaderboardEntry } from '../types';

// FIX: Removed an unused import that was causing a compilation error because 'ChevronUpIcon' is not an exported member.

type SortKey = 'marcz' | 'fastestTime' | 'level';

const Leaderboard: React.FC<{ data: LeaderboardEntry[] }> = ({ data }) => {
    const [sortKey, setSortKey] = useState<SortKey>('marcz');

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            if (sortKey === 'fastestTime') {
                if (a.fastestTime === null) return 1;
                if (b.fastestTime === null) return -1;
                return a.fastestTime - b.fastestTime;
            }
            return b[sortKey]! - a[sortKey]!;
        }).map((entry, index) => ({...entry, rank: index + 1}));
    }, [data, sortKey]);

    const SortButton: React.FC<{ sortValue: SortKey, label: string }> = ({ sortValue, label }) => (
        <button 
            onClick={() => setSortKey(sortValue)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${sortKey === sortValue ? 'bg-cyan-600 text-white' : 'bg-slate-700/50 text-cyan-200 hover:bg-slate-600/50'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
            <h2 className="font-orbitron text-3xl text-glow-cyan mb-6 text-center">Global Leaderboard</h2>
            <div className="flex justify-center space-x-1 mb-0 border-b border-slate-700">
                <SortButton sortValue="marcz" label="By $Marcz" />
                <SortButton sortValue="fastestTime" label="By Fastest Time" />
                <SortButton sortValue="level" label="By Level" />
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-cyan-500/30">
                        <tr>
                            <th className="p-4 font-semibold text-cyan-300">Rank</th>
                            <th className="p-4 font-semibold text-cyan-300">Runner</th>
                            <th className="p-4 font-semibold text-cyan-300 text-right">
                                {sortKey === 'marcz' && '$MARCZ'}
                                {sortKey === 'fastestTime' && 'Fastest Time (s)'}
                                {sortKey === 'level' && 'Level'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map(entry => (
                            <tr key={entry.name} className={`border-b border-slate-700/50 ${entry.isPlayer ? 'bg-fuchsia-500/20' : 'hover:bg-slate-700/30'}`}>
                                <td className="p-4 font-orbitron font-bold text-lg">{entry.rank}</td>
                                <td className={`p-4 font-semibold ${entry.isPlayer ? 'text-fuchsia-300' : 'text-white'}`}>{entry.name}</td>
                                <td className="p-4 font-mono font-bold text-right">
                                    {sortKey === 'marcz' && entry.marcz.toLocaleString()}
                                    {sortKey === 'fastestTime' && (entry.fastestTime ? entry.fastestTime.toFixed(2) : 'N/A')}
                                    {sortKey === 'level' && entry.level}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
