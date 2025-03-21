// Character types for D&D character creation

// Character races
export type CharacterRace = 
  | 'Human'
  | 'Elf'
  | 'Dwarf'
  | 'Halfling'
  | 'Gnome'
  | 'Half-Elf'
  | 'Half-Orc'
  | 'Tiefling'
  | 'Dragonborn';

// Character classes
export type CharacterClass =
  | 'Barbarian'
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Fighter'
  | 'Monk'
  | 'Paladin'
  | 'Ranger'
  | 'Rogue'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard';

// Character backgrounds
export type CharacterBackground =
  | 'Acolyte'
  | 'Charlatan'
  | 'Criminal'
  | 'Entertainer'
  | 'Folk Hero'
  | 'Guild Artisan'
  | 'Hermit'
  | 'Noble'
  | 'Outlander'
  | 'Sage'
  | 'Sailor'
  | 'Soldier'
  | 'Urchin';

// Character alignments
export type CharacterAlignment =
  | 'Lawful Good'
  | 'Neutral Good'
  | 'Chaotic Good'
  | 'Lawful Neutral'
  | 'True Neutral'
  | 'Chaotic Neutral'
  | 'Lawful Evil'
  | 'Neutral Evil'
  | 'Chaotic Evil';

// Ability scores
export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// Equipment item
export interface Equipment {
  name: string;
  description?: string;
  type?: 'weapon' | 'armor' | 'gear' | 'magical';
  quantity?: number;
}

// Character feature or trait
export interface Feature {
  name: string;
  description: string;
  source?: 'race' | 'class' | 'background' | 'other';
}

// Spell
export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  ritual?: boolean;
}

// Main character interface
export interface Character {
  // Basic info
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  level: number;
  background: CharacterBackground;
  alignment: CharacterAlignment;
  
  // Physical characteristics
  age?: number;
  height?: string;
  weight?: string;
  eyes?: string;
  hair?: string;
  skin?: string;
  gender?: string;
  
  // Ability scores
  abilityScores: AbilityScores;
  
  // Combat stats
  armorClass?: number;
  hitPoints?: number;
  hitDice?: number;
  speed?: number;
  
  // Character details
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  backstory?: string;
  
  // Equipment and features
  equipment?: Equipment[];
  features?: Feature[];
  proficiencies?: string[];
  languages?: string[];
  spells?: Spell[];
  
  // Misc
  experiencePoints?: number;
} 