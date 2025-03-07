import { z } from "zod";

export const flashcardSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .describe("The question of the flashcard"),
  answer: z
    .string()
    .min(1, "Answer is required")
    .describe("The answer to the flashcard"),
});

export const flashcardsResponseSchema = z.object({
  flashcards: z.array(flashcardSchema).describe("The flashcards in the deck"),
  title: z
    .string()
    .min(1, "Title is required")
    .describe("The title of the flashcard deck"),
  description: z
    .string()
    .min(1, "Description is required")
    .describe("A description of the flashcard deck"),
});

export type FlashcardType = z.infer<typeof flashcardSchema>;
export type FlashcardsResponseType = z.infer<typeof flashcardsResponseSchema>;
