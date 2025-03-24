import OpenAI from 'openai';
import { AbilityScores, Character, CharacterAlignment, CharacterClass, CharacterRace, CharacterBackground } from '@/types/character';

// Create a global OpenAI client instance
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo';

export type CharacterPrompt = {
  name?: string;
  race?: CharacterRace;
  class?: CharacterClass;
  level?: number;
  background?: string;
  alignment?: CharacterAlignment;
};

/**
 * Generate character suggestions based on user inputs
 */
export async function generateCharacterSuggestions(prompt: CharacterPrompt): Promise<Partial<Character>> {
  try {
    const promptText = `
      Generate a Dungeons & Dragons 5th Edition character with the following details:
      ${prompt.name ? `Name: ${prompt.name}` : 'Generate a fitting fantasy name'}
      ${prompt.race ? `Race: ${prompt.race}` : 'Choose an appropriate race'}
      ${prompt.class ? `Class: ${prompt.class}` : 'Choose an appropriate class'}
      ${prompt.level ? `Level: ${prompt.level}` : 'Level: 1'}
      ${prompt.background ? `Background: ${prompt.background}` : 'Generate an appropriate background'}
      ${prompt.alignment ? `Alignment: ${prompt.alignment}` : 'Choose an appropriate alignment'}
      
      Please provide:
      1. Basic character details (name, race, class, level, background, alignment)
      2. A set of ability scores (strength, dexterity, constitution, intelligence, wisdom, charisma)
      3. Personality traits, ideals, bonds, and flaws
      4. A brief backstory (2-3 paragraphs)
      5. Physical appearance description
      6. Starting equipment appropriate for the class and background
      7. Proficiencies and languages

      Format the response as a JSON object with the following structure:
      {
        "name": string,
        "race": string,
        "class": string,
        "level": number,
        "background": string,
        "alignment": string,
        "abilityScores": {
          "strength": number,
          "dexterity": number,
          "constitution": number,
          "intelligence": number,
          "wisdom": number,
          "charisma": number
        },
        "personalityTraits": string,
        "ideals": string,
        "bonds": string,
        "flaws": string,
        "backstory": string,
        "appearance": string,
        "equipment": [
          {
            "name": string,
            "category": string,
            "description": string
          }
        ],
        "proficiencies": string[],
        "languages": string[],
        "features": string[]
      }
    `;

    const response = await openaiClient.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a Dungeons & Dragons character creation assistant. You help players create detailed and interesting characters for 5th Edition D&D.' },
        { role: 'user', content: promptText }
      ],
      response_format: { type: 'json_object' },
    });

    const generatedContent = response.choices[0]?.message?.content || '';
    const characterData = JSON.parse(generatedContent);
    
    // Process the character data and convert it to our Character type
    return processCharacterData(characterData);
  } catch (error) {
    console.error('Error generating character suggestions:', error);
    throw new Error('Failed to generate character suggestions');
  }
}

/**
 * Generate a detailed backstory based on character information
 */
export async function generateBackstory(character: Partial<Character>): Promise<string> {
  try {
    const promptText = `
      Generate a detailed backstory for a D&D character with the following details:
      Name: ${character.name}
      Race: ${character.race}
      Class: ${character.class}
      Background: ${character.background}
      Alignment: ${character.alignment}
      Personality Traits: ${character.personalityTraits}
      Ideals: ${character.ideals}
      Bonds: ${character.bonds}
      Flaws: ${character.flaws}

      The backstory should be 3-4 paragraphs long and include:
      - Where they came from
      - Key events that shaped them
      - How they became the class they are
      - Their motivations and goals
      - Interesting hooks that could be used in campaigns
    `;

    const response = await openaiClient.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a creative writer specializing in fantasy character backstories for Dungeons & Dragons.' },
        { role: 'user', content: promptText }
      ],
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating backstory:', error);
    throw new Error('Failed to generate character backstory');
  }
}

/**
 * Define a type for the raw character data from the API
 */
interface RawCharacterData {
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  level?: number;
  background: CharacterBackground;
  alignment: CharacterAlignment;
  abilityScores: AbilityScores;
  equipment?: Array<{name?: string; category?: string; description?: string} | string>;
  [key: string]: any; // Allow for additional properties
}

/**
 * Process and format the character data from the API response
 */
function processCharacterData(data: RawCharacterData): Partial<Character> {
  // Generate a unique ID for the character
  const id = Math.random().toString(36).substring(2, 15);
  
  // Calculate derived stats
  const abilityScores: AbilityScores = data.abilityScores;
  const constitutionModifier = Math.floor((abilityScores.constitution - 10) / 2);
  const dexterityModifier = Math.floor((abilityScores.dexterity - 10) / 2);
  
  // Calculate hit points based on class and constitution modifier
  const baseHitPoints = getBaseHitPoints(data.class);
  const hitPoints = baseHitPoints + constitutionModifier;
  
  // Format equipment array if it's not already in the correct format
  const equipment = Array.isArray(data.equipment)
    ? data.equipment.map((item) => {
        if (typeof item === 'string') {
          return { name: item, category: 'Gear', description: '' };
        } else {
          return {
            name: item.name || '',
            category: item.category || 'Gear',
            description: item.description || ''
          };
        }
      })
    : [];
  
  return {
    id,
    name: data.name,
    race: data.race as CharacterRace,
    class: data.class as CharacterClass,
    level: data.level || 1,
    background: data.background,
    alignment: data.alignment as CharacterAlignment,
    experience: 0, // Start at 0 XP for new characters
    abilityScores,
    hitPoints: {
      maximum: hitPoints,
      current: hitPoints
    },
    armorClass: 10 + dexterityModifier, // Basic AC calculation
    initiative: dexterityModifier,
    speed: getRaceSpeed(data.race), // Base speed by race
    personalityTraits: data.personalityTraits,
    ideals: data.ideals,
    bonds: data.bonds,
    flaws: data.flaws,
    backstory: data.backstory,
    appearance: data.appearance,
    equipment,
    proficiencies: Array.isArray(data.proficiencies) ? data.proficiencies : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    features: Array.isArray(data.features) ? data.features : [],
  };
}

/**
 * Get the base hit points for a class
 */
function getBaseHitPoints(characterClass: CharacterClass): number {
  const hitDice: Record<CharacterClass, number> = {
    'Barbarian': 12,
    'Fighter': 10,
    'Paladin': 10,
    'Ranger': 10,
    'Monk': 8,
    'Rogue': 8,
    'Bard': 8,
    'Cleric': 8,
    'Druid': 8,
    'Warlock': 8,
    'Wizard': 6,
    'Sorcerer': 6
  };

  return hitDice[characterClass] || 8; // Default to 8 if class not found
}

/**
 * Get the base speed for a race
 */
function getRaceSpeed(race: CharacterRace): number {
  const speeds: Record<CharacterRace, number> = {
    'Human': 30,
    'Elf': 30,
    'Half-Elf': 30,
    'Tiefling': 30,
    'Dragonborn': 30,
    'Half-Orc': 30,
    'Dwarf': 25,
    'Halfling': 25,
    'Gnome': 25
  };

  return speeds[race] || 30; // Default to 30 if race not found
} 