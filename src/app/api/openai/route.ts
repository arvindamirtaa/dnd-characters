import { NextRequest, NextResponse } from 'next/server';
import { generateCharacterSuggestions, generateBackstory, CharacterPrompt } from '@/lib/openai';
import { Character } from '@/types/character';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    switch (action) {
      case 'generateCharacter':
        const characterPrompt = data as CharacterPrompt;
        const character = await generateCharacterSuggestions(characterPrompt);
        return NextResponse.json({ character });

      case 'generateBackstory':
        const characterData = data as Partial<Character>;
        const backstory = await generateBackstory(characterData);
        return NextResponse.json({ backstory });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 