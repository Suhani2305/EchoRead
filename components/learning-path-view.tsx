"use client"

import { Brain, BookOpen, GraduationCap, Award, CheckCircle, Lock, ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LearningPathView() {
  const paths = [
    {
      id: 1,
      title: "Classic Literature",
      description: "Explore the foundations of literature through timeless classics",
      progress: 60,
      books: [
        {
          id: 101,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          cover: "/placeholder.svg?height=120&width=80",
          status: "completed",
        },
        {
          id: 102,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          cover: "/placeholder.svg?height=120&width=80",
          status: "in-progress",
        },
        {
          id: 103,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          cover: "/placeholder.svg?height=120&width=80",
          status: "in-progress",
        },
        {
          id: 104,
          title: "1984",
          author: "George Orwell",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
        {
          id: 105,
          title: "Moby Dick",
          author: "Herman Melville",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
      ],
    },
    {
      id: 2,
      title: "Science Fiction",
      description: "Explore futuristic worlds and technological possibilities",
      progress: 40,
      books: [
        {
          id: 201,
          title: "Dune",
          author: "Frank Herbert",
          cover: "/placeholder.svg?height=120&width=80",
          status: "completed",
        },
        {
          id: 202,
          title: "Brave New World",
          author: "Aldous Huxley",
          cover: "/placeholder.svg?height=120&width=80",
          status: "in-progress",
        },
        {
          id: 203,
          title: "Foundation",
          author: "Isaac Asimov",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
        {
          id: 204,
          title: "Neuromancer",
          author: "William Gibson",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
        {
          id: 205,
          title: "The Left Hand of Darkness",
          author: "Ursula K. Le Guin",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
      ],
    },
    {
      id: 3,
      title: "Mystery & Thriller",
      description: "Engage with suspenseful narratives and complex mysteries",
      progress: 20,
      books: [
        {
          id: 301,
          title: "The Silent Patient",
          author: "Alex Michaelides",
          cover: "/placeholder.svg?height=120&width=80",
          status: "completed",
        },
        {
          id: 302,
          title: "Gone Girl",
          author: "Gillian Flynn",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
        {
          id: 303,
          title: "The Girl with the Dragon Tattoo",
          author: "Stieg Larsson",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
        {
          id: 304,
          title: "And Then There Were None",
          author: "Agatha Christie",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
        {
          id: 305,
          title: "The Da Vinci Code",
          author: "Dan Brown",
          cover: "/placeholder.svg?height=120&width=80",
          status: "locked",
        },
      ],
    },
  ]

  const achievements = [
    {
      id: 1,
      title: "Bookworm",
      description: "Read 10 books",
      progress: 70,
      current: 7,
      target: 10,
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Quiz Master",
      description: "Score 90% or higher on 5 quizzes",
      progress: 60,
      current: 3,
      target: 5,
      icon: GraduationCap,
    },
    {
      id: 3,
      title: "Vocabulary Builder",
      description: "Learn 50 new words",
      progress: 80,
      current: 40,
      target: 50,
      icon: Brain,
    },
    {
      id: 4,
      title: "Reading Streak",
      description: "Read for 30 consecutive days",
      progress: 50,
      current: 15,
      target: 30,
      icon: Award,
    },
  ]

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-7xl">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Learning Path</h1>
      </div>
      <p className="text-muted-foreground">Structured reading journeys to expand your literary horizons</p>

      <Tabs defaultValue="paths">
        <TabsList>
          <TabsTrigger value="paths">Reading Paths</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="mt-6 space-y-8">
          {paths.map((path) => (
            <Card key={path.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{path.progress}% Complete</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={path.progress} className="h-2" />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {path.books.map((book) => (
                    <div key={book.id} className="relative">
                      <div className="aspect-[2/3] relative overflow-hidden rounded-md">
                        <img
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          className="object-cover w-full h-full"
                        />
                        {book.status === "locked" && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        {book.status === "completed" && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Continue Path
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {achievement.current} / {achievement.target}
                    </span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
