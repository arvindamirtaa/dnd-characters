'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faRandom } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Character } from '@/types/character';

type EquipmentSelectorProps = {
  character: Character;
  onUpdateCharacter: (updates: Partial<Character>) => void;
};

// Equipment categories with example items
const EQUIPMENT_CATEGORIES = {
  weapons: [
    'Dagger', 'Shortsword', 'Longsword', 'Greatsword', 'Rapier',
    'Battleaxe', 'Greataxe', 'Warhammer', 'Maul', 'Quarterstaff',
    'Shortbow', 'Longbow', 'Light Crossbow', 'Heavy Crossbow', 'Hand Crossbow'
  ],
  armor: [
    'Leather Armor', 'Studded Leather', 'Hide Armor', 'Chain Shirt',
    'Scale Mail', 'Breastplate', 'Half Plate', 'Ring Mail',
    'Chain Mail', 'Splint', 'Plate'
  ],
  gear: [
    'Backpack', 'Bedroll', 'Mess Kit', 'Tinderbox', 'Torch',
    'Rations (1 day)', 'Waterskin', 'Rope (50 ft)', 'Climber\'s Kit',
    'Healer\'s Kit', 'Explorer\'s Pack', 'Burglar\'s Pack', 'Diplomat\'s Pack'
  ],
  magical: [
    'Potion of Healing', 'Scroll of Identify', 'Bag of Holding',
    'Cloak of Protection', 'Ring of Warmth', 'Boots of Elvenkind',
    'Wand of Magic Detection', 'Gloves of Swimming and Climbing'
  ]
};

export default function EquipmentSelector({
  character,
  onUpdateCharacter
}: EquipmentSelectorProps) {
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EQUIPMENT_CATEGORIES>('weapons');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  // Initialize equipment if it doesn't exist
  if (!character.equipment) {
    onUpdateCharacter({ equipment: [] });
  }

  const addItem = (item: string) => {
    if (!item.trim()) return;
    
    const updatedEquipment = [...(character.equipment || []), item];
    onUpdateCharacter({ equipment: updatedEquipment });
    setNewItemName('');
    setShowSuggestions(false);
  };

  const removeItem = (index: number) => {
    const updatedEquipment = [...(character.equipment || [])];
    updatedEquipment.splice(index, 1);
    onUpdateCharacter({ equipment: updatedEquipment });
  };

  const addRandomEquipment = () => {
    // Generate some random equipment based on character class
    let newEquipment: string[] = [...(character.equipment || [])];
    
    // Add a random weapon
    const weaponIndex = Math.floor(Math.random() * EQUIPMENT_CATEGORIES.weapons.length);
    newEquipment.push(EQUIPMENT_CATEGORIES.weapons[weaponIndex]);
    
    // Add a random armor
    const armorIndex = Math.floor(Math.random() * EQUIPMENT_CATEGORIES.armor.length);
    newEquipment.push(EQUIPMENT_CATEGORIES.armor[armorIndex]);
    
    // Add 2-4 random gear items
    const gearCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < gearCount; i++) {
      const gearIndex = Math.floor(Math.random() * EQUIPMENT_CATEGORIES.gear.length);
      newEquipment.push(EQUIPMENT_CATEGORIES.gear[gearIndex]);
    }
    
    // Maybe add a magical item (20% chance)
    if (Math.random() < 0.2) {
      const magicalIndex = Math.floor(Math.random() * EQUIPMENT_CATEGORIES.magical.length);
      newEquipment.push(EQUIPMENT_CATEGORIES.magical[magicalIndex]);
    }
    
    // Remove duplicates
    newEquipment = [...new Set(newEquipment)];
    
    onUpdateCharacter({ equipment: newEquipment });
  };

  const suggestions = EQUIPMENT_CATEGORIES[selectedCategory].filter(item => 
    item.toLowerCase().includes(newItemName.toLowerCase())
  );

  return (
    <div>
      <h2 className="heading-fancy text-3xl mb-6 text-center">Equipment</h2>
      
      <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50 mb-6">
        <p className="text-dnd-light/90 mb-4">
          Add weapons, armor, and gear to your character. Equipment defines what your
          character can do in combat and what tools they have available for adventure.
        </p>
        
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="btn-secondary flex items-center gap-2"
            onClick={addRandomEquipment}
          >
            <FontAwesomeIcon icon={faRandom} />
            Random Equipment
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
          <h3 className="heading-fancy text-xl mb-4">Add Equipment</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(EQUIPMENT_CATEGORIES) as Array<keyof typeof EQUIPMENT_CATEGORIES>).map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded text-sm capitalize ${selectedCategory === category ? 'bg-dnd-primary text-white' : 'bg-dnd-dark/70 text-dnd-light/70'}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowSuggestions(true);
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => {
                  setNewItemName(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter item name or select from suggestions"
                className="input-field flex-grow"
              />
              <button
                type="button"
                className="btn-primary"
                onClick={() => addItem(newItemName)}
                disabled={!newItemName.trim()}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-dnd-dark border border-dnd-secondary/50 rounded-lg max-h-60 overflow-y-auto">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 cursor-pointer hover:bg-dnd-secondary/20 border-b border-dnd-secondary/10 last:border-b-0"
                    onClick={() => addItem(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-dnd-dark/60 rounded-lg p-4 border-2 border-dnd-secondary/50">
          <h3 className="heading-fancy text-xl mb-4">Current Equipment</h3>
          
          {character.equipment && character.equipment.length > 0 ? (
            <ul className="space-y-2">
              {character.equipment.map((item, index) => (
                <motion.li
                  key={index}
                  className={`flex justify-between items-center py-2 px-3 rounded ${isHovered === index ? 'bg-dnd-dark/80' : 'bg-dnd-dark/40'}`}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-dnd-light">{item}</span>
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-600"
                    onClick={() => removeItem(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-dnd-light/70 italic text-center py-4">
              No equipment added yet. Add some items above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 