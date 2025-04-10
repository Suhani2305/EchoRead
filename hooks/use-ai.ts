"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { fallbackAIService } from "@/lib/fallback-ai-service"

type AIRequestType = "reading-insights" | "book-recommendations" | "vocabulary-analysis" | "book-summary"

export function useAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()

  const generateAIResponse = async (prompt: string, type: AIRequestType) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log(`Sending ${type} request to API...`)

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, type }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.text) {
        throw new Error("No text returned from AI API")
      }

      // If it's a fallback response, show a toast
      if (data.fallback) {
        toast({
          title: "Using Demo Mode",
          description: "AI features are using pre-defined responses for demonstration.",
          variant: "default",
        })
      }

      setResult(data.text)
      return data.text
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate AI response"
      console.error("AI Error:", errorMessage)
      setError(errorMessage)

      // Show toast for the error
      toast({
        title: "AI Features Notice",
        description: "Using fallback AI responses for demonstration purposes.",
        variant: "default",
      })

      // Return fallback data based on the type
      let fallbackResponse = ""

      if (type === "reading-insights") {
        fallbackResponse = fallbackAIService.getReadingInsights().join("\n")
      } else if (type === "book-recommendations") {
        fallbackResponse = fallbackAIService
          .getBookRecommendations()
          .map((rec) => `${rec.title} by ${rec.author}: ${rec.reason}`)
          .join("\n")
      } else if (type === "vocabulary-analysis") {
        fallbackResponse = fallbackAIService.getVocabularyAnalysis().join("\n")
      } else if (type === "book-summary") {
        fallbackResponse = fallbackAIService.getBookSummary("Unknown")
      }

      return fallbackResponse
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateAIResponse,
    isLoading,
    error,
    result,
  }
}
