'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceD20, faWandSparkles, faScroll, faUser, faRightLong, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function HomePage() {
  const [apiKeySet, setApiKeySet] = useState<boolean | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  
  useEffect(() => {
    // Check if the OpenAI API key is set
    const checkApiKey = async () => {
      try {
        const response = await fetch('/api/check-api-key');
        const data = await response.json();
        setApiKeySet(data.isSet);
      } catch (error) {
        console.error('Error checking API key:', error);
        setApiKeySet(false);
      }
    };
    
    checkApiKey();
  }, []);
  
  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <FontAwesomeIcon 
          icon={faDiceD20} 
          className="text-dnd-secondary text-7xl mb-6 animate-pulse" 
        />
        <h1 className="heading-fancy text-5xl mb-4">D&D Character Wizard</h1>
        <p className="text-dnd-light/90 text-xl mb-8">
          Create amazing Dungeons & Dragons 5th Edition characters with ease, 
          powered by artificial intelligence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            className="bg-dnd-dark/60 rounded-lg p-6 border-2 border-dnd-secondary/50"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faWandSparkles} className="text-dnd-secondary text-3xl mb-4" />
            <h2 className="heading-fancy text-xl mb-2">AI-Powered</h2>
            <p className="text-dnd-light/80">
              Create fully-formed characters with detailed backstories and personalities
              using OpenAI technology.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-dnd-dark/60 rounded-lg p-6 border-2 border-dnd-secondary/50"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faUser} className="text-dnd-secondary text-3xl mb-4" />
            <h2 className="heading-fancy text-xl mb-2">Customizable</h2>
            <p className="text-dnd-light/80">
              Fine-tune every aspect of your character or quickly generate complete
              characters with a few clicks.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-dnd-dark/60 rounded-lg p-6 border-2 border-dnd-secondary/50"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faScroll} className="text-dnd-secondary text-3xl mb-4" />
            <h2 className="heading-fancy text-xl mb-2">Printable Sheets</h2>
            <p className="text-dnd-light/80">
              Export your characters as beautiful PDF character sheets ready
              for your next adventure.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="mb-8"
        >
          <Link 
            href="/wizard" 
            className="btn-primary px-8 py-4 text-xl inline-flex items-center gap-3"
          >
            Start Creating
            <FontAwesomeIcon icon={faRightLong} />
          </Link>
        </motion.div>
        
        {apiKeySet === false && (
          <div className="notification notification-warning mt-6 text-left">
            <div className="flex gap-2">
              <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
              <div>
                <p className="font-bold mb-1">OpenAI API Key Required</p>
                <p className="mb-2">
                  You need to add your OpenAI API key to use the AI features of this app.
                  Create an <code>.env.local</code> file in the root directory with the following:
                </p>
                <pre className="bg-black/30 p-2 rounded mb-2">OPENAI_API_KEY=your-api-key</pre>
                <p>
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-dnd-secondary underline"
                  >
                    Get your API key from OpenAI
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-4 text-center text-dnd-light/60 text-sm"
      >
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="hover:text-dnd-secondary"
        >
          About this App
        </button>
        
        {showInfo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-dnd-dark rounded-lg border-2 border-dnd-secondary p-6 max-w-2xl w-full">
              <h3 className="heading-fancy text-2xl mb-4">About D&D Character Wizard</h3>
              
              <div className="prose prose-invert max-w-none mb-6">
                <p>
                  D&D Character Wizard is an open-source project that combines the 
                  creativity of AI with the beloved character creation process from 
                  Dungeons & Dragons 5th Edition.
                </p>
                <p>
                  This application was built with Next.js, TypeScript, Tailwind CSS, 
                  and the OpenAI API. It demonstrates how AI can be used to enhance 
                  creative tasks and make character creation more accessible.
                </p>
                <p>
                  The character generation follows the official D&D 5e rules while
                  providing creative backstories and personalities that would
                  traditionally take more time to develop.
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowInfo(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
