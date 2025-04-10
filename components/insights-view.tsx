"use client"

import { useState } from "react"
import { Sparkles, TrendingUp, BookOpen, Clock, BarChart2, Search } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function InsightsView() {
  const [activeTab, setActiveTab] = useState("reading-patterns")

  const readingPatterns = [
    {
      title: "Optimal Reading Time",
      description: "You read most effectively in the morning between 8-10 AM",
      icon: Clock,
      iconColor: "text-blue-500 bg-blue-100",
    },
    {
      title: "Reading Speed",
      description: "Your average reading speed is 42 pages per hour, which is 15% faster than last month",
      icon: TrendingUp,
      iconColor: "text-green-500 bg-green-100",
    },
    {
      title: "Completion Rate",
      description: "You complete 87% of books you start, which is above average",
      icon: BarChart2,
      iconColor: "text-purple-500 bg-purple-100",
    },
    {
      title: "Genre Preference",
      description: "You spend 65% of your reading time on Fiction, followed by Science Fiction at 20%",
      icon: BookOpen,
      iconColor: "text-amber-500 bg-amber-100",
    },
  ]

  const vocabularyInsights = [
    {
      word: "Ephemeral",
      definition: "Lasting for a very short time",
      context: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
      book: "The Great Gatsby",
    },
    {
      word: "Ubiquitous",
      definition: "Present, appearing, or found everywhere",
      context: "Smartphones have become ubiquitous in modern society.",
      book: "Brave New World",
    },
    {
      word: "Sycophant",
      definition: "A person who acts obsequiously toward someone important to gain advantage",
      context: "He was surrounded by sycophants who agreed with everything he said.",
      book: "1984",
    },
    {
      word: "Mellifluous",
      definition: "Sweet or musical; pleasant to hear",
      context: "She spoke in a mellifluous voice that captivated the audience.",
      book: "Pride and Prejudice",
    },
  ]

  const recommendations = [
    {
      title: "Dune",
      author: "Frank Herbert",
      cover: "/placeholder.svg?height=120&width=80",
      match: "98%",
      reason: "Based on your interest in world-building and science fiction",
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/placeholder.svg?height=120&width=80",
      match: "95%",
      reason: "Similar to other sci-fi books you've enjoyed",
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "/placeholder.svg?height=120&width=80",
      match: "92%",
      reason: "Matches your interest in fantasy adventures",
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "/placeholder.svg?height=120&width=80",
      match: "90%",
      reason: "Based on your recent interest in psychological thrillers",
    },
  ]

  const comprehensionScores = [
    {
      book: "The Great Gatsby",
      score: 92,
      strengths: ["Character analysis", "Theme recognition"],
      areas: ["Historical context"],
    },
    {
      book: "To Kill a Mockingbird",
      score: 88,
      strengths: ["Plot understanding", "Moral themes"],
      areas: ["Literary devices"],
    },
    {
      book: "Brave New World",
      score: 85,
      strengths: ["World-building", "Social commentary"],
      areas: ["Character motivations"],
    },
  ]

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-7xl">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Reading Insights</h1>
      </div>
      <p className="text-muted-foreground">Personalized insights and recommendations based on your reading habits</p>

      <Tabs defaultValue="reading-patterns" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="reading-patterns">Reading Patterns</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="comprehension">Comprehension</TabsTrigger>
        </TabsList>

        <TabsContent value="reading-patterns" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readingPatterns.map((insight, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full p-2 ${insight.iconColor}`}>
                      <insight.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reading Consistency</CardTitle>
              <CardDescription>Your reading consistency over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Days with reading activity</span>
                  <span className="font-medium">24/30 days</span>
                </div>
                <Progress value={80} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  You've maintained a consistent reading habit on 80% of days this month, which is excellent!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vocabulary" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Growth</CardTitle>
              <CardDescription>New words you've encountered in your reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vocabularyInsights.map((word, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{word.word}</h3>
                      <Badge variant="outline">{word.book}</Badge>
                    </div>
                    <p className="font-medium text-muted-foreground">{word.definition}</p>
                    <p className="text-sm italic">"{word.context}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                View Full Vocabulary List
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((book, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      className="h-[120px] w-[80px] object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                          {book.match} match
                        </div>
                      </div>
                      <p className="text-sm mt-2">{book.reason}</p>
                      <div className="mt-4">
                        <Button size="sm">Add to Library</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comprehension" className="mt-6 space-y-6">
          {comprehensionScores.map((book, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{book.book}</CardTitle>
                  <div className="text-2xl font-bold">{book.score}%</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Comprehension Score</h4>
                  <Progress value={book.score} className="h-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Strengths</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {book.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {book.areas.map((area, i) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
