import './globals.css'
import { Inter } from 'next/font/google'
// import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Analytics/>
        {children}
        <Toaster />
        {/* <Providers>{children}</Providers> */}

      </body>
    </html>
    </ClerkProvider>
  )
}