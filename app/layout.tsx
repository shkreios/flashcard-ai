import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flashcard Generator",
  description: "Generate flashcards from PDF documents using AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto py-4 px-4">
              <nav className="flex items-center justify-between">
                <a href="/" className="text-xl font-bold">
                  Flashcard Generator
                </a>
                <div className="flex gap-4">
                  <a href="/decks" className="hover:underline">
                    Decks
                  </a>
                  <a href="/upload" className="hover:underline">
                    Upload
                  </a>
                </div>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-4">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Flashcard Generator
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'