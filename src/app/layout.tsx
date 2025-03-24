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
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-dnd-dark text-dnd-light h-full flex flex-col overflow-hidden`}>
        <header className="border-b border-dnd-secondary/30 bg-dnd-dark/90 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0 h-14 md:h-16">
          <div className="container mx-auto px-2 sm:px-4 h-full flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:text-dnd-secondary transition">
              <FontAwesomeIcon icon={faDiceD20} className="text-dnd-primary text-xl sm:text-2xl" />
              <span className="font-medieval text-lg sm:text-xl hidden xs:inline">D&D Character Wizard</span>
              <span className="font-medieval text-lg xs:hidden">D&D</span>
            </Link>
            
            <nav>
              <ul className="flex gap-3 sm:gap-6 text-sm sm:text-base">
                <li>
                  <Link href="/" className="hover:text-dnd-secondary transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/wizard" className="hover:text-dnd-secondary transition">
                    <span className="hidden xs:inline">Create Character</span>
                    <span className="xs:hidden">Create</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="flex-grow bg-dnd-dark bg-[url('/images/parchment-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat overflow-hidden flex items-center justify-center">
          <div className="h-full w-full py-0.5 sm:py-1">
            {children}
          </div>
        </main>
        
        <footer className="bg-dnd-dark/95 border-t border-dnd-secondary/30 text-center text-xs sm:text-sm text-dnd-light/60 flex-shrink-0 h-12 md:h-14">
          <div className="container mx-auto px-2 sm:px-4 h-full flex flex-col justify-center">
            <p>
              D&D Character Wizard - Created with Next.js, TailwindCSS, and OpenAI
            </p>
            <p className="mt-1 sm:mt-2 hidden xs:block">
              Dungeons & Dragons is a trademark of Wizards of the Coast. This app is not affiliated with or endorsed by Wizards of the Coast.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
