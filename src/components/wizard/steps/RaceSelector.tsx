'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterRace } from '@/types/character';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Race descriptions
const RACE_DESCRIPTIONS = {
  'Human': `Humans are the most adaptable and ambitious people among the common races. They have widely varying tastes, morals, and customs in the many different lands where they have settled.`,
  'Elf': `Elves are a magical people of otherworldly grace, living in the world but not entirely part of it. They love nature and magic, art and artistry, music and poetry.`,
  'Dwarf': `Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal. They can live to be more than 400 years old, so the oldest living dwarves often remember a very different world.`,
  'Halfling': `The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense. They appear harmless and so have managed to survive for centuries in the shadow of empires.`,
  'Gnome': `A gnome's energy and enthusiasm for living shines through every inch of his or her tiny body. Gnomes average slightly over 3 feet tall and weigh 40 to 45 pounds.`,
  'Half-Elf': `Half-elves combine what some say are the best qualities of their elf and human parents: human curiosity, inventiveness, and ambition tempered by the refined senses, love of nature, and artistic tastes of the elves.`,
  'Half-Orc': `Some half-orcs rise to become proud chiefs of orc tribes, their human blood giving them an edge over their full-blooded orc rivals. Some venture into the world to prove their worth. Many half-orcs hear the call of Gruumsh and become feared warriors.`,
  'Tiefling': `To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling. Their appearance and their nature are not their fault but the result of an ancient sin.`,
  'Dragonborn': `Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension. Shaped by draconic gods or the dragons themselves, dragonborn originally hatched from dragon eggs.`
};

// Race images (placeholder URLs - commented out as not currently used)
/*
const RACE_IMAGES = {
  'Human': '/images/races/human.jpg',
  'Elf': '/images/races/elf.jpg',
  'Dwarf': '/images/races/dwarf.jpg',
  'Halfling': '/images/races/halfling.jpg',
  'Gnome': '/images/races/gnome.jpg',
  'Half-Elf': '/images/races/half-elf.jpg',
  'Half-Orc': '/images/races/half-orc.jpg',
  'Tiefling': '/images/races/tiefling.jpg',
  'Dragonborn': '/images/races/dragonborn.jpg'
};
*/

// Race traits
const RACE_TRAITS = {
  'Human': ['+1 to All Ability Scores', 'Extra Language', 'Adaptable'],
  'Elf': ['+2 Dexterity', 'Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance'],
  'Dwarf': ['+2 Constitution', 'Darkvision', 'Dwarven Resilience', 'Stonecunning'],
  'Halfling': ['+2 Dexterity', 'Lucky', 'Brave', 'Halfling Nimbleness'],
  'Gnome': ['+2 Intelligence', 'Darkvision', 'Gnome Cunning'],
  'Half-Elf': ['+2 Charisma, +1 to Two Others', 'Darkvision', 'Fey Ancestry', 'Skill Versatility'],
  'Half-Orc': ['+2 Strength, +1 Constitution', 'Darkvision', 'Relentless Endurance', 'Savage Attacks'],
  'Tiefling': ['+2 Charisma, +1 Intelligence', 'Darkvision', 'Hellish Resistance', 'Infernal Legacy'],
  'Dragonborn': ['+2 Strength, +1 Charisma', 'Draconic Ancestry', 'Breath Weapon', 'Damage Resistance']
};

type RaceSelectorProps = {
  selectedRace: CharacterRace;
  onSelectRace: (race: CharacterRace) => void;
};

export default function RaceSelector({ selectedRace, onSelectRace }: RaceSelectorProps) {
  const [hoverRace, setHoverRace] = useState<CharacterRace | null>(null);
  
  const races: CharacterRace[] = [
    'Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 
    'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn'
  ];
  
  const displayRace = hoverRace || selectedRace;
  
  return (
    <div>
      <h2 className="heading-fancy text-3xl mb-6 text-center">Choose Your Race</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Race selection */}
        <div className="col-span-1 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
          <h3 className="heading-fancy text-xl mb-4">Available Races</h3>
          <div className="space-y-2">
            {races.map((race) => (
              <button
                key={race}
                className={`w-full text-left p-2 rounded transition-all flex items-center ${
                  selectedRace === race
                    ? 'bg-dnd-primary text-white'
                    : 'bg-dnd-dark hover:bg-dnd-primary/40'
                }`}
                onClick={() => onSelectRace(race)}
                onMouseEnter={() => setHoverRace(race)}
                onMouseLeave={() => setHoverRace(null)}
              >
                <span className="flex-grow font-medieval">{race}</span>
                {selectedRace === race && (
                  <FontAwesomeIcon icon={faCheck} className="text-dnd-secondary" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Race details */}
        <div className="col-span-1 md:col-span-2">
          <motion.div
            key={displayRace}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50 h-full"
          >
            <h3 className="heading-fancy text-2xl mb-2">{displayRace}</h3>
            <p className="mb-4 text-dnd-light/90">{RACE_DESCRIPTIONS[displayRace]}</p>
            
            <h4 className="heading-fancy text-lg mb-2">Racial Traits</h4>
            <ul className="list-disc pl-5 mb-4 text-dnd-light/90">
              {RACE_TRAITS[displayRace].map((trait, index) => (
                <li key={index}>{trait}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      
      <div className="text-center text-dnd-light/70 italic">
        <p>Your race determines your character&apos;s fundamental qualities, including base traits and natural aptitudes.</p>
      </div>
    </div>
  );
}