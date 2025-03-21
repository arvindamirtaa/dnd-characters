import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Cinzel } from 'next/font/google';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-medieval',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'D&D Character Wizard',
  description: 'Create amazing Dungeons & Dragons 5th Edition characters with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-dnd-dark text-dnd-light min-h-screen flex flex-col`}>
        <header className="border-b border-dnd-secondary/30 bg-dnd-dark/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 hover:text-dnd-secondary transition">
              <FontAwesomeIcon icon={faDiceD20} className="text-dnd-primary text-2xl" />
              <span className="font-medieval text-xl hidden sm:inline">D&D Character Wizard</span>
              <span className="font-medieval text-xl sm:hidden">D&D Wizard</span>
            </Link>
            
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link href="/" className="hover:text-dnd-secondary transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/wizard" className="hover:text-dnd-secondary transition">
                    Create Character
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="flex-grow bg-dnd-dark bg-[url('/images/parchment-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {children}
        </main>
        
        <footer className="bg-dnd-dark/95 border-t border-dnd-secondary/30 py-4 text-center text-sm text-dnd-light/60">
          <div className="container mx-auto px-4">
            <p>
              D&D Character Wizard - Created with Next.js, TailwindCSS, and OpenAI
            </p>
            <p className="mt-2">
              Dungeons & Dragons is a trademark of Wizards of the Coast. This app is not affiliated with or endorsed by Wizards of the Coast.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
