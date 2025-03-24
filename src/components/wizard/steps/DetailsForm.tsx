'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faMagic } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Character, CharacterAlignment } from '@/types/character';

type DetailsFormProps = {
  character: Partial<Character>;
  onUpdateCharacter: (updates: Partial<Character>) => void;
  onGenerateBackstory: () => Promise<void>;
  isGenerating: boolean;
};

export default function DetailsForm({ 
  character,
  onUpdateCharacter,
  onGenerateBackstory,
  isGenerating
}: DetailsFormProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'traits' | 'backstory'>('appearance');
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onUpdateCharacter({ [name]: value });
  };
  
  const generateRandomName = () => {
    const maleFirstNames = [
      'Aragorn', 'Boromir', 'Gandalf', 'Gimli', 'Legolas', 'Frodo', 
      'Thorin', 'Bilbo', 'Elrond', 'Thranduil', 'Bard', 'Faramir',
      'Denethor', 'Theoden', 'Eomer', 'Beorn', 'Radagast', 'Balin',
      'Dwalin', 'Fili', 'Kili', 'Oin', 'Gloin', 'Dori', 'Nori', 'Ori'
    ];
    
    const femaleFirstNames = [
      'Galadriel', 'Arwen', 'Eowyn', 'Tauriel', 'Goldberry', 'Rosie',
      'Lobelia', 'Belladonna', 'Primula', 'Dis', 'Gilraen', 'Idril',
      'Luthien', 'Melian', 'Finduilas', 'Morwen', 'Haleth', 'Aredhel',
      'Elanor', 'Ruby', 'Daisy', 'Marigold', 'Esmeralda', 'Pearl'
    ];
    
    const lastNames = [
      'Baggins', 'Took', 'Brandybuck', 'Gamgee', 'Sackville', 'Proudfoot',
      'Oakenshield', 'Ironfoot', 'Stonehelm', 'Hammerhand', 'Stormcrow',
      'Shadowfax', 'Lightfoot', 'Hornblower', 'Goldworthy', 'Longbeard',
      'Greenleaf', 'Silvertongue', 'Fireforge', 'Stormborn', 'Darkwood',
      'Frostbeard', 'Swiftarrow', 'Stoutheart', 'Wildhammer', 'Brightblade'
    ];
    
    // Use the race to influence naming patterns
    let firstName = '';
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    if (Math.random() > 0.5) {
      firstName = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
    } else {
      firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    }
    
    onUpdateCharacter({ name: `${firstName} ${lastName}` });
  };
  
  const alignmentOptions: { value: CharacterAlignment; label: string }[] = [
    { value: 'Lawful Good', label: 'Lawful Good' },
    { value: 'Neutral Good', label: 'Neutral Good' },
    { value: 'Chaotic Good', label: 'Chaotic Good' },
    { value: 'Lawful Neutral', label: 'Lawful Neutral' },
    { value: 'True Neutral', label: 'True Neutral' },
    { value: 'Chaotic Neutral', label: 'Chaotic Neutral' },
    { value: 'Lawful Evil', label: 'Lawful Evil' },
    { value: 'Neutral Evil', label: 'Neutral Evil' },
    { value: 'Chaotic Evil', label: 'Chaotic Evil' }
  ];
  
  return (
    <div>
      <h2 className="heading-fancy text-3xl mb-6 text-center">Character Details</h2>
      
      <div className="tabs mb-6 flex justify-center border-b border-dnd-secondary/30">
        <button
          className={`px-4 py-2 font-medieval ${activeTab === 'appearance' ? 'text-dnd-secondary border-b-2 border-dnd-secondary' : 'text-dnd-light/70'}`}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance
        </button>
        <button
          className={`px-4 py-2 font-medieval ${activeTab === 'traits' ? 'text-dnd-secondary border-b-2 border-dnd-secondary' : 'text-dnd-light/70'}`}
          onClick={() => setActiveTab('traits')}
        >
          Traits & Ideals
        </button>
        <button
          className={`px-4 py-2 font-medieval ${activeTab === 'backstory' ? 'text-dnd-secondary border-b-2 border-dnd-secondary' : 'text-dnd-light/70'}`}
          onClick={() => setActiveTab('backstory')}
        >
          Backstory
        </button>
      </div>
      
      {activeTab === 'appearance' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="form-group">
            <label htmlFor="name" className="block text-dnd-light mb-2 font-medieval">
              Character Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="name"
                name="name"
                value={character.name || ''}
                onChange={handleInputChange}
                placeholder="Enter character name"
                className="input-field flex-grow"
              />
              <button
                type="button"
                className="btn-icon"
                onClick={generateRandomName}
                title="Generate random name"
              >
                <FontAwesomeIcon icon={faSync} />
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="age" className="block text-dnd-light mb-2 font-medieval">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={character.age || ''}
              onChange={handleInputChange}
              placeholder="Enter age"
              className="input-field"
              min="1"
              max="1000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="height" className="block text-dnd-light mb-2 font-medieval">
              Height
            </label>
            <input
              type="text"
              id="height"
              name="height"
              value={character.height || ''}
              onChange={handleInputChange}
              placeholder="e.g. 5 feet 10 inches"
              className="input-field"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="weight" className="block text-dnd-light mb-2 font-medieval">
              Weight
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={character.weight || ''}
              onChange={handleInputChange}
              placeholder="e.g. 180 lbs"
              className="input-field"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="eyes" className="block text-dnd-light mb-2 font-medieval">
              Eye Color
            </label>
            <input
              type="text"
              id="eyes"
              name="eyes"
              value={character.eyes || ''}
              onChange={handleInputChange}
              placeholder="e.g. Blue"
              className="input-field"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hair" className="block text-dnd-light mb-2 font-medieval">
              Hair
            </label>
            <input
              type="text"
              id="hair"
              name="hair"
              value={character.hair || ''}
              onChange={handleInputChange}
              placeholder="e.g. Long brown"
              className="input-field"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="skin" className="block text-dnd-light mb-2 font-medieval">
              Skin
            </label>
            <input
              type="text"
              id="skin"
              name="skin"
              value={character.skin || ''}
              onChange={handleInputChange}
              placeholder="e.g. Tanned"
              className="input-field"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender" className="block text-dnd-light mb-2 font-medieval">
              Gender
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={character.gender || ''}
              onChange={handleInputChange}
              placeholder="Enter gender"
              className="input-field"
            />
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
          <div className="form-group">
            <label htmlFor="alignment" className="block text-dnd-light mb-2 font-medieval">
              Alignment
            </label>
            <select
              id="alignment"
              name="alignment"
              value={character.alignment || ''}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select alignment</option>
              {alignmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="personality" className="block text-dnd-light mb-2 font-medieval">
              Personality Traits
            </label>
            <textarea
              id="personality"
              name="personalityTraits"
              value={character.personalityTraits || ''}
              onChange={handleInputChange}
              placeholder="Describe your character's personality traits"
              className="input-field"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ideals" className="block text-dnd-light mb-2 font-medieval">
              Ideals
            </label>
            <textarea
              id="ideals"
              name="ideals"
              value={character.ideals || ''}
              onChange={handleInputChange}
              placeholder="What ideals drive your character?"
              className="input-field"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bonds" className="block text-dnd-light mb-2 font-medieval">
              Bonds
            </label>
            <textarea
              id="bonds"
              name="bonds"
              value={character.bonds || ''}
              onChange={handleInputChange}
              placeholder="What connections does your character have?"
              className="input-field"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="flaws" className="block text-dnd-light mb-2 font-medieval">
              Flaws
            </label>
            <textarea
              id="flaws"
              name="flaws"
              value={character.flaws || ''}
              onChange={handleInputChange}
              placeholder="What are your character's shortcomings?"
              className="input-field"
              rows={3}
            />
          </div>
        </motion.div>
      )}
      
      {activeTab === 'backstory' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6"
        >
          <div className="flex justify-end mb-4">
            <button
              type="button"
              className={`btn-primary flex items-center gap-2 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={onGenerateBackstory}
              disabled={isGenerating}
            >
              <FontAwesomeIcon icon={faMagic} />
              {isGenerating ? 'Generating...' : 'Generate Backstory'}
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="backstory" className="block text-dnd-light mb-2 font-medieval">
              Character Backstory
            </label>
            <textarea
              id="backstory"
              name="backstory"
              value={character.backstory || ''}
              onChange={handleInputChange}
              placeholder="Describe your character's backstory"
              className="input-field h-80"
              rows={12}
            />
          </div>
          
          <p className="text-dnd-light/70 italic text-sm">
            Your backstory helps define who your character is, where they came from, and what motivates them on their adventure.
          </p>
        </motion.div>
      )}
    </div>
  );
}