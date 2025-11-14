
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { AVATARS } from '../constants';
import { UserCircleIcon, CheckCircleIcon } from './icons/Icons';

interface ProfileProps {
    user: User;
    onUpdateProfile: (data: { username: string; avatar: string; }) => void;
}

const AvatarDisplay: React.FC<{ avatarId: string, sizeClass?: string }> = ({ avatarId, sizeClass = 'w-24 h-24' }) => {
    const colors = useMemo(() => {
        const hash = avatarId.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const color1 = `hsl(${hash % 360}, 70%, 50%)`;
        const color2 = `hsl(${(hash * 7) % 360}, 70%, 60%)`;
        const color3 = `hsl(${(hash * 13) % 360}, 80%, 70%)`;
        return { color1, color2, color3 };
    }, [avatarId]);

    return (
        <div className={`${sizeClass} rounded-full p-1 bg-gradient-to-br from-cyan-500 to-fuchsia-500`}>
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <radialGradient id={`grad-${avatarId}`}>
                            <stop offset="0%" stopColor={colors.color3} />
                            <stop offset="100%" stopColor={colors.color2} />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill={`url(#grad-${avatarId})`} />
                    <text x="50" y="65" fontSize="40" textAnchor="middle" fill={colors.color1} className="font-orbitron font-bold opacity-50 select-none">
                        {avatarId.slice(7,9).toUpperCase()}
                    </text>
                </svg>
            </div>
        </div>
    );
};


const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile }) => {
    const [username, setUsername] = useState(user.username);
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        onUpdateProfile({ username, avatar: selectedAvatar });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const hasChanges = useMemo(() => {
        return username !== user.username || selectedAvatar !== user.avatar;
    }, [username, selectedAvatar, user.username, user.avatar]);

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 flex flex-col items-center">
                <AvatarDisplay avatarId={selectedAvatar} sizeClass="w-32 h-32" />
                <h2 className="font-orbitron text-2xl text-glow-cyan mt-4">{username}</h2>
                <p className="text-sm text-slate-400">{user.email}</p>

                <div className="w-full text-left mt-8 space-y-3 text-sm">
                    <h3 className="font-bold text-cyan-300 border-b border-slate-700 pb-2 mb-2">STATS</h3>
                    <div className="flex justify-between"><span>Level:</span> <span className="font-mono font-bold">{user.stats.level}</span></div>
                    <div className="flex justify-between"><span>Total Points:</span> <span className="font-mono font-bold">{user.stats.totalPoints.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>$MARCZ Balance:</span> <span className="font-mono font-bold">{user.stats.marczBalance.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Fastest Time:</span> <span className="font-mono font-bold">{user.stats.fastestTime ? `${user.stats.fastestTime}s` : 'N/A'}</span></div>
                </div>
            </div>

            <div className="md:col-span-2 bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
                <h2 className="font-orbitron text-3xl text-glow-fuchsia mb-6">Edit Profile</h2>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-cyan-300 mb-2">Username</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><UserCircleIcon className="h-5 w-5 text-cyan-400" /></div>
                            <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="block w-full rounded-md border-0 bg-slate-700/50 py-2.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-cyan-500/30 focus:ring-2 focus:ring-inset focus:ring-fuchsia-500 sm:text-sm sm:leading-6 transition-all"
                                placeholder="Enter your runner name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">Select Avatar</label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                            {AVATARS.map(avatarId => (
                                <button 
                                    key={avatarId} 
                                    onClick={() => setSelectedAvatar(avatarId)}
                                    className={`rounded-full transition-all duration-200 ${selectedAvatar === avatarId ? 'ring-4 ring-fuchsia-500' : 'ring-2 ring-transparent hover:ring-cyan-400'}`}
                                >
                                    <AvatarDisplay avatarId={avatarId} sizeClass="w-16 h-16" />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <button 
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-500 transition-all transform hover:scale-105 neon-glow-cyan disabled:bg-slate-600 disabled:text-slate-400 disabled:scale-100 disabled:shadow-none"
                        >
                            {saved ? (
                                <><CheckCircleIcon className="w-6 h-6" /> Changes Saved!</>
                            ) : (
                                <>Save Changes</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
