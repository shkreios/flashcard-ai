"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, FolderPlus, Home, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadPdfButton } from "@/components/upload-pdf-button"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const recentDecks = [
    { id: 1, title: "Biology 101", cards: 42, lastStudied: "2 days ago", progress: 65 },
    { id: 2, title: "Chemistry Fundamentals", cards: 36, lastStudied: "1 day ago", progress: 78 },
    { id: 3, title: "Physics Mechanics", cards: 28, lastStudied: "3 days ago", progress: 45 },
  ]

  const allDecks = [
    ...recentDecks,
    { id: 4, title: "Computer Science Basics", cards: 56, lastStudied: "1 week ago", progress: 30 },
    { id: 5, title: "Mathematics: Calculus", cards: 48, lastStudied: "5 days ago", progress: 52 },
  ]

  const filteredDecks = allDecks.filter((deck) => deck.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>FlashLearn AI</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search decks..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex flex-col gap-2">
              <UploadPdfButton />
              <Button variant="outline" className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create Deck Manually
              </Button>
              <Button variant="outline" className="justify-start">
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Tabs defaultValue="recent">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="all">All Decks</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="recent" className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {recentDecks.map((deck) => (
                  <FlashcardDeck key={deck.id} deck={deck} />
                ))}
              </TabsContent>
              <TabsContent value="all" className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {filteredDecks.map((deck) => (
                  <FlashcardDeck key={deck.id} deck={deck} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

function FlashcardDeck({ deck }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{deck.title}</CardTitle>
        <CardDescription>{deck.cards} cards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${deck.progress}%` }} />
          </div>
          <span className="text-sm font-medium">{deck.progress}%</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Last studied: {deck.lastStudied}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/edit/${deck.id}`}>Edit</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/study/${deck.id}`}>Study</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

