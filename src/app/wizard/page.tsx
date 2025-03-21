'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CharacterWizard from '@/components/wizard/CharacterWizard';

export default function WizardPage() {
  const router = useRouter();
  const [apiKeySet, setApiKeySet] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if OpenAI API key is set
    const apiKey = process.env.OPENAI_API_KEY;
    setApiKeySet(!!apiKey);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="wizard-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="heading-fancy text-2xl mb-4">Preparing your adventure...</h2>
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="h-12 w-12 bg-dnd-secondary/50 rounded-full"></div>
            <div className="h-12 w-12 bg-dnd-primary/50 rounded-full"></div>
            <div className="h-12 w-12 bg-dnd-secondary/50 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (apiKeySet === false) {
    return (
      <div className="wizard-container">
        <div className="bg-dnd-primary/20 border-2 border-dnd-primary p-6 rounded-lg text-center">
          <h2 className="heading-fancy text-2xl mb-4">API Key Required</h2>
          <p className="mb-4">
            To use the D&D Character Wizard, you need to set up your OpenAI API key.
            Please add your API key to the .env.local file:
          </p>
          <div className="bg-dnd-dark p-4 rounded-md text-left font-mono text-sm mb-6">
            <code>OPENAI_API_KEY=your_api_key_here</code>
          </div>
          <p className="text-sm">
            Don't have an API key? You can get one from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dnd-secondary underline"
            >
              OpenAI's platform
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      <CharacterWizard />
    </div>
  );
} 