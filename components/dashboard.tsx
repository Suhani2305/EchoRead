"use client"

import { ReadingMetrics } from "@/components/reading-metrics"
import { ActivityTimeline } from "@/components/activity-timeline"
import { AIInsights } from "@/components/ai-insights"
import { RecommendedBooks } from "@/components/recommended-books"
import { ReadingProgress } from "@/components/reading-progress"
import { BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function Dashboard() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userName, setUserName] = useState("Reader")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load user settings from localStorage
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setUserName(settings.name || "Reader")
    }

    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail.name) {
        setUserName(event.detail.name)
      }
    }

    window.addEventListener('profileUpdate', handleProfileUpdate as EventListener)

    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleContinueReading = () => {
    router.push('/library')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container py-6 pt-16 md:pt-10 md:py-10 space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Welcome Back, {userName}!</h1>
          <p className="text-muted-foreground">Track your reading progress and get personalized insights</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Last updated: {formatDate(currentTime)}</span>
          </div>
          <Button 
            className="gradient-button"
            onClick={handleContinueReading}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Continue Reading
          </Button>
        </div>
      </div>

      <ReadingMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReadingProgress />
        </div>
        <div className="animate-fade-in">
          <AIInsights />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>
        <div className="animate-fade-in">
          <RecommendedBooks />
        </div>
      </div>
    </div>
  )
}
