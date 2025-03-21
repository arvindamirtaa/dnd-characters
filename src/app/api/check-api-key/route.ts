import { NextResponse } from 'next/server';

export async function GET() {
  // Check if the OpenAI API key is set
  const isSet = !!process.env.OPENAI_API_KEY;

  return NextResponse.json({ isSet });
} 