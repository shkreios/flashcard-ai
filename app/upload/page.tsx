"use client"
import { PdfUploadForm } from "@/components/pdf-upload-form"

export default function UploadPage() {
  // For simplicity, we're using a fixed user ID
  // In a real app, you would get this from authentication
  const userId = 1

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload PDF</h1>
        <p className="mb-6 text-muted-foreground">
          Upload a PDF document to automatically generate flashcards using AI.
        </p>

        <div className="flex justify-center">
          <PdfUploadForm userId={userId} />
        </div>
      </div>
    </div>
  )
}

