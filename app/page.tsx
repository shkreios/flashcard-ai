import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/db"
import { decks } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function Home() {
  // For simplicity, we're using a fixed user ID
  // In a real app, you would get this from authentication
  const userId = 1

  // Get the most recent decks
  const recentDecks = await db.query.decks.findMany({
    where: (deck, { eq }) => eq(deck.userId, userId),
    orderBy: [desc(decks.createdAt)],
    limit: 5,
    with: {
      flashcards: true,
    },
  })

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Flashcard Generator</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
            <p className="mb-4 text-muted-foreground">
              Upload a PDF document to automatically generate flashcards using AI.
            </p>
            <Button asChild>
              <Link href="/upload">Upload PDF</Link>
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Decks</h2>
            {recentDecks.length > 0 ? (
              <ul className="space-y-2">
                {recentDecks.map((deck) => (
                  <li key={deck.id} className="border rounded-md p-4">
                    <Link href={`/decks/${deck.id}`} className="block hover:underline">
                      <span className="font-medium">{deck.title}</span>
                      <span className="text-sm text-muted-foreground block">{deck.flashcards.length} flashcards</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No decks yet. Upload a PDF to get started.</p>
            )}

            <Button variant="outline" className="mt-4" asChild>
              <Link href="/decks">View All Decks</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

