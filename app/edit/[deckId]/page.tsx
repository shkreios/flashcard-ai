"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Save, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function EditDeckPage({ params }: { params: { deckId: string } }) {
  const { toast } = useToast()

  // Mock data - in a real app, this would come from an API
  const [deck, setDeck] = useState({
    id: Number.parseInt(params.deckId),
    title: "Biology 101",
    description: "Fundamentals of cell biology and genetics",
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
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeck({ ...deck, title: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDeck({ ...deck, description: e.target.value })
  }

  const handleCardChange = (id: number, field: "question" | "answer", value: string) => {
    setDeck({
      ...deck,
      cards: deck.cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
    })
  }

  const handleAddCard = () => {
    const newId = Math.max(0, ...deck.cards.map((card) => card.id)) + 1
    setDeck({
      ...deck,
      cards: [
        ...deck.cards,
        {
          id: newId,
          question: "",
          answer: "",
        },
      ],
    })
  }

  const handleDeleteCard = (id: number) => {
    if (deck.cards.length <= 1) {
      toast({
        title: "Cannot delete card",
        description: "A deck must have at least one card.",
        variant: "destructive",
      })
      return
    }

    setDeck({
      ...deck,
      cards: deck.cards.filter((card) => card.id !== id),
    })
  }

  const handleSave = () => {
    // Validate data
    if (!deck.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your deck.",
        variant: "destructive",
      })
      return
    }

    // Check for empty cards
    const hasEmptyCards = deck.cards.some((card) => !card.question.trim() || !card.answer.trim())

    if (hasEmptyCards) {
      toast({
        title: "Empty cards detected",
        description: "Please fill in all question and answer fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to an API
    toast({
      title: "Deck saved",
      description: "Your flashcard deck has been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Deck</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deck Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={deck.title} onChange={handleTitleChange} placeholder="Enter deck title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={deck.description}
              onChange={handleDescriptionChange}
              placeholder="Enter deck description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flashcards ({deck.cards.length})</h2>
        <Button onClick={handleAddCard} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>

      {deck.cards.map((card, index) => (
        <Card key={card.id} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Card {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${card.id}`}>Question</Label>
              <Textarea
                id={`question-${card.id}`}
                value={card.question}
                onChange={(e) => handleCardChange(card.id, "question", e.target.value)}
                placeholder="Enter question"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`answer-${card.id}`}>Answer</Label>
              <Textarea
                id={`answer-${card.id}`}
                value={card.answer}
                onChange={(e) => handleCardChange(card.id, "answer", e.target.value)}
                placeholder="Enter answer"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="outline" size="sm" onClick={() => handleDeleteCard(card.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Cancel</Link>
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Deck
        </Button>
      </div>
    </div>
  )
}

