'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterAlignment, CharacterBackground } from '@/types/character';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Background descriptions
const BACKGROUNDS = [
  {
    id: 'Acolyte',
    description: `You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world.`
  },
  {
    id: 'Charlatan',
    description: `You have always had a way with people. You know what makes them tick, you can tease out their desires after a few minutes of conversation, and with a few leading questions you can read them like they were children's books.`
  },
  {
    id: 'Criminal',
    description: `You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld.`
  },
  {
    id: 'Entertainer',
    description: `You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics can stir the hearts of those who hear you, awakening grief or joy, laughter or anger.`
  },
  {
    id: 'Folk Hero',
    description: `You come from a humble social rank, but you are destined for so much more. The people of your home village regard you as their champion, and your destiny calls you to stand against tyrants and monsters.`
  },
  {
    id: 'Guild Artisan',
    description: `You are a member of an artisan's guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world, freed by talent and wealth from the constraints of a feudal social order.`
  },
  {
    id: 'Hermit',
    description: `You lived in seclusion for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for.`
  },
  {
    id: 'Noble',
    description: `You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.`
  },
  {
    id: 'Outlander',
    description: `You grew up in the wilds, far from civilization and the comforts of town and technology. The wilds are in your blood, whether you were a nomad, an explorer, a recluse, a hunter-gatherer, or even a marauder.`
  },
  {
    id: 'Sage',
    description: `You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you.`
  },
  {
    id: 'Sailor',
    description: `You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottomless depths.`
  },
  {
    id: 'Soldier',
    description: `War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield.`
  },
  {
    id: 'Urchin',
    description: `You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for your needs, so you learned to provide for yourself.`
  }
];

// Alignment descriptions
const ALIGNMENTS = {
  'Lawful Good': `A lawful good character combines a commitment to oppose evil with the discipline to fight relentlessly. They tell the truth, keep their word, help those in need, and speak out against injustice.`,
  'Neutral Good': `A neutral good character does the best that a good person can do. They are devoted to helping others. They work with kings and magistrates but do not feel beholden to them.`,
  'Chaotic Good': `A chaotic good character acts as their conscience directs, with little regard for what others expect. They make their own way, but they're kind and benevolent. They believe in goodness and right but have little use for laws and regulations.`,
  'Lawful Neutral': `A lawful neutral character acts in accordance with law, tradition, or personal codes. Order and organization are paramount. They may believe in personal order and live by a code or standard, or they may believe in order for all and favor a strong, organized government.`,
  'True Neutral': `A true neutral character does what seems to be a good idea. They don't feel strongly one way or the other when it comes to good vs. evil or law vs. chaos. Most neutrality is a lack of conviction or bias rather than a commitment to neutrality.`,
  'Chaotic Neutral': `A chaotic neutral character follows their whims. They are an individualist first and last. They value their own liberty but don't strive to protect others' freedom. They avoid authority, resent restrictions, and challenge traditions.`,
  'Lawful Evil': `A lawful evil character methodically takes what they want within the limits of a code of tradition, loyalty, or order. They care about tradition, loyalty, and order but not about freedom, dignity, or life.`,
  'Neutral Evil': `A neutral evil character does whatever they can get away with. They are out for themselves, pure and simple. They shed no tears for those they kill, whether for profit, sport, or convenience.`,
  'Chaotic Evil': `A chaotic evil character does whatever their greed, hatred, and lust for destruction drive them to do. They are hot-tempered, vicious, arbitrarily violent, and unpredictable.`
};

type BackgroundSelectorProps = {
  background: CharacterBackground | string;
  alignment: CharacterAlignment;
  onUpdateBackground: (background: CharacterBackground) => void;
  onUpdateAlignment: (alignment: CharacterAlignment) => void;
};

export default function BackgroundSelector({ 
  background, 
  alignment, 
  onUpdateBackground, 
  onUpdateAlignment 
}: BackgroundSelectorProps) {
  const [selectedBackground, setSelectedBackground] = useState<string>(background || 'Soldier');
  const [selectedAlignment, setSelectedAlignment] = useState<CharacterAlignment>(alignment || 'True Neutral');
  
  // Handle background selection
  const handleBackgroundSelect = (bgId: string) => {
    setSelectedBackground(bgId);
    onUpdateBackground(bgId as CharacterBackground);
  };
  
  // Handle alignment selection
  const handleAlignmentSelect = (algn: CharacterAlignment) => {
    setSelectedAlignment(algn);
    onUpdateAlignment(algn);
  };
  
  // Get the selected background description
  const getBackgroundDescription = () => {
    const bg = BACKGROUNDS.find(b => b.id === selectedBackground);
    return bg ? bg.description : '';
  };
  
  // All alignment options as a grid
  const alignmentGrid = [
    ['Lawful Good', 'Neutral Good', 'Chaotic Good'],
    ['Lawful Neutral', 'True Neutral', 'Chaotic Neutral'],
    ['Lawful Evil', 'Neutral Evil', 'Chaotic Evil']
  ];
  
  return (
    <div>
      <h2 className="heading-fancy text-3xl mb-6 text-center">Choose Background & Alignment</h2>
      
      {/* Background Selection */}
      <div className="mb-8">
        <h3 className="heading-fancy text-2xl mb-4">Background</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Background list */}
          <div className="col-span-1 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  className={`w-full text-left p-2 rounded transition-all flex items-center ${
                    selectedBackground === bg.id
                      ? 'bg-dnd-primary text-white'
                      : 'bg-dnd-dark hover:bg-dnd-primary/40'
                  }`}
                  onClick={() => handleBackgroundSelect(bg.id)}
                >
                  <span className="flex-grow font-medieval">{bg.id}</span>
                  {selectedBackground === bg.id && (
                    <FontAwesomeIcon icon={faCheck} className="text-dnd-secondary" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Background description */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              key={selectedBackground}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50 h-full"
            >
              <h3 className="heading-fancy text-xl mb-2">{selectedBackground}</h3>
              <p className="text-dnd-light/90">{getBackgroundDescription()}</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Alignment Selection */}
      <div className="mt-10">
        <h3 className="heading-fancy text-2xl mb-4">Alignment</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alignment grid */}
          <div className="col-span-1 bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
            <div className="grid grid-cols-3 gap-2">
              {alignmentGrid.map((row, rowIndex) => (
                row.map((algn, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={`p-2 rounded transition-all text-center ${
                      selectedAlignment === algn
                        ? 'bg-dnd-primary text-white'
                        : 'bg-dnd-dark hover:bg-dnd-primary/40'
                    }`}
                    onClick={() => handleAlignmentSelect(algn as CharacterAlignment)}
                  >
                    <span className="text-xs font-medieval">{algn}</span>
                  </button>
                ))
              ))}
            </div>
          </div>
          
          {/* Alignment description */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              key={selectedAlignment}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50 h-full"
            >
              <h3 className="heading-fancy text-xl mb-2">{selectedAlignment}</h3>
              <p className="text-dnd-light/90">{ALIGNMENTS[selectedAlignment]}</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-dnd-light/70 italic mt-6">
        <p>Your background and alignment help define your character&apos;s motivations, ethics, and place in the world.</p>
      </div>
    </div>
  );
}