"use client"

import { useRouter } from "next/navigation"
import { FileUp } from "lucide-react"

import { Button } from "@/components/ui/button"

export function UploadPdfButton() {
  const router = useRouter()

  return (
    <Button className="justify-start" onClick={() => router.push("/upload")}>
      <FileUp className="mr-2 h-4 w-4" />
      Upload PDF
    </Button>
  )
}

