'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterClass } from '@/types/character';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUserShield, faSkull, faHatWizard, faPrayingHands, faDrumstickBite, faLeaf, faFistRaised, faHammer, faBullseye, faGem, faWandSparkles, faBook, faScroll } from '@fortawesome/free-solid-svg-icons';

// Class descriptions
const CLASS_DESCRIPTIONS = {
  'Barbarian': `A fierce warrior who can enter a battle rage, the barbarian is a master of combat who uses primal instincts and raw fury to overcome enemies.`,
  'Bard': `A performer whose music and tales inspire allies and demoralize foes. Bards are versatile masters of many skills with a touch of magic about them.`,
  'Cleric': `A priestly champion who wields divine magic in service of a higher power. Clerics are capable healers and protectors as well as powerful magic users.`,
  'Druid': `A priest of the Old Faith, wielding the powers of nature and adopting animal forms. Druids revere nature and can cast potent spells.`,
  'Fighter': `A master of martial combat, skilled with a variety of weapons and armor. Fighters are resilient warriors who can specialize in numerous fighting styles.`,
  'Monk': `A master of martial arts, harnessing the power of body and soul. Monks are skilled warriors who don't rely on equipment to be effective.`,
  'Paladin': `A holy warrior bound to a sacred oath. Paladins combine martial prowess with divine magic to protect the innocent and smite evil.`,
  'Ranger': `A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization. Rangers are skilled hunters and trackers.`,
  'Rogue': `A scoundrel who uses stealth and trickery to overcome obstacles. Rogues are highly skilled and precise, able to disarm traps and open locks.`,
  'Sorcerer': `A spellcaster who draws on inherent magic from a gift or bloodline. Sorcerers cast spells through innate power rather than years of study.`,
  'Warlock': `A wielder of magic derived from a bargain with an extraplanar entity. Warlocks tap into eldritch power and are capable of devastating magical attacks.`,
  'Wizard': `A scholarly magic-user capable of manipulating the structures of reality. Wizards rely on years of study and ancient knowledge to cast powerful spells.`
};

// Class primary abilities
const CLASS_ABILITIES = {
  'Barbarian': ['Strength', 'Constitution'],
  'Bard': ['Charisma', 'Dexterity'],
  'Cleric': ['Wisdom', 'Strength or Dexterity'],
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

// Class armor and weapon proficiencies
const CLASS_PROFICIENCIES = {
  'Barbarian': ['Light and medium armor', 'Shields', 'Simple and martial weapons'],
  'Bard': ['Light armor', 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', 'Musical instruments'],
  'Cleric': ['Light and medium armor', 'Shields', 'Simple weapons'],
  'Druid': ['Light and medium armor (nonmetal)', 'Shields (nonmetal)', 'Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears'],
  'Fighter': ['All armor', 'Shields', 'Simple and martial weapons'],
  'Monk': ['Simple weapons, shortswords', 'No armor or shields'],
  'Paladin': ['All armor', 'Shields', 'Simple and martial weapons'],
  'Ranger': ['Light and medium armor', 'Shields', 'Simple and martial weapons'],
  'Rogue': ['Light armor', 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', `Thieves' tools`],
  'Sorcerer': ['Daggers, darts, slings, quarterstaffs, light crossbows', 'No armor or shields'],
  'Warlock': ['Light armor', 'Simple weapons'],
  'Wizard': ['Daggers, darts, slings, quarterstaffs, light crossbows', 'No armor or shields']
};

// Class icons
const CLASS_ICONS = {
  'Barbarian': <FontAwesomeIcon icon={faSkull} />,
  'Bard': <FontAwesomeIcon icon={faScroll} />,
  'Cleric': <FontAwesomeIcon icon={faPrayingHands} />,
  'Druid': <FontAwesomeIcon icon={faLeaf} />,
  'Fighter': <FontAwesomeIcon icon={faHammer} />,
  'Monk': <FontAwesomeIcon icon={faFistRaised} />,
  'Paladin': <FontAwesomeIcon icon={faUserShield} />,
  'Ranger': <FontAwesomeIcon icon={faBullseye} />,
  'Rogue': <FontAwesomeIcon icon={faGem} />,
  'Sorcerer': <FontAwesomeIcon icon={faWandSparkles} />,
  'Warlock': <FontAwesomeIcon icon={faDrumstickBite} />,
  'Wizard': <FontAwesomeIcon icon={faHatWizard} />
};

type ClassSelectorProps = {
  selectedClass: CharacterClass;
  onSelectClass: (characterClass: CharacterClass) => void;
};

export default function ClassSelector({ selectedClass, onSelectClass }: ClassSelectorProps) {
  const [hoverClass, setHoverClass] = useState<CharacterClass | null>(null);
  
  const classes: CharacterClass[] = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 
    'Fighter', 'Monk', 'Paladin', 'Ranger', 
    'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
  ];
  
  const displayClass = hoverClass || selectedClass;
  
  return (
    <div>
      <h2 className="heading-fancy text-3xl mb-6 text-center">Choose Your Class</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Class selection */}
        <div className="col-span-1 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
          <h3 className="heading-fancy text-xl mb-4">Available Classes</h3>
          <div className="grid grid-cols-2 gap-2">
            {classes.map((characterClass) => (
              <button
                key={characterClass}
                className={`text-left p-2 rounded transition-all flex items-center ${
                  selectedClass === characterClass
                    ? 'bg-dnd-primary text-white'
                    : 'bg-dnd-dark hover:bg-dnd-primary/40'
                }`}
                onClick={() => onSelectClass(characterClass)}
                onMouseEnter={() => setHoverClass(characterClass)}
                onMouseLeave={() => setHoverClass(null)}
              >
                <span className="mr-2 text-dnd-secondary">{CLASS_ICONS[characterClass]}</span>
                <span className="flex-grow font-medieval text-sm">{characterClass}</span>
                {selectedClass === characterClass && (
                  <FontAwesomeIcon icon={faCheck} className="text-dnd-secondary" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Class details */}
        <div className="col-span-1 md:col-span-2">
          <motion.div
            key={displayClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50 h-full"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl text-dnd-secondary mr-3">{CLASS_ICONS[displayClass]}</span>
              <h3 className="heading-fancy text-2xl">{displayClass}</h3>
            </div>
            
            <p className="mb-4 text-dnd-light/90">{CLASS_DESCRIPTIONS[displayClass]}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="heading-fancy text-lg mb-2">Primary Abilities</h4>
                <ul className="list-disc pl-5 mb-4 text-dnd-light/90">
                  {CLASS_ABILITIES[displayClass].map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="heading-fancy text-lg mb-2">Proficiencies</h4>
                <ul className="list-disc pl-5 text-dnd-light/90">
                  {CLASS_PROFICIENCIES[displayClass].map((prof, index) => (
                    <li key={index}>{prof}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="text-center text-dnd-light/70 italic">
        <p>Your class shapes your character's capabilities, determining how you approach combat, problem-solving, and social interactions.</p>
      </div>
    </div>
  );
}