"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, BookOpen, CheckCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TimerView() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [selectedBook, setSelectedBook] = useState("")
  const [goal, setGoal] = useState(30) // Default 30 minutes
  const [startPage, setStartPage] = useState("")
  const [endPage, setEndPage] = useState("")
  const [sessions, setSessions] = useState([
    {
      id: 1,
      book: "To Kill a Mockingbird",
      duration: 45,
      pages: 32,
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      book: "Brave New World",
      duration: 30,
      pages: 25,
      date: "Yesterday, 8:15 PM",
    },
    {
      id: 3,
      book: "To Kill a Mockingbird",
      duration: 20,
      pages: 18,
      date: "Apr 2, 2025",
    },
  ])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (!selectedBook) return

    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTime(0)
  }

  const completeSession = () => {
    if (time > 0 && selectedBook) {
      const newSession = {
        id: Date.now(),
        book: selectedBook,
        duration: Math.floor(time / 60),
        pages: endPage && startPage ? Number.parseInt(endPage) - Number.parseInt(startPage) : 0,
        date: "Just now",
      }
      setSessions([newSession, ...sessions])
      resetTimer()
      setStartPage("")
      setEndPage("")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const books = [
    { id: "1", title: "To Kill a Mockingbird" },
    { id: "2", title: "Brave New World" },
    { id: "3", title: "The Great Gatsby" },
    { id: "4", title: "1984" },
  ]

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reading Timer</h1>
        <p className="text-muted-foreground">Track your reading sessions and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Reading Session</CardTitle>
              <CardDescription>Track your current reading session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="book">Select Book</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger id="book">
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.title}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-6xl font-bold tabular-nums mb-6">{formatTime(time)}</div>
                <Progress value={(time / 60 / goal) * 100} className="w-full h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {Math.floor(time / 60)} minutes of {goal} minute goal
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-page">Starting Page</Label>
                  <Input
                    id="start-page"
                    type="number"
                    placeholder="e.g., 42"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-page">Ending Page</Label>
                  <Input
                    id="end-page"
                    type="number"
                    placeholder="e.g., 68"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                {!isRunning ? (
                  <Button onClick={startTimer} disabled={!selectedBook}>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={pauseTimer} variant="outline">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button onClick={resetTimer} variant="outline" disabled={time === 0}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              <Button onClick={completeSession} disabled={time === 0 || !selectedBook}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>Customize your reading timer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Reading Goal (minutes)</Label>
                <Select value={goal.toString()} onValueChange={(value) => setGoal(Number.parseInt(value))}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reading Sessions</CardTitle>
          <CardDescription>Your reading history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="p-2 rounded-full bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{session.book}</h4>
                  <p className="text-sm text-muted-foreground">
                    {session.date} • {session.duration} minutes • {session.pages} pages
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {session.pages > 0 ? `${Math.round(session.pages / (session.duration / 60))} pages/hour` : "N/A"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
