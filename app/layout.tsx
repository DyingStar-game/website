import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dying Star - MMO Narratif Persistant',
  description: 'Survivez à l\'exil interstellaire dans un MMO narratif persistant où chaque choix façonne votre destin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
