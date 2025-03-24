'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faRandom, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Character, CharacterRace, CharacterClass, CharacterAlignment, AbilityScores } from '@/types/character';
import DiceRoller from '@/components/dice/DiceRoller';
import CharacterSheetPDF from '@/components/character-sheet/CharacterSheetPDF';
import RaceSelector from './steps/RaceSelector';
import ClassSelector from './steps/ClassSelector';
import AbilityScoresSelector from './steps/AbilityScoresSelector';
import BackgroundSelector from './steps/BackgroundSelector';
import DetailsForm from './steps/DetailsForm';
import EquipmentSelector from './steps/EquipmentSelector';
import CharacterReview from './steps/CharacterReview';

// Define a type for the character generation prompt
type CharacterGenerationPrompt = {
  name?: string;
  race?: string;
  class?: string;
  level?: number;
  background?: string;
  alignment?: string;
};

// Default ability scores
const DEFAULT_ABILITY_SCORES: AbilityScores = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
};

// Default character template
const DEFAULT_CHARACTER: Partial<Character> = {
  id: '',
  name: '',
  race: 'Human',
  class: 'Fighter',
  level: 1,
  background: 'Soldier',
  alignment: 'True Neutral',
  experience: 0,
  abilityScores: DEFAULT_ABILITY_SCORES,
  hitPoints: {
    maximum: 10,
    current: 10
  },
  armorClass: 10,
  initiative: 0,
  speed: 30,
  skills: [],
  equipment: [],
  features: [],
  proficiencies: [],
  languages: [],
  personalityTraits: '',
  ideals: '',
  bonds: '',
  flaws: '',
  backstory: '',
  appearance: ''
};

// Wizard steps
enum WizardStep {
  Race = 0,
  Class = 1,
  AbilityScores = 2,
  Background = 3,
  Details = 4,
  Equipment = 5,
  Review = 6,
  Complete = 7
}

export default function CharacterWizard() {
  const [character, setCharacter] = useState<Partial<Character>>(DEFAULT_CHARACTER);
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.Race);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to update character properties
  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  // Function to generate a character using AI
  const generateCharacter = async (prompt: CharacterGenerationPrompt = {}) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateCharacter',
          data: {
            name: character.name || prompt.name,
            race: character.race || prompt.race,
            class: character.class || prompt.class,
            level: character.level || prompt.level || 1,
            background: character.background || prompt.background,
            alignment: character.alignment || prompt.alignment
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setCharacter(prevChar => ({
        ...prevChar,
        ...data.character
      }));
      
      // Move to the review step
      setCurrentStep(WizardStep.Review);
    } catch (err: unknown) {
      console.error('Error generating character:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate character. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate a more detailed backstory for the character
  const generateBackstory = async () => {
    if (!character.name) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateBackstory',
          data: character
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setCharacter(prevChar => ({
        ...prevChar,
        backstory: data.backstory
      }));
    } catch (err: unknown) {
      console.error('Error generating backstory:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate backstory. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to go to next step
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, WizardStep.Complete));
  };

  // Function to go to previous step
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, WizardStep.Race));
  };

  // Get step content based on current step
  const getStepContent = () => {
    switch (currentStep) {
      case WizardStep.Race:
        return (
          <RaceSelector
            selectedRace={character.race as CharacterRace}
            onSelectRace={(race) => updateCharacter({ race })}
          />
        );
      case WizardStep.Class:
        return (
          <ClassSelector
            selectedClass={character.class as CharacterClass}
            onSelectClass={(characterClass) => updateCharacter({ class: characterClass })}
          />
        );
      case WizardStep.AbilityScores:
        return (
          <AbilityScoresSelector
            abilityScores={character.abilityScores || DEFAULT_ABILITY_SCORES}
            onUpdateScores={(abilityScores) => updateCharacter({ abilityScores })}
            characterClass={character.class as CharacterClass}
          />
        );
      case WizardStep.Background:
        return (
          <BackgroundSelector
            background={character.background || ''}
            alignment={character.alignment as CharacterAlignment}
            onUpdateBackground={(background) => updateCharacter({ background })}
            onUpdateAlignment={(alignment) => updateCharacter({ alignment })}
          />
        );
      case WizardStep.Details:
        return (
          <DetailsForm
            character={character}
            onUpdateCharacter={updateCharacter}
            onGenerateBackstory={generateBackstory}
            isGenerating={isGenerating}
          />
        );
      case WizardStep.Equipment:
        return (
          <EquipmentSelector
            equipment={(character.equipment || []).map(item => typeof item === 'string' ? item : item.name)}
            characterClass={character.class as CharacterClass}
            onUpdateEquipment={(equipmentNames) => {
              // Convert string array to Equipment array
              const equipment = equipmentNames.map(name => ({ name }));
              updateCharacter({ equipment });
            }}
          />
        );
      case WizardStep.Review:
        return (
          <CharacterReview
            character={character}
            onUpdateCharacter={updateCharacter}
          />
        );
      case WizardStep.Complete:
        return (
          <div className="text-center">
            <h2 className="heading-fancy text-3xl mb-6">Character Complete!</h2>
            <p className="text-lg mb-8">
              Congratulations! Your character is ready for adventure.
              You can now download your character sheet as a PDF.
            </p>
            
            <CharacterSheetPDF 
              character={character} 
              className="mb-8"
            />
            
            <div className="mt-8">
              <button 
                onClick={() => {
                  setCharacter(DEFAULT_CHARACTER);
                  setCurrentStep(WizardStep.Race);
                }}
                className="btn-secondary"
              >
                Create Another Character
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Calculate step progress percentage
  const progressPercentage = ((currentStep) / (WizardStep.Complete)) * 100;

  return (
    <div className="wizard-container flex flex-col">
      {/* Top section with progress bar */}
      {currentStep < WizardStep.Complete && (
        <div className="flex-shrink-0 mb-2">
          <div className="h-2 bg-dnd-dark rounded-full mb-1">
            <div
              className="h-full bg-dnd-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="hidden md:flex justify-between text-xs text-dnd-light/70 font-medieval">
            <span>Start</span>
            <span>Race</span>
            <span>Class</span>
            <span>Abilities</span>
            <span>Background</span>
            <span>Details</span>
            <span>Equipment</span>
            <span>Review</span>
          </div>
          <div className="flex md:hidden justify-between text-xs text-dnd-light/70 font-medieval">
            <span>Start</span>
            <span className={currentStep >= WizardStep.Class ? "text-dnd-secondary" : ""}>Mid</span>
            <span className={currentStep >= WizardStep.Review ? "text-dnd-secondary" : ""}>End</span>
          </div>
        </div>
      )}
      
      {/* Main content area with side panel for dice roller */}
      <div className="flex-grow flex gap-2 overflow-hidden">
        {/* Main content */}
        <div className="flex-grow overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {getStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Side panel with dice roller */}
        {currentStep !== WizardStep.Complete && (
          <div className="hidden lg:block w-64 flex-shrink-0 overflow-auto">
            <DiceRoller className="sticky top-0" />
            
            {/* Quick generate button */}
            {currentStep === WizardStep.Race && (
              <div className="mt-2 border-t border-dnd-secondary/30 pt-2">
                <p className="mb-2 text-xs text-dnd-light/70">
                  Want a character right away?
                </p>
                <button
                  onClick={() => generateCharacter()}
                  disabled={isGenerating}
                  className="btn-secondary flex items-center gap-1 w-full text-xs px-2 py-1"
                >
                  {isGenerating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faRandom} />
                      <span>Generate Character</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom section with navigation and error messages */}
      <div className="flex-shrink-0 mt-2">
        {/* Error message */}
        {error && (
          <div className="bg-dnd-danger/20 border border-dnd-danger p-2 rounded-md mb-2 text-xs">
            <p className="text-dnd-light">{error}</p>
          </div>
        )}
        
        {/* Navigation and quick generate for mobile */}
        <div className="flex items-center justify-between">
          {/* Navigation buttons */}
          {currentStep < WizardStep.Complete && (
            <div className="flex gap-2">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === WizardStep.Race}
                className={`btn-secondary flex items-center gap-1 px-2 py-1 text-xs ${
                  currentStep === WizardStep.Race ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="hidden xs:inline">Previous</span>
              </button>
              
              {currentStep === WizardStep.Review ? (
                <button
                  onClick={() => setCurrentStep(WizardStep.Complete)}
                  className="btn-primary flex items-center gap-1 px-2 py-1 text-xs"
                >
                  <span>Complete</span>
                  <FontAwesomeIcon icon={faSave} />
                </button>
              ) : (
                <button
                  onClick={goToNextStep}
                  className="btn-primary flex items-center gap-1 px-2 py-1 text-xs"
                >
                  <span className="hidden xs:inline">Next</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          )}
          
          {/* Quick generate button for mobile */}
          {currentStep === WizardStep.Race && (
            <div className="lg:hidden">
              <button
                onClick={() => generateCharacter()}
                disabled={isGenerating}
                className="btn-secondary flex items-center gap-1 text-xs px-2 py-1"
              >
                {isGenerating ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span className="hidden xs:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRandom} />
                    <span className="hidden xs:inline">Generate Character</span>
                    <span className="xs:hidden">Generate</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}