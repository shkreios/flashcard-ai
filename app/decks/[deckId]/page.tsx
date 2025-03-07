import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FlashcardDeck } from "@/components/flashcard-deck"
import { db } from "@/db"
import { ArrowLeft } from "lucide-react"

interface DeckPageProps {
  params: {
    deckId: string
  }
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { deckId } = params

  // Get the deck and its flashcards
  const deck = await db.query.decks.findFirst({
    where: (deck, { eq }) => eq(deck.id, deckId),
    with: {
      flashcards: true,
    },
  })

  if (!deck) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/decks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Decks
            </Link>
          </Button>

          <h1 className="text-3xl font-bold">{deck.title}</h1>
          {deck.description && <p className="text-muted-foreground mt-2">{deck.description}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            {deck.flashcards.length} flashcards • Created {new Date(deck.createdAt).toLocaleDateString()}
          </p>
        </div>

        <FlashcardDeck flashcards={deck.flashcards} title={deck.title} />
      </div>
    </div>
  )
}

