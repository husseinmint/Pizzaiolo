import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DirectionProvider } from '@/lib/contexts/direction-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["arabic", "latin"],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'Pizzailo Mate - Recipe Manager',
  description: 'Personal recipe manager and shopping lists',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${ibmPlexSansArabic.variable}`}>
        <DirectionProvider>
          {children}
          <Analytics />
        </DirectionProvider>
      </body>
    </html>
  )
}
