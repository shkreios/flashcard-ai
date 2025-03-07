import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/db"
import { decks } from "@/db/schema"
import { desc } from "drizzle-orm"
import { FileUp } from "lucide-react"

export default async function DecksPage() {
  // For simplicity, we're using a fixed user ID
  // In a real app, you would get this from authentication
  const userId = 1

  // Get all decks for the user
  const userDecks = await db.query.decks.findMany({
    where: (deck, { eq }) => eq(deck.userId, userId),
    orderBy: [desc(decks.createdAt)],
    with: {
      flashcards: true,
    },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Flashcard Decks</h1>
          <Button asChild>
            <Link href="/upload">
              <FileUp className="mr-2 h-4 w-4" />
              Upload PDF
            </Link>
          </Button>
        </div>

        {userDecks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userDecks.map((deck) => (
              <Link key={deck.id} href={`/decks/${deck.id}`} className="block">
                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <h2 className="font-semibold text-lg mb-1">{deck.title}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{deck.flashcards.length} flashcards</p>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="mb-4 text-muted-foreground">You don't have any flashcard decks yet.</p>
            <Button asChild>
              <Link href="/upload">Upload PDF to Create Flashcards</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

