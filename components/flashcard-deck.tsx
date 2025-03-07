"use client"

import { useState } from "react"
import type { FlashcardType } from "@/lib/schemas"
import { Flashcard } from "@/components/flashcard"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface FlashcardDeckProps {
  flashcards: FlashcardType[]
  title: string
}

export function FlashcardDeck({ flashcards, title }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [studiedCards, setStudiedCards] = useState<Record<number, boolean>>({})

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const markAsStudied = () => {
    setStudiedCards({
      ...studiedCards,
      [currentIndex]: true,
    })
    handleNext()
  }

  const progress = (Object.keys(studiedCards).length / flashcards.length) * 100

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {flashcards.length > 0 ? (
        <Flashcard flashcard={flashcards[currentIndex]} onNext={handleNext} onPrevious={handlePrevious} />
      ) : (
        <div className="text-center p-8 border rounded-lg">No flashcards available</div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button onClick={markAsStudied} variant="default">
          Mark as Studied
        </Button>

        <Button variant="outline" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

