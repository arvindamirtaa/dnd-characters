import { NextResponse } from 'next/server';
import { OpenAIApi } from '@/lib/openai';
import { Character } from '@/types/character';

export async function POST(request: Request) {
  try {
    const { character } = await request.json();
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    if (!character) {
      return NextResponse.json(
        { error: 'Character data is required' },
        { status: 400 }
      );
    }
    
    // Create a prompt for the AI to generate a backstory
    const prompt = createBackstoryPrompt(character);
    
    // Call the OpenAI API
    const openai = new OpenAIApi();
    const response = await openai.createCompletion({
      model: 'gpt-4',
      temperature: 0.8,
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are a creative and engaging Dungeons & Dragons storyteller. 
          You craft compelling character backstories that fit the character's race, class, 
          and other attributes while conforming to D&D lore and worldbuilding.`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    if (!response.choices[0]?.message?.content) {
      return NextResponse.json(
        { error: 'Failed to generate backstory' },
        { status: 500 }
      );
    }
    
    const backstory = response.choices[0].message.content.trim();
    
    return NextResponse.json({ backstory });
  } catch (error) {
    console.error('Error generating backstory:', error);
    return NextResponse.json(
      { error: 'Failed to generate backstory' },
      { status: 500 }
    );
  }
}

// Create a prompt for the AI to generate a backstory
function createBackstoryPrompt(character: Character): string {
  let prompt = `Create a compelling and detailed backstory for a D&D character with the following attributes:

- Name: ${character.name}
- Race: ${character.race}
- Class: ${character.class}
- Background: ${character.background}
- Alignment: ${character.alignment}
`;

  if (character.personalityTraits) {
    prompt += `- Personality Traits: ${character.personalityTraits}\n`;
  }
  
  if (character.ideals) {
    prompt += `- Ideals: ${character.ideals}\n`;
  }
  
  if (character.bonds) {
    prompt += `- Bonds: ${character.bonds}\n`;
  }
  
  if (character.flaws) {
    prompt += `- Flaws: ${character.flaws}\n`;
  }
  
  prompt += `
The backstory should:
1. Explain how the character became a ${character.class}
2. Include key events and relationships that shaped the character
3. Provide motivation for why the character is adventuring
4. Connect to the character's background as a ${character.background}
5. Be consistent with the character's alignment (${character.alignment})
6. Be about 3-4 paragraphs in length
7. Have an engaging narrative style
8. Include some interesting hooks that could be developed in a campaign

The backstory should read like a compelling short story that gives insight into who this character is and why they've chosen their path. Mix personal tragedy, triumph, and formative relationships. Include specific place names and potential antagonists or allies from their past.`;

  return prompt;
} 