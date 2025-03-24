'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Character } from '@/types/character';
import CharacterSheetPDF from '@/components/character-sheet/CharacterSheetPDF';

// Format ability score modifiers
const getModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

// Format modifier
const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

type CharacterReviewProps = {
  character: Character;
  onUpdateCharacter?: (updates: Partial<Character>) => void;
};

export default function CharacterReview({ character, onUpdateCharacter }: CharacterReviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'traits' | 'spells'>('overview');
  
  const { abilityScores } = character;
  
  return (
    <div>
      <h2 className="heading-fancy text-3xl mb-6 text-center">Character Review</h2>
      
      <div className="flex justify-center mb-6">
        <div className="bg-dnd-dark/70 rounded-lg p-4 border-2 border-dnd-secondary/50 max-w-2xl text-center">
          <h3 className="heading-fancy text-2xl mb-1">{character.name || 'Unnamed Hero'}</h3>
          <p className="text-dnd-light/90">
            Level {character.level} {character.race} {character.class}{' '}
            {character.background && `(${character.background})`}
          </p>
        </div>
      </div>
      
      <div className="tabs mb-6 flex justify-center border-b border-dnd-secondary/30">
        <button
          className={`px-4 py-2 font-medieval ${activeTab === 'overview' ? 'text-dnd-secondary border-b-2 border-dnd-secondary' : 'text-dnd-light/70'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medieval ${activeTab === 'details' ? 'text-dnd-secondary border-b-2 border-dnd-secondary' : 'text-dnd-light/70'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`px-4 py-2 font-medieval ${activeTab === 'traits' ? 'text-dnd-secondary border-b-2 border-dnd-secondary' : 'text-dnd-light/70'}`}
          onClick={() => setActiveTab('traits')}
        >
          Traits
        </button>
        {character.spells && character.spells.length > 0 && (
          <button
            className={`px-4 py-2 font-medieval ${activeTab === 'spells' ? 'text-dnd-secondary border-b-2 border-dnd-secondary' : 'text-dnd-light/70'}`}
            onClick={() => setActiveTab('spells')}
          >
            Spells
          </button>
        )}
      </div>
      
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Character basics */}
          <div className="col-span-1 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Basic Info</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Race:</span>
                <span className="font-medieval text-dnd-light">{character.race}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Class:</span>
                <span className="font-medieval text-dnd-light">{character.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Level:</span>
                <span className="font-medieval text-dnd-light">{character.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Background:</span>
                <span className="font-medieval text-dnd-light">{character.background}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Alignment:</span>
                <span className="font-medieval text-dnd-light">{character.alignment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">XP:</span>
                <span className="font-medieval text-dnd-light">{character.experiencePoints || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Combat stats */}
          <div className="col-span-1 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Combat</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Armor Class:</span>
                <span className="font-medieval text-dnd-light">{character.armorClass || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Initiative:</span>
                <span className="font-medieval text-dnd-light">
                  {formatModifier(getModifier(abilityScores?.dexterity || 10))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Speed:</span>
                <span className="font-medieval text-dnd-light">{character.speed || 30} ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Hit Points:</span>
                <span className="font-medieval text-dnd-light">
                  {character.hitPoints && typeof character.hitPoints === 'object'
                    ? `${character.hitPoints.current}/${character.hitPoints.maximum}`
                    : character.hitPoints || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dnd-light/70">Hit Dice:</span>
                <span className="font-medieval text-dnd-light">{character.level}d{character.hitDice || 8}</span>
              </div>
            </div>
          </div>
          
          {/* Ability scores */}
          <div className="col-span-1 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Ability Scores</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {abilityScores && Object.entries(abilityScores).map(([ability, score]) => (
                <div key={ability} className="bg-dnd-dark/40 rounded p-2 text-center">
                  <div className="uppercase text-xs text-dnd-light/70">{ability}</div>
                  <div className="text-xl font-medieval text-dnd-secondary">{score}</div>
                  <div className="text-xs text-dnd-light/90">{formatModifier(getModifier(score))}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Equipment */}
          <div className="col-span-1 md:col-span-3 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Equipment</h3>
            
            {character.equipment && character.equipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {character.equipment.map((item, index) => (
                  <div key={index} className="bg-dnd-dark/30 p-2 rounded">
                    {typeof item === 'string' ? item : item.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dnd-light/70 italic">No equipment recorded.</p>
            )}
          </div>
          
          {/* Features */}
          <div className="col-span-1 md:col-span-3 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Features & Traits</h3>
            
            {character.features && character.features.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.features.map((feature, index) => (
                  <div key={index} className="bg-dnd-dark/30 p-3 rounded">
                    {typeof feature === 'string' ? (
                      <p className="text-sm text-dnd-light/90">{feature}</p>
                    ) : (
                      <>
                        <h4 className="font-medieval text-dnd-secondary mb-1">{feature.name}</h4>
                        <p className="text-sm text-dnd-light/90">{feature.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dnd-light/70 italic">No features recorded.</p>
            )}
          </div>
          
          {/* Download button */}
          <div className="col-span-1 md:col-span-3 flex justify-center mt-4">
            <CharacterSheetPDF character={character} />
          </div>
        </motion.div>
      )}
      
      {activeTab === 'details' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Physical Characteristics</h3>
            
            <div className="space-y-3">
              {character.age && (
                <div className="flex justify-between">
                  <span className="text-dnd-light/70">Age:</span>
                  <span className="font-medieval text-dnd-light">{character.age}</span>
                </div>
              )}
              
              {character.height && (
                <div className="flex justify-between">
                  <span className="text-dnd-light/70">Height:</span>
                  <span className="font-medieval text-dnd-light">{character.height}</span>
                </div>
              )}
              
              {character.weight && (
                <div className="flex justify-between">
                  <span className="text-dnd-light/70">Weight:</span>
                  <span className="font-medieval text-dnd-light">{character.weight}</span>
                </div>
              )}
              
              {character.eyes && (
                <div className="flex justify-between">
                  <span className="text-dnd-light/70">Eyes:</span>
                  <span className="font-medieval text-dnd-light">{character.eyes}</span>
                </div>
              )}
              
              {character.skin && (
                <div className="flex justify-between">
                  <span className="text-dnd-light/70">Skin:</span>
                  <span className="font-medieval text-dnd-light">{character.skin}</span>
                </div>
              )}
              
              {character.hair && (
                <div className="flex justify-between">
                  <span className="text-dnd-light/70">Hair:</span>
                  <span className="font-medieval text-dnd-light">{character.hair}</span>
                </div>
              )}
              
              {character.gender && (
                <div className="flex justify-between">
                  <span className="text-dnd-light/70">Gender:</span>
                  <span className="font-medieval text-dnd-light">{character.gender}</span>
                </div>
              )}
            </div>
            
            {!character.age && !character.height && !character.weight && 
              !character.eyes && !character.skin && !character.hair && (
              <p className="text-dnd-light/70 italic">Physical details not specified.</p>
            )}
          </div>
          
          <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Proficiencies & Languages</h3>
            
            <div className="space-y-4">
              {character.proficiencies && character.proficiencies.length > 0 && (
                <div>
                  <h4 className="font-medieval text-dnd-secondary mb-2">Proficiencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.proficiencies.map((prof, index) => (
                      <span 
                        key={index} 
                        className="bg-dnd-dark/40 px-2 py-1 rounded text-sm text-dnd-light/90"
                      >
                        {prof}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {character.languages && character.languages.length > 0 && (
                <div>
                  <h4 className="font-medieval text-dnd-secondary mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.languages.map((lang, index) => (
                      <span 
                        key={index} 
                        className="bg-dnd-dark/40 px-2 py-1 rounded text-sm text-dnd-light/90"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {(!character.proficiencies || character.proficiencies.length === 0) && 
               (!character.languages || character.languages.length === 0) && (
                <p className="text-dnd-light/70 italic">No proficiencies or languages recorded.</p>
              )}
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Backstory</h3>
            
            {character.backstory ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-dnd-light/90 whitespace-pre-line">{character.backstory}</p>
              </div>
            ) : (
              <p className="text-dnd-light/70 italic">No backstory recorded.</p>
            )}
          </div>
        </motion.div>
      )}
      
      {activeTab === 'traits' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6"
        >
          <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Personality</h3>
            
            <div className="space-y-4">
              {character.personalityTraits && (
                <div>
                  <h4 className="font-medieval text-dnd-secondary mb-2">Personality Traits</h4>
                  <p className="text-dnd-light/90 bg-dnd-dark/30 p-3 rounded whitespace-pre-line">
                    {character.personalityTraits}
                  </p>
                </div>
              )}
              
              {character.ideals && (
                <div>
                  <h4 className="font-medieval text-dnd-secondary mb-2">Ideals</h4>
                  <p className="text-dnd-light/90 bg-dnd-dark/30 p-3 rounded whitespace-pre-line">
                    {character.ideals}
                  </p>
                </div>
              )}
              
              {character.bonds && (
                <div>
                  <h4 className="font-medieval text-dnd-secondary mb-2">Bonds</h4>
                  <p className="text-dnd-light/90 bg-dnd-dark/30 p-3 rounded whitespace-pre-line">
                    {character.bonds}
                  </p>
                </div>
              )}
              
              {character.flaws && (
                <div>
                  <h4 className="font-medieval text-dnd-secondary mb-2">Flaws</h4>
                  <p className="text-dnd-light/90 bg-dnd-dark/30 p-3 rounded whitespace-pre-line">
                    {character.flaws}
                  </p>
                </div>
              )}
              
              {!character.personalityTraits && !character.ideals && 
                !character.bonds && !character.flaws && (
                <p className="text-dnd-light/70 italic">No personality traits recorded.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {activeTab === 'spells' && character.spells && character.spells.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6"
        >
          <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <h3 className="heading-fancy text-xl mb-4">Spellbook</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {character.spells.map((spell, index) => (
                <div key={index} className="bg-dnd-dark/30 p-3 rounded">
                  <h4 className="font-medieval text-dnd-secondary mb-1">{spell.name}</h4>
                  <div className="flex gap-2 text-xs text-dnd-light/70 mb-2">
                    <span>{spell.level > 0 ? `Level ${spell.level}` : 'Cantrip'}</span>
                    <span>•</span>
                    <span>{spell.school}</span>
                    {spell.ritual && <span>• Ritual</span>}
                  </div>
                  <p className="text-sm text-dnd-light/90">{spell.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 