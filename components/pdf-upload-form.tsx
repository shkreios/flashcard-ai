"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { flashcardsResponseSchema } from "@/lib/schemas";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { prepareAttachmentsForRequest } from "@ai-sdk/ui-utils";
import { FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PdfUploadFormProps {
  userId: number;
}

export function PdfUploadForm({ userId }: PdfUploadFormProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const { object, isLoading, error, submit } = useObject({
    api: "/api/process-pdf",
    schema: flashcardsResponseSchema,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onFinish: ({ object }) => {
      if (object) {
        toast({
          title: "Success!",
          description: `Created deck "${object.title}" with ${object.flashcards.length} flashcards.`,
        });
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        for (const file of e.target.files) {
          if (file.type !== "application/pdf") {
            throw new Error(`File ${file.name} is not a PDF`);
          }
        }
        setFiles(e.target.files);
      } catch (error) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    const attachments = await prepareAttachmentsForRequest(files);

    submit(attachments);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdfUpload">PDF File</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="pdfUpload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {files ? (
                      <>
                        <FileUp className="w-12 h-12 text-primary mb-2" />
                        {Array.from(files).map((file, index) => (
                          <div key={index}>
                            <p className="mb-2 text-sm font-semibold">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <FileUp className="w-12 h-12 text-muted-foreground mb-2" />
                        <p className="mb-2 text-sm font-semibold">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF (MAX. 20MB)
                        </p>
                      </>
                    )}
                  </div>
                  <Input
                    id="pdfUpload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !files}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                "Generate Flashcards"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Flashcards Section */}
      {object && (
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>{object.title || "Generated Flashcards"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {object.flashcards && object.flashcards.length > 0 ? (
                  <div className="grid gap-4">
                    {object.flashcards.map((flashcard, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 py-3">
                          <h3 className="font-medium">Question {index + 1}</h3>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="mb-4">
                            {flashcard?.question || "Loading question..."}
                          </p>
                          <div className="pt-2 border-t">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                              Answer:
                            </h4>
                            <p>{flashcard?.answer || "Loading answer..."}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">
                      Generating flashcards...
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
