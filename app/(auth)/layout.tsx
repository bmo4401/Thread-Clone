import '@/app/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
export const metadata: Metadata = {
   title: 'Threads',
   description: 'A Next.js 13 Meta Threads Application',
   icons: {
      icon: '/icon.ico',
   },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <ClerkProvider>
         <html lang="en">
            <body className={`${inter.className} bg-dark-1`}>
               <div className="w-full min-h-screen flex items-center justify-center">
                  {children}
               </div>
            </body>
         </html>
      </ClerkProvider>
   );
}
