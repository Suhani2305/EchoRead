"use client"

import { useState, useEffect } from "react"
import { Sparkles, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAI } from "@/hooks/use-ai"
import { dataService } from "@/lib/data-service"
import { fallbackAIService } from "@/lib/fallback-ai-service"

export function AIInsights() {
  const [insights, setInsights] = useState<string[]>([])
  const { generateAIResponse, isLoading } = useAI()
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    generateInsights()
  }, [retryCount])

  const generateInsights = async () => {
    try {
      const readingStats = dataService.getReadingStats()
      const weeklyData = dataService.getWeeklyReadingData()

      const prompt = `
        Reading Statistics:
        - Total Books: ${readingStats.totalBooks}
        - Completed Books: ${readingStats.completedBooks}
        - In Progress Books: ${readingStats.inProgressBooks}
        - Total Pages Read: ${readingStats.totalPages}
        - Total Reading Time: ${readingStats.totalReadingTime} minutes
        - Average Reading Speed: ${readingStats.averageReadingSpeed} pages per hour
        
        Weekly Reading Data:
        ${JSON.stringify(weeklyData)}
      `

      const response = await generateAIResponse(prompt, "reading-insights")

      if (response) {
        // Parse the response into insights
        const insightLines = response
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .map((line) => line.replace(/^Insight:\s*/, "").trim())
          .slice(0, 3)

        setInsights(insightLines)
      }
    } catch (err) {
      console.error("Error generating insights:", err)

      // Use fallback insights
      setInsights(fallbackAIService.getReadingInsights())
    }
  }

  const handleRefresh = () => {
    setRetryCount((prev) => prev + 1)
  }

  return (
    <Card className="themed-card">
      <CardHeader className="themed-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-container">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0 rounded-full"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="sr-only">Refresh insights</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="themed-content">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2 text-sm">
            {insights.map((insight, index) => (
              <li
                key={index}
                className="flex items-start gap-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <span className="text-primary font-medium">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
