'use client';

import jsPDF from 'jspdf';
import { Character, AbilityScores } from '@/types/character';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload } from '@fortawesome/free-solid-svg-icons';

// Default ability scores
const DEFAULT_ABILITY_SCORES: AbilityScores = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
};

type CharacterSheetPDFProps = {
  character: Partial<Character>;
  className?: string;
};
const CharacterSheetPDF = ({ character, className = '' }: CharacterSheetPDFProps) => {
  const generatePDF = () => {
    // Ensure all required properties have default values
    const safeCharacter = {
      name: character.name || 'Unnamed Character',
      race: character.race || 'Unknown Race',
      class: character.class || 'Unknown Class',
      level: character.level || 1,
      background: character.background || 'Unknown Background',
      alignment: character.alignment || 'True Neutral',
      experiencePoints: character.experiencePoints || 0,
      abilityScores: character.abilityScores || DEFAULT_ABILITY_SCORES,
      hitPoints: character.hitPoints || 10,
      armorClass: character.armorClass || 10,
      speed: character.speed || 30,
      features: character.features || [],
      backstory: character.backstory || 'No backstory provided.',
      ...character
    };
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set font size and styles
    doc.setFont('Times', 'Roman');
    
    // Add header
    doc.setFontSize(24);
    doc.setTextColor('#7b1f18'); // dnd-primary
    doc.text('D&D CHARACTER SHEET', 105, 15, { align: 'center' });
    
    // Add character name
    doc.setFontSize(20);
    doc.setTextColor('#161618'); // dnd-dark
    doc.text(`${safeCharacter.name}`, 105, 25, { align: 'center' });
    
    // Add basic info
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    
    // Draw border around the page
    doc.setDrawColor('#d4a54a'); // dnd-secondary
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    
    // Character basic info section
    doc.setFillColor('#f2e8d4'); // dnd-light
    doc.roundedRect(15, 30, 180, 50, 3, 3, 'F');
    doc.setDrawColor('#7b1f18'); // dnd-primary
    doc.roundedRect(15, 30, 180, 50, 3, 3, 'S');
    
    doc.setFontSize(10);
    doc.setTextColor('#161618'); // dnd-dark
    
    // Column 1: Race, Alignment
    doc.text('Race:', 20, 40);
    doc.setFontSize(12);
    doc.text(safeCharacter.race, 50, 40);
    
    doc.setFontSize(10);
    doc.text('Alignment:', 20, 50);
    doc.setFontSize(12);
    doc.text(safeCharacter.alignment, 50, 50);
    
    // Column 2: Class, Level, Background
    doc.setFontSize(10);
    doc.text('Class:', 100, 40);
    doc.setFontSize(12);
    doc.text(safeCharacter.class, 130, 40);
    
    doc.setFontSize(10);
    doc.text('Level:', 100, 50);
    doc.setFontSize(12);
    doc.text(safeCharacter.level.toString(), 130, 50);
    
    doc.setFontSize(10);
    doc.text('Background:', 100, 60);
    doc.setFontSize(12);
    doc.text(safeCharacter.background, 130, 60);
    
    // Experience & Hit Points
    doc.setFontSize(10);
    doc.text('Experience:', 20, 70);
    doc.setFontSize(12);
    doc.text(safeCharacter.experiencePoints.toString(), 50, 70);
    
    doc.setFontSize(10);
    doc.text('Hit Points:', 100, 70);
    doc.setFontSize(12);
    doc.text(typeof safeCharacter.hitPoints === 'object'
      ? `${safeCharacter.hitPoints.current}/${safeCharacter.hitPoints.maximum}`
      : safeCharacter.hitPoints.toString(), 130, 70);
    
    // Ability Scores section
    doc.setFillColor('#f2e8d4'); // dnd-light
    doc.roundedRect(15, 85, 50, 120, 3, 3, 'F');
    doc.setDrawColor('#7b1f18'); // dnd-primary
    doc.roundedRect(15, 85, 50, 120, 3, 3, 'S');
    
    doc.setFontSize(14);
    doc.setTextColor('#7b1f18'); // dnd-primary
    doc.text('ABILITY SCORES', 40, 95, { align: 'center' });
    
    // Calculate ability modifiers
    const getModifier = (score: number) => Math.floor((score - 10) / 2);
    
    // Draw ability scores
    const abilities = [
      { name: 'Strength', value: safeCharacter.abilityScores.strength },
      { name: 'Dexterity', value: safeCharacter.abilityScores.dexterity },
      { name: 'Constitution', value: safeCharacter.abilityScores.constitution },
      { name: 'Intelligence', value: safeCharacter.abilityScores.intelligence },
      { name: 'Wisdom', value: safeCharacter.abilityScores.wisdom },
      { name: 'Charisma', value: safeCharacter.abilityScores.charisma },
    ];
    
    let yPos = 110;
    abilities.forEach(ability => {
      // Ability name
      doc.setFontSize(10);
      doc.setTextColor('#161618'); // dnd-dark
      doc.text(ability.name, 20, yPos);
      
      // Ability score
      doc.setFontSize(14);
      doc.text(ability.value.toString(), 45, yPos);
      
      // Ability modifier
      doc.setFontSize(12);
      const modifier = getModifier(ability.value);
      doc.text(`(${modifier >= 0 ? '+' : ''}${modifier})`, 55, yPos);
      
      yPos += 15;
    });
    
    // Combat Stats section
    doc.setFillColor('#f2e8d4'); // dnd-light
    doc.roundedRect(70, 85, 125, 50, 3, 3, 'F');
    doc.setDrawColor('#7b1f18'); // dnd-primary
    doc.roundedRect(70, 85, 125, 50, 3, 3, 'S');
    
    doc.setFontSize(14);
    doc.setTextColor('#7b1f18'); // dnd-primary
    doc.text('COMBAT STATS', 132.5, 95, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor('#161618'); // dnd-dark
    doc.text('Armor Class:', 75, 110);
    doc.setFontSize(12);
    doc.text(safeCharacter.armorClass.toString(), 100, 110);
    
    doc.setFontSize(10);
    doc.text('Initiative:', 120, 110);
    doc.setFontSize(12);
    const initiative = getModifier(safeCharacter.abilityScores.dexterity);
    doc.text(initiative >= 0 ? `+${initiative}` : initiative.toString(), 145, 110);
    
    doc.setFontSize(10);
    doc.text('Speed:', 75, 125);
    doc.setFontSize(12);
    doc.text(`${safeCharacter.speed} ft.`, 100, 125);
    
    // Character features section
    doc.setFillColor('#f2e8d4'); // dnd-light
    doc.roundedRect(70, 140, 125, 65, 3, 3, 'F');
    doc.setDrawColor('#7b1f18'); // dnd-primary
    doc.roundedRect(70, 140, 125, 65, 3, 3, 'S');
    
    doc.setFontSize(14);
    doc.setTextColor('#7b1f18'); // dnd-primary
    doc.text('FEATURES & TRAITS', 132.5, 150, { align: 'center' });
    
    // List features
    doc.setFontSize(10);
    doc.setTextColor('#161618'); // dnd-dark
    
    yPos = 160;
    if (safeCharacter.features && safeCharacter.features.length > 0) {
      safeCharacter.features.slice(0, 8).forEach(feature => {
        const featureName = typeof feature === 'string' ? feature : feature.name;
        doc.text(`• ${featureName}`, 75, yPos);
        yPos += 7;
      });
    }
    
    // Backstory section
    doc.setFillColor('#f2e8d4'); // dnd-light
    doc.roundedRect(15, 210, 180, 67, 3, 3, 'F');
    doc.setDrawColor('#7b1f18'); // dnd-primary
    doc.roundedRect(15, 210, 180, 67, 3, 3, 'S');
    
    doc.setFontSize(14);
    doc.setTextColor('#7b1f18'); // dnd-primary
    doc.text('PERSONALITY & BACKSTORY', 105, 220, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor('#161618'); // dnd-dark
    
    // Split backstory into shorter lines if it exists
    if (safeCharacter.backstory) {
      const maxWidth = 170;
      const splitBackstory = doc.splitTextToSize(safeCharacter.backstory, maxWidth);
      
      // Only show first 12 lines to fit on page
      const maxLines = 12;
      const limitedBackstory = splitBackstory.slice(0, maxLines);
      
      // Print the backstory
      doc.text(limitedBackstory, 20, 230);
    } else {
      // If no backstory, print a placeholder
      doc.text("No backstory provided.", 20, 230);
    }
    
    // Save the PDF
    doc.save(`${safeCharacter.name.replace(/\s+/g, '_')}_character_sheet.pdf`);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={generatePDF}
        className="btn-secondary flex items-center gap-2 py-3 px-6"
      >
        <FontAwesomeIcon icon={faFilePdf} />
        <span>Download Character Sheet</span>
        <FontAwesomeIcon icon={faDownload} />
      </button>
      <p className="text-sm text-dnd-light/70 mt-2">
        Generates a printable PDF with your character details
      </p>
    </div>
  );
};

export default CharacterSheetPDF; 