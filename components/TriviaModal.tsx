
import React, { useState } from 'react';
import { TRIVIA_QUESTIONS } from '../constants';
import { BookOpenIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';

interface TriviaModalProps {
  onClose: () => void;
}

const TriviaModal: React.FC<TriviaModalProps> = ({ onClose }) => {
  const [currentQuestionIndex] = useState(Math.floor(Math.random() * TRIVIA_QUESTIONS.length));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = TRIVIA_QUESTIONS[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
  };
  
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
        return 'bg-slate-700 hover:bg-cyan-600/50';
    }
    if (option === question.correctAnswer) {
        return 'bg-green-500/80';
    }
    if (option === selectedOption) {
        return 'bg-red-500/80';
    }
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border-2 border-fuchsia-500/50 rounded-lg shadow-2xl shadow-fuchsia-500/20 p-8 transform transition-all duration-300 scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-orbitron text-2xl text-glow-fuchsia mb-4 text-center">Weekly Lore Trivia</h2>
        <div className="bg-slate-800 p-6 rounded-lg">
            <p className="text-lg text-cyan-200 mb-6 font-semibold">{question.question}</p>
            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <button 
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${getButtonClass(option)}`}
                        disabled={isAnswered}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>

        {isAnswered && (
            <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                    {selectedOption === question.correctAnswer ? (
                        <CheckCircleIcon className="w-8 h-8 text-green-400" />
                    ) : (
                         <XCircleIcon className="w-8 h-8 text-red-400" />
                    )}
                    <h3 className="text-xl font-bold">
                        {selectedOption === question.correctAnswer ? 'Correct!' : 'Incorrect.'}
                    </h3>
                </div>
                <div className="flex items-start gap-3">
                    <BookOpenIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                    <p className="text-slate-300">{question.lore}</p>
                </div>
            </div>
        )}

        <div className="mt-8 text-center">
            <button
                onClick={onClose}
                className="bg-slate-700 text-cyan-200 px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TriviaModal;
