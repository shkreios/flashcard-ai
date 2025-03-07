"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function StudyPage({ params }: { params: { deckId: string } }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studiedCards, setStudiedCards] = useState<Record<number, "correct" | "incorrect">>({})

  // Mock data - in a real app, this would come from an API
  const deck = {
    id: Number.parseInt(params.deckId),
    title: "Biology 101",
    cards: [
      {
        id: 1,
        question: "What are the main components of a eukaryotic cell?",
        answer:
          "The main components include the cell membrane, nucleus, cytoplasm, mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, and various other organelles.",
      },
      {
        id: 2,
        question: "What is the function of mitochondria?",
        answer:
          "Mitochondria are the powerhouses of the cell, responsible for generating most of the cell's supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.",
      },
      {
        id: 3,
        question: "What is the difference between prokaryotic and eukaryotic cells?",
        answer:
          "Prokaryotic cells lack a nucleus and membrane-bound organelles, while eukaryotic cells have a nucleus that contains genetic material and membrane-bound organelles.",
      },
      {
        id: 4,
        question: "What is the function of the cell membrane?",
        answer:
          "The cell membrane regulates what enters and exits the cell, provides protection and support, and helps maintain the cell's environment.",
      },
      {
        id: 5,
        question: "What is cellular respiration?",
        answer:
          "Cellular respiration is the process by which cells convert nutrients into energy (ATP) and waste products.",
      },
    ],
  }

  const handleNextCard = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleMarkCard = (status: "correct" | "incorrect") => {
    setStudiedCards({
      ...studiedCards,
      [deck.cards[currentCardIndex].id]: status,
    })

    // Move to next card if available
    if (currentCardIndex < deck.cards.length - 1) {
      handleNextCard()
    }
  }

  const progress = (Object.keys(studiedCards).length / deck.cards.length) * 100

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{deck.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentCardIndex + 1} of {deck.cards.length}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{deck.cards[currentCardIndex].question}</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {showAnswer ? (
            <div className="prose max-w-none">
              <p>{deck.cards[currentCardIndex].answer}</p>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousCard} disabled={currentCardIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextCard}
              disabled={currentCardIndex === deck.cards.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {showAnswer && (
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1" onClick={() => handleMarkCard("incorrect")}>
                <XCircle className="h-4 w-4 text-destructive" />
                <span>Didn't Know</span>
              </Button>
              <Button variant="outline" className="gap-1" onClick={() => handleMarkCard("correct")}>
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Knew It</span>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard">End Session</Link>
        </Button>
        {Object.keys(studiedCards).length === deck.cards.length && (
          <Button asChild>
            <Link href="/dashboard">Complete Deck</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

