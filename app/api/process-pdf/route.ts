import { NextRequest, NextResponse } from "next/server";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { flashcardsResponseSchema } from "@/lib/schemas";
import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { decks, flashcards } from "@/db/schema";
import { attachmentsToParts } from "./attachmentsToParts";
import { google } from "@ai-sdk/google";
export async function POST(req: NextRequest) {
  const body = await req.json();

  const attachments = attachmentsToParts(body);

  if (!attachments) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Create a streaming response
  const result = streamObject({
    model: google("gemini-2.0-pro-exp-02-05"),
    onError(event) {
      console.error(event);
    },
    onFinish: async ({ object }) => {
      if (object) {
        const deckId = uuidv4();
        await db.insert(decks).values({
          id: deckId,
          userId: 1,
          title: object.title,
          description: object.description,
        });

        // Insert the flashcards into the database
        const flashcardsToInsert = object.flashcards.map((flashcard) => ({
          id: uuidv4(),
          deckId,
          question: flashcard.question,
          answer: flashcard.answer,
        }));

        await db.insert(flashcards).values(flashcardsToInsert);
      }
    },
    schema: flashcardsResponseSchema,
    messages: [
      {
        role: "system",
        content: `
        You are an expert at creating educational flashcards from PDF content.
        
        I'm providing you with a PDF document. Please analyze its content and create a set of flashcards.
        Each flashcard should have a question and an answer.
        
        Extract the key concepts, definitions, and examples from the PDF.
        Create questions that test understanding of these concepts.
        Provide clear, concise answers.
        
        Also, suggest an appropriate title  & description for this flashcard deck based on the content.

        Your response should be in the same language as the PDF document.
      `,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please create flashcards from this PDF document.",
          },
          ...attachments,
        ],
      },
    ],
  });

  return result.toTextStreamResponse();
}
