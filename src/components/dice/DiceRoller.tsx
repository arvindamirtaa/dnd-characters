'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDiceD20, 
  faDiceD6, 
  faDice,
} from '@fortawesome/free-solid-svg-icons';

// Add a declaration for canvas-confetti
declare module 'canvas-confetti';

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

type DiceRollerProps = {
  onRollComplete?: (result: number) => void;
  className?: string;
  defaultDieType?: DieType;
};

const DiceRoller = ({ onRollComplete, className = '', defaultDieType = 20 }: DiceRollerProps) => {
  const [dieType, setDieType] = useState<DieType>(defaultDieType);
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [previousResults, setPreviousResults] = useState<number[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const rollDie = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setResult(null);
    
    // Simulate dice rolling animation with changing numbers
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      const randomResult = Math.floor(Math.random() * dieType) + 1;
      setResult(randomResult);
      rollCount++;
      
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setIsRolling(false);
        
        // Store the final result
        const finalResult = randomResult;
        setPreviousResults(prev => [finalResult, ...prev].slice(0, 5));
        
        // If it's a critical roll (nat 20 on d20 or max on any die), show confetti
        if ((dieType === 20 && finalResult === 20) || finalResult === dieType) {
          triggerConfetti();
        }
        
        // Call the callback with the result
        if (onRollComplete) {
          onRollComplete(finalResult);
        }
      }
    }, 100);
  };

  const triggerConfetti = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const x = (buttonRect.left + buttonRect.right) / 2 / window.innerWidth;
    const y = (buttonRect.top + buttonRect.bottom) / 2 / window.innerHeight;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#7b1f18', '#d4a54a', '#193e2c', '#4a1760'],
    });
  };

  const getDieIcon = (type: DieType) => {
    switch (type) {
      case 6:
        return <FontAwesomeIcon icon={faDiceD6} className="w-6 h-6" />;
      case 20:
        return <FontAwesomeIcon icon={faDiceD20} className="w-6 h-6" />;
      default:
        return <FontAwesomeIcon icon={faDice} className="w-6 h-6" />;
    }
  };

  const getDieLabel = (type: DieType) => {
    return `d${type}`;
  };

  return (
    <div className={`rounded-lg border-2 border-dnd-secondary p-4 bg-dnd-dark/80 ${className}`}>
      <h3 className="heading-fancy text-xl mb-4 text-center">Dice Roller</h3>
      
      <div className="flex justify-center mb-4 space-x-2">
        {[4, 6, 8, 10, 12, 20, 100].map((die) => (
          <button
            key={die}
            className={`p-2 rounded-md transition-all ${
              dieType === die 
                ? 'bg-dnd-primary text-white border-2 border-dnd-secondary' 
                : 'bg-dnd-dark text-dnd-light hover:bg-dnd-primary/70'
            }`}
            onClick={() => setDieType(die as DieType)}
            aria-label={`Select d${die}`}
          >
            <div className="flex flex-col items-center">
              {getDieIcon(die as DieType)}
              <span className="text-xs mt-1">{getDieLabel(die as DieType)}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="flex justify-center mb-4">
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={rollDie}
          disabled={isRolling}
          className="bg-dnd-primary text-white py-3 px-6 rounded-lg font-medieval tracking-wide border-2 border-dnd-secondary text-xl relative overflow-hidden"
        >
          <span className="relative z-10">Roll d{dieType}</span>
        </motion.button>
      </div>
      
      <div className="text-center mb-4 h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {result !== null && (
            <motion.div
              key={`${dieType}-${result}-${Date.now()}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`text-5xl font-medieval ${
                result === dieType ? 'text-dnd-secondary' : 'text-dnd-light'
              }`}
            >
              {result}
            </motion.div>
          )}
          {isRolling && !result && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-dnd-secondary"
            >
              <FontAwesomeIcon icon={faDiceD20} size="2x" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {previousResults.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm text-dnd-secondary mb-2 font-medieval">Previous Rolls:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {previousResults.map((roll, index) => (
              <div 
                key={index} 
                className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm
                  ${roll === dieType ? 'border-dnd-secondary text-dnd-secondary' : 'border-dnd-light/50 text-dnd-light/80'}`}
              >
                {roll}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller; 