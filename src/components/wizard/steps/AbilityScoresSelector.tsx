'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AbilityScores, CharacterRace, CharacterClass } from '@/types/character';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faDice, faRandom } from '@fortawesome/free-solid-svg-icons';
import DiceRoller from '@/components/dice/DiceRoller';

// Ability score descriptions
const ABILITY_DESCRIPTIONS = {
  strength: 'Measures physical power, affecting melee attacks, lifting capacity, and athletic ability.',
  dexterity: 'Measures agility and reflexes, affecting AC, initiative, ranged attacks, and Dexterity-based skills.',
  constitution: 'Measures endurance and health, affecting hit points and Constitution saving throws.',
  intelligence: 'Measures reasoning and memory, affecting the number of languages, spell effectiveness for some classes, and Intelligence-based skills.',
  wisdom: 'Measures perception and intuition, affecting spell effectiveness for some classes and Wisdom-based skills.',
  charisma: 'Measures force of personality, affecting social interactions, ability to lead, and spell effectiveness for some classes.'
};

// Ability score modifiers
const getModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

// Format modifier
const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

type AbilityScoresSelectorProps = {
  abilityScores: AbilityScores;
  onUpdateScores: (scores: AbilityScores) => void;
  race?: CharacterRace;
  characterClass: CharacterClass;
};

export default function AbilityScoresSelector({
  abilityScores,
  onUpdateScores,
  characterClass
}: AbilityScoresSelectorProps) {
  const [scores, setScores] = useState<AbilityScores>(abilityScores);
  const [remainingPoints, setRemainingPoints] = useState<number>(27);
  const [method, setMethod] = useState<'pointbuy' | 'standard' | 'roll'>('pointbuy');
  const [showDiceRoller, setShowDiceRoller] = useState<boolean>(false);
  const [rollingAbility, setRollingAbility] = useState<keyof AbilityScores | null>(null);
  
  // Cost of increasing an ability score in point buy system
  const pointBuyCost: Record<number, number> = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9
  };
  
  // Standard array of scores
  const standardArray = [15, 14, 13, 12, 10, 8];
  
  // Update a specific ability score
  const updateScore = (ability: keyof AbilityScores, value: number) => {
    if (method === 'pointbuy') {
      // Calculate points to refund from current score
      const currentCost = pointBuyCost[scores[ability]] || 0;
      
      // Calculate cost of new score
      const newCost = pointBuyCost[value] || 0;
      
      // Calculate remaining points after change
      const updatedRemainingPoints = remainingPoints + currentCost - newCost;
      
      // Check if we have enough points
      if (updatedRemainingPoints < 0 || value < 8 || value > 15) {
        return;
      }
      
      setRemainingPoints(updatedRemainingPoints);
    }
    
    // Update the score
    const newScores = { ...scores, [ability]: value };
    setScores(newScores);
    onUpdateScores(newScores);
  };
  
  // Handle dice roll result
  const handleDiceRoll = (result: number) => {
    if (rollingAbility) {
      updateScore(rollingAbility, result);
      setRollingAbility(null);
      setShowDiceRoller(false);
    }
  };
  
  // Roll for an ability score
  const rollForAbility = (ability: keyof AbilityScores) => {
    setRollingAbility(ability);
    setShowDiceRoller(true);
  };
  
  // Get recommended abilities for class
  const getRecommendedAbilities = (): string => {
    const recommendations: Record<CharacterClass, string[]> = {
      'Barbarian': ['Strength', 'Constitution'],
      'Bard': ['Charisma', 'Dexterity'],
      'Cleric': ['Wisdom', 'Strength or Constitution'],
      'Druid': ['Wisdom', 'Constitution'],
      'Fighter': ['Strength or Dexterity', 'Constitution'],
      'Monk': ['Dexterity', 'Wisdom'],
      'Paladin': ['Strength', 'Charisma'],
      'Ranger': ['Dexterity', 'Wisdom'],
      'Rogue': ['Dexterity', 'Intelligence or Charisma'],
      'Sorcerer': ['Charisma', 'Constitution'],
      'Warlock': ['Charisma', 'Constitution'],
      'Wizard': ['Intelligence', 'Constitution']
    };
    
    const recommended = recommendations[characterClass] || [];
    return recommended.join(' and ');
  };
  
  // Generate random scores
  const generateRandomScores = () => {
    if (method === 'roll') {
      const randomScores: AbilityScores = {
        strength: Math.floor(Math.random() * 13) + 8,
        dexterity: Math.floor(Math.random() * 13) + 8,
        constitution: Math.floor(Math.random() * 13) + 8,
        intelligence: Math.floor(Math.random() * 13) + 8,
        wisdom: Math.floor(Math.random() * 13) + 8,
        charisma: Math.floor(Math.random() * 13) + 8
      };
      
      setScores(randomScores);
      onUpdateScores(randomScores);
    } else if (method === 'standard') {
      // Randomly assign standard array
      const shuffled = [...standardArray].sort(() => 0.5 - Math.random());
      
      const randomScores: AbilityScores = {
        strength: shuffled[0],
        dexterity: shuffled[1],
        constitution: shuffled[2],
        intelligence: shuffled[3],
        wisdom: shuffled[4],
        charisma: shuffled[5]
      };
      
      setScores(randomScores);
      onUpdateScores(randomScores);
    }
  };
  
  return (
    <div>
      <h2 className="heading-fancy text-3xl mb-6 text-center">Ability Scores</h2>
      
      <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50 mb-6">
        <p className="text-dnd-light/90 mb-4">
          Your ability scores define your character&apos;s physical and mental attributes. For your {characterClass},
          we recommend prioritizing <span className="text-dnd-secondary font-bold">{getRecommendedAbilities()}</span>.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <button
            className={`px-4 py-2 rounded ${method === 'pointbuy' ? 'bg-dnd-primary text-white' : 'bg-dnd-dark/70'}`}
            onClick={() => setMethod('pointbuy')}
          >
            Point Buy
          </button>
          <button
            className={`px-4 py-2 rounded ${method === 'standard' ? 'bg-dnd-primary text-white' : 'bg-dnd-dark/70'}`}
            onClick={() => setMethod('standard')}
          >
            Standard Array
          </button>
          <button
            className={`px-4 py-2 rounded ${method === 'roll' ? 'bg-dnd-primary text-white' : 'bg-dnd-dark/70'}`}
            onClick={() => setMethod('roll')}
          >
            Roll Scores
          </button>
        </div>
        
        {method === 'pointbuy' && (
          <div className="text-center text-dnd-light/90 mb-4">
            <p>Remaining points: <span className="text-dnd-secondary font-bold">{remainingPoints}</span></p>
            <p className="text-sm">Scores must be between 8 and 15 before racial modifiers.</p>
          </div>
        )}
        
        {method === 'standard' && (
          <div className="text-center text-dnd-light/90 mb-4">
            <p>Assign the following scores: <span className="text-dnd-secondary font-bold">{standardArray.join(', ')}</span></p>
            <p className="text-sm">Each score can only be used once.</p>
          </div>
        )}
        
        {method === 'roll' && (
          <div className="text-center text-dnd-light/90 mb-4">
            <p>Roll 4d6, drop the lowest die, and assign the total to your ability scores.</p>
            <p className="text-sm">Click on the dice icon next to each ability to roll for it.</p>
          </div>
        )}
        
        {method !== 'pointbuy' && (
          <div className="text-center mb-4">
            <button
              className="btn-secondary flex items-center gap-2 mx-auto"
              onClick={generateRandomScores}
            >
              <FontAwesomeIcon icon={faRandom} />
              Randomly Assign
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {(Object.keys(scores) as Array<keyof AbilityScores>).map((ability) => (
          <motion.div
            key={ability}
            className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="heading-fancy text-xl capitalize">{ability}</h3>
              <div className="flex items-center gap-2">
                {method === 'roll' && (
                  <button
                    className="text-dnd-secondary hover:text-dnd-primary"
                    onClick={() => rollForAbility(ability)}
                  >
                    <FontAwesomeIcon icon={faDice} size="lg" />
                  </button>
                )}
                <span className="text-2xl font-medieval text-dnd-secondary w-8 text-center">
                  {scores[ability]}
                </span>
                <span className="text-dnd-light/80 font-medieval text-sm w-8 text-center">
                  ({formatModifier(getModifier(scores[ability]))})
                </span>
              </div>
            </div>
            
            <p className="text-sm text-dnd-light/70 mb-3">{ABILITY_DESCRIPTIONS[ability]}</p>
            
            {method === 'pointbuy' && (
              <div className="flex justify-center gap-4">
                <button
                  className="p-1 text-dnd-light/70 hover:text-dnd-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={() => updateScore(ability, scores[ability] - 1)}
                  disabled={scores[ability] <= 8}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
                <div className="w-24 h-1 bg-dnd-dark self-center rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-dnd-primary"
                    style={{ width: `${((scores[ability] - 8) / 7) * 100}%` }}
                  ></div>
                </div>
                <button
                  className="p-1 text-dnd-light/70 hover:text-dnd-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={() => updateScore(ability, scores[ability] + 1)}
                  disabled={scores[ability] >= 15 || remainingPoints < (pointBuyCost[scores[ability] + 1] || 0) - (pointBuyCost[scores[ability]] || 0)}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
              </div>
            )}
            
            {method === 'standard' && (
              <div className="flex justify-center gap-2">
                {standardArray.map((value) => (
                  <button
                    key={value}
                    className={`w-8 h-8 rounded-full text-xs font-bold
                      ${scores[ability] === value ? 'bg-dnd-primary text-white' : 'bg-dnd-dark text-dnd-light/70'}
                      ${Object.values(scores).filter(s => s === value).length > 1 && scores[ability] !== value ? 'opacity-30 cursor-not-allowed' : 'hover:bg-dnd-primary/70'}
                    `}
                    onClick={() => {
                      // Don't allow selecting a value that's already used elsewhere (unless it's the current value)
                      if (Object.values(scores).filter(s => s === value).length > 1 && scores[ability] !== value) {
                        return;
                      }
                      updateScore(ability, value);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {showDiceRoller && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dnd-dark rounded-lg border-2 border-dnd-secondary p-6 max-w-md w-full">
            <h3 className="heading-fancy text-xl mb-4 text-center">
              Rolling for {rollingAbility && rollingAbility.charAt(0).toUpperCase() + rollingAbility.slice(1)}
            </h3>
            <DiceRoller 
              onRollComplete={handleDiceRoll}
              defaultDieType={20}
            />
            <div className="text-center mt-4">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setRollingAbility(null);
                  setShowDiceRoller(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center text-dnd-light/70 italic">
        <p>Ability scores determine how effective your character is in different situations.</p>
      </div>
    </div>
  );
} 