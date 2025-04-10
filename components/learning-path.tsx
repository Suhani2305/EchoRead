"use client"

import { useState } from "react"
import { Brain, BookOpen, Award, CheckCircle, ArrowRight, Sparkles, Clock, Lock, Trophy, ChevronRight, Star, Bookmark, Target, Zap, Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Book, LearningPath, Milestone, Achievement, Recommendation } from "@/lib/types"

// Sample learning path data
const sampleLearningPath: LearningPath = {
  currentLevel: "Beginner Reader",
  progress: 45,
  nextLevel: "Intermediate Reader",
  milestones: [
    {
      id: 1,
      title: "Start Your Reading Journey",
      description: "Complete your first book and set up your reading goals",
      completed: true,
      books: [],
      skills: ["Basic comprehension", "Reading habit formation"],
      progress: 100,
      completedBooks: 1,
      totalBooks: 1
    },
    {
      id: 2,
      title: "Expand Your Horizons",
      description: "Read books from different genres",
      completed: false,
      current: true,
      books: [],
      skills: ["Genre exploration", "Diverse reading"],
      progress: 50,
      completedBooks: 2,
      totalBooks: 4
    }
  ],
  achievements: [
    {
      id: 1,
      title: "First Book Completed",
      description: "You finished your first book!",
      completed: true,
      date: "2024-02-15"
    },
    {
      id: 2,
      title: "Reading Streak",
      description: "Read for 7 days in a row",
      completed: false,
      progress: 5,
      total: 7
    }
  ],
  recommendations: [
    {
      id: 1,
      title: "Try a New Genre",
      description: "Explore mystery books to diversify your reading",
      icon: BookOpen
    },
    {
      id: 2,
      title: "Join a Reading Challenge",
      description: "Participate in the monthly reading challenge",
      icon: Trophy
    }
  ]
}

export function LearningPath() {
  const router = useRouter()
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [path] = useState<LearningPath>(sampleLearningPath)

  const handleContinueLearning = () => {
    // Store the current milestone in localStorage
    const currentMilestone = path.milestones.find((m: Milestone) => m.current)
    if (currentMilestone) {
      localStorage.setItem("selectedMilestone", JSON.stringify(currentMilestone))
    }
    // Navigate to Library page
    router.push('/library')
  }

  const handleViewBooks = () => {
    router.push('/recommendations')
  }

  const handleViewMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
  }

  const handleViewDetails = (milestone: Milestone) => {
    if (!milestone.completed && !milestone.current) return
    localStorage.setItem("selectedMilestone", JSON.stringify(milestone))
    router.push(`/milestone/${milestone.id}`)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header Section with Animated Progress */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white animate-fade-in dark:from-purple-700 dark:to-blue-700">
        <div className="absolute top-0 right-0 p-4">
          <Flame className="h-8 w-8 text-yellow-400 animate-pulse" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Learning Path</h2>
            <p className="text-purple-100 mt-2">
              Current Level: {path.currentLevel}
            </p>
          </div>
          <Button 
            onClick={handleContinueLearning}
            className="bg-white text-purple-600 hover:bg-purple-100 transition-colors duration-200 dark:bg-purple-900 dark:text-white dark:hover:bg-purple-800"
          >
            Continue Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress to {path.nextLevel}</span>
            <span className="font-bold">{path.progress}%</span>
          </div>
          <Progress 
            value={path.progress} 
            className="h-3 bg-white/20 dark:bg-white/10 transition-all duration-500"
          />
        </div>
      </div>

      {/* Milestones and Achievements Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Milestones Section */}
        <div className="space-y-4 animate-slide-in-left">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-semibold">Milestones</h3>
          </div>
          <ScrollArea className="h-[300px] rounded-xl border bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-4">
            {path.milestones.map((milestone: Milestone) => (
              <div
                key={milestone.id}
                className="mb-4 p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                onClick={() => handleViewMilestone(milestone)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">{milestone.title}</h4>
                  {milestone.completed ? (
                    <Star className="h-5 w-5 text-yellow-400" />
                  ) : milestone.current ? (
                    <Zap className="h-5 w-5 text-blue-500 animate-pulse" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                <div className="mt-3 space-y-2">
                  <Progress 
                    value={milestone.progress} 
                    className="h-2 bg-gray-100 dark:bg-gray-700 transition-all duration-500"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {milestone.completedBooks} of {milestone.totalBooks} books
                    </span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {milestone.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Achievements Section */}
        <div className="space-y-4 animate-slide-in-right">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold">Achievements</h3>
          </div>
          <ScrollArea className="h-[300px] rounded-xl border bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-4">
            {path.achievements.map((achievement: Achievement) => (
              <div
                key={achievement.id}
                className="mb-4 p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">{achievement.title}</h4>
                  {achievement.completed ? (
                    <Star className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Target className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                {achievement.progress !== undefined && achievement.total && (
                  <div className="mt-3 space-y-2">
                    <Progress
                      value={(achievement.progress / achievement.total) * 100}
                      className="h-2 bg-gray-100 dark:bg-gray-700 transition-all duration-500"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {achievement.progress} of {achievement.total} days
                      </span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        {Math.round((achievement.progress / achievement.total) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Selected Milestone Details */}
      {selectedMilestone && (
        <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold">{selectedMilestone.title}</h3>
          </div>
          <p className="text-muted-foreground mb-4">{selectedMilestone.description}</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Skills to Master:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMilestone.skills.map((skill: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800 transition-colors duration-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Reading Progress</span>
                  <span>{selectedMilestone.progress}%</span>
                </div>
                <Progress 
                  value={selectedMilestone.progress} 
                  className="h-2 bg-gray-100 dark:bg-gray-700 transition-all duration-500"
                />
              </div>
              <Button 
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors duration-200"
                onClick={handleViewBooks}
              >
                View Books
                <BookOpen className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {path.recommendations.map((recommendation: Recommendation) => (
            <div
              key={recommendation.id}
              className="rounded-xl border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
                  <recommendation.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
