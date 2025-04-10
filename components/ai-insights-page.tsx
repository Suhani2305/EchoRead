"use client"

import { useState, useEffect } from "react"
import { Sparkles, TrendingUp, Brain, Lightbulb, BookOpen, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAI } from "@/hooks/use-ai"
import { dataService } from "@/lib/data-service"
import { fallbackAIService } from "@/lib/fallback-ai-service"

export function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState("reading")
  const [insights, setInsights] = useState<{ title: string; description: string; icon: any; iconColor: string }[]>([])
  const [recommendations, setRecommendations] = useState<{ title: string; author: string; reason: string }[]>([])
  const [vocabularyInsights, setVocabularyInsights] = useState<{ title: string; description: string }[]>([])
  const { generateAIResponse, isLoading } = useAI()

  // Generate reading insights
  const generateReadingInsights = async () => {
    const readingStats = dataService.getReadingStats()
    const weeklyData = dataService.getWeeklyReadingData()
    const genreDistribution = dataService.getGenreDistribution()

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
      
      Genre Distribution:
      ${JSON.stringify(genreDistribution)}
    `

    try {
      const response = await generateAIResponse(prompt, "reading-insights")

      if (response) {
        // Parse the response into insights
        const insightLines = response.split("\n").filter((line) => line.trim().length > 0)
        const icons = [TrendingUp, Brain, Lightbulb]
        const colors = ["text-blue-500 bg-blue-100", "text-purple-500 bg-purple-100", "text-amber-500 bg-amber-100"]

        const formattedInsights = insightLines.map((line, index) => {
          const parts = line.split(":")
          const title = parts[0].replace(/^\d+\.\s*/, "").trim()
          const description = parts.slice(1).join(":").trim()

          return {
            title,
            description,
            icon: icons[index % icons.length],
            iconColor: colors[index % colors.length],
          }
        })

        setInsights(formattedInsights)
      } else {
        // Use fallback insights
        const fallbackInsights = fallbackAIService.getReadingInsights()
        const icons = [TrendingUp, Brain, Lightbulb]
        const colors = ["text-blue-500 bg-blue-100", "text-purple-500 bg-purple-100", "text-amber-500 bg-amber-100"]

        setInsights(
          fallbackInsights.map((insight, index) => ({
            title: `Insight ${index + 1}`,
            description: insight,
            icon: icons[index % icons.length],
            iconColor: colors[index % colors.length],
          })),
        )
      }
    } catch (error) {
      console.error("Error generating insights:", error)
      // Use fallback insights
      const fallbackInsights = fallbackAIService.getReadingInsights()
      const icons = [TrendingUp, Brain, Lightbulb]
      const colors = ["text-blue-500 bg-blue-100", "text-purple-500 bg-purple-100", "text-amber-500 bg-amber-100"]

      setInsights(
        fallbackInsights.map((insight, index) => ({
          title: `Insight ${index + 1}`,
          description: insight,
          icon: icons[index % icons.length],
          iconColor: colors[index % colors.length],
        })),
      )
    }
  }

  // Generate book recommendations
  const generateBookRecommendations = async () => {
    const books = dataService.getBooks()
    const completedBooks = dataService.getBooksByStatus("completed")
    const genreDistribution = dataService.getGenreDistribution()

    const prompt = `
      Completed Books:
      ${completedBooks.map((book) => `- ${book.title} by ${book.author} (${book.genre})`).join("\n")}
      
      Genre Preferences:
      ${genreDistribution.map((genre) => `- ${genre.name}: ${genre.value} books`).join("\n")}
      
      Please recommend books that are not in this list:
      ${books.map((book) => book.title).join(", ")}
    `

    try {
      const response = await generateAIResponse(prompt, "book-recommendations")

      if (response) {
        // Parse the response into recommendations
        const recommendationLines = response.split("\n").filter((line) => line.trim().length > 0)

        const formattedRecommendations = recommendationLines.map((line) => {
          const match = line.match(/^(?:\d+\.\s*)?([^:]+) by ([^:]+):?\s*(.*)$/)

          if (match) {
            return {
              title: match[1].trim(),
              author: match[2].trim(),
              reason: match[3].trim(),
            }
          }

          return {
            title: line,
            author: "Unknown",
            reason: "Recommended based on your reading history",
          }
        })

        setRecommendations(formattedRecommendations)
      } else {
        // Use fallback recommendations
        setRecommendations(fallbackAIService.getBookRecommendations())
      }
    } catch (error) {
      console.error("Error generating recommendations:", error)
      // Use fallback recommendations
      setRecommendations(fallbackAIService.getBookRecommendations())
    }
  }

  // Generate vocabulary insights
  const generateVocabularyInsights = async () => {
    const vocabularyWords = dataService.getVocabularyWords()

    const prompt = `
      Vocabulary Words:
      ${vocabularyWords.map((word) => `- ${word.word} (${word.partOfSpeech}): ${word.definition}`).join("\n")}
      
      Mastery Status:
      - Learning: ${vocabularyWords.filter((word) => word.mastery === "learning").length} words
      - Mastered: ${vocabularyWords.filter((word) => word.mastery === "mastered").length} words
    `

    try {
      const response = await generateAIResponse(prompt, "vocabulary-analysis")

      if (response) {
        // Parse the response into insights
        const insightLines = response.split("\n").filter((line) => line.trim().length > 0)

        const formattedInsights = insightLines.map((line) => {
          const parts = line.split(":")
          const title = parts[0].replace(/^\d+\.\s*/, "").trim()
          const description = parts.slice(1).join(":").trim()

          return {
            title,
            description,
          }
        })

        setVocabularyInsights(formattedInsights)
      } else {
        // Use fallback vocabulary insights
        const fallbackInsights = fallbackAIService.getVocabularyAnalysis()
        setVocabularyInsights(
          fallbackInsights.map((insight, index) => ({
            title: `Vocabulary Insight ${index + 1}`,
            description: insight,
          })),
        )
      }
    } catch (error) {
      console.error("Error generating vocabulary insights:", error)
      // Use fallback vocabulary insights
      const fallbackInsights = fallbackAIService.getVocabularyAnalysis()
      setVocabularyInsights(
        fallbackInsights.map((insight, index) => ({
          title: `Vocabulary Insight ${index + 1}`,
          description: insight,
        })),
      )
    }
  }

  // Generate insights when tab changes
  useEffect(() => {
    if (activeTab === "reading" && insights.length === 0) {
      generateReadingInsights()
    } else if (activeTab === "recommendations" && recommendations.length === 0) {
      generateBookRecommendations()
    } else if (activeTab === "vocabulary" && vocabularyInsights.length === 0) {
      generateVocabularyInsights()
    }
  }, [activeTab])

  return (
    <div className="container py-6 pt-16 md:pt-10 space-y-8 max-w-7xl">
      <Tabs defaultValue="reading" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="reading">
            <Sparkles className="mr-2 h-4 w-4" />
            Reading Insights
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <BookOpen className="mr-2 h-4 w-4" />
            Book Recommendations
          </TabsTrigger>
          <TabsTrigger value="vocabulary">
            <Brain className="mr-2 h-4 w-4" />
            Vocabulary Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reading">
          <Card className="themed-card">
            <CardHeader className="themed-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="icon-container">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <CardTitle>AI Reading Insights</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={generateReadingInsights} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <CardDescription>Personalized insights based on your reading habits</CardDescription>
            </CardHeader>
            <CardContent className="themed-content">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className={`mt-0.5 rounded-full p-1.5 ${insight.iconColor}`}>
                          <insight.icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{insight.title}</p>
                          <p className="text-xs text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No insights available. Click refresh to generate insights.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="themed-card">
            <CardHeader className="themed-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="icon-container">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <CardTitle>AI Book Recommendations</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={generateBookRecommendations} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <CardDescription>Personalized book recommendations based on your reading history</CardDescription>
            </CardHeader>
            <CardContent className="themed-content">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <Skeleton className="h-24 w-16 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendations.length > 0 ? (
                    recommendations.map((book, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="h-24 w-16 bg-muted rounded flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <p className="text-sm mt-1">{book.reason}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No recommendations available. Click refresh to generate recommendations.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full gradient-button">Add to Reading List</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="vocabulary">
          <Card className="themed-card">
            <CardHeader className="themed-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="icon-container">
                    <Brain className="h-5 w-5" />
                  </div>
                  <CardTitle>AI Vocabulary Analysis</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={generateVocabularyInsights} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <CardDescription>Analysis of your vocabulary growth and patterns</CardDescription>
            </CardHeader>
            <CardContent className="themed-content">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {vocabularyInsights.length > 0 ? (
                    vocabularyInsights.map((insight, index) => (
                      <div key={index} className="space-y-1">
                        <h3 className="font-medium">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No vocabulary insights available. Click refresh to generate insights.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
