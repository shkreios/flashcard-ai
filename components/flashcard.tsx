"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FlashcardType } from "@/lib/schemas"

interface FlashcardProps {
  flashcard: FlashcardType
  onNext?: () => void
  onPrevious?: () => void
  showNavigation?: boolean
}

export function Flashcard({ flashcard, onNext, onPrevious, showNavigation = true }: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const handleNext = () => {
    setShowAnswer(false)
    if (onNext) onNext()
  }

  const handlePrevious = () => {
    setShowAnswer(false)
    if (onPrevious) onPrevious()
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="min-h-[200px] flex flex-col">
          <div className="text-xl font-semibold mb-4">{flashcard.question}</div>

          {showAnswer ? (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="whitespace-pre-line">{flashcard.answer}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Button onClick={toggleAnswer}>Show Answer</Button>
            </div>
          )}
        </div>
      </CardContent>

      {showNavigation && (
        <CardFooter className="flex justify-between p-4 border-t">
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
          <Button variant="outline" onClick={toggleAnswer}>
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

