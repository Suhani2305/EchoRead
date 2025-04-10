"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, PauseCircle, StopCircle, BookOpen, History, Timer, Target, ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ReadingTimer() {
  const [books, setBooks] = useState<any[]>([])
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [readingSessions, setReadingSessions] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [dailyGoal, setDailyGoal] = useState(30) // Default 30 minutes
  const [todayProgress, setTodayProgress] = useState(0)

  // Load books, reading sessions, and daily goal from localStorage
  useEffect(() => {
    const loadData = () => {
      const savedBooks = JSON.parse(localStorage.getItem('reading-list') || '[]')
      const currentReadingBooks = savedBooks.filter((book: any) => 
        book.status === "reading" || book.status === "completed"
      )
      setBooks(currentReadingBooks)
      
      const savedSessions = JSON.parse(localStorage.getItem('reading-sessions') || '[]')
      setReadingSessions(savedSessions)

      const savedGoal = localStorage.getItem('daily-reading-goal')
      if (savedGoal) setDailyGoal(parseInt(savedGoal))

      // Calculate today's progress
      const today = new Date().toDateString()
      const todaySessions = savedSessions.filter((session: any) => 
        new Date(session.date).toDateString() === today
      )
      const totalMinutesToday = todaySessions.reduce((sum: number, session: any) => 
        sum + Math.floor(session.duration / 60), 0
      )
      setTodayProgress(totalMinutesToday)
    }

    loadData()
    window.addEventListener('storage', loadData)
    return () => window.removeEventListener('storage', loadData)
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && selectedBook) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, selectedBook])

  // Update current page when book is selected
  useEffect(() => {
    if (selectedBook) {
      setCurrentPage(selectedBook.currentPage || 0)
    }
  }, [selectedBook])

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Update book progress
  const updateBookProgress = (newPage: number) => {
    if (!selectedBook) return

    const updatedBooks = books.map(book => {
      if (book.id === selectedBook.id) {
        return {
          ...book,
          currentPage: newPage,
          status: newPage >= book.pages ? "completed" : "reading"
        }
      }
      return book
    })

    // Update localStorage
    const allBooks = JSON.parse(localStorage.getItem('reading-list') || '[]')
    const finalBooks = allBooks.map((book: any) => 
      updatedBooks.find(b => b.id === book.id) || book
    )
    
    localStorage.setItem('reading-list', JSON.stringify(finalBooks))
    setBooks(updatedBooks)
    setSelectedBook(updatedBooks.find(b => b.id === selectedBook.id))
  }

  // Start reading session
  const startSession = () => {
    if (!selectedBook) {
      toast.error("Please select a book first")
      return
    }
    setIsRunning(true)
    toast.success(`Started reading ${selectedBook.title}`)
  }

  // Pause reading session
  const pauseSession = () => {
    setIsRunning(false)
    toast.info("Reading session paused")
  }

  // End reading session
  const endSession = () => {
    if (!selectedBook || time === 0) return

    // Calculate pages read during this session
    const pagesReadDuringSession = Math.max(1, Math.floor(time / 60)) // At least 1 page per minute
    const totalPagesRead = (selectedBook.currentPage || 0) + pagesReadDuringSession
    const finalPageCount = Math.min(totalPagesRead, selectedBook.pages)

    // Update book progress
    const updatedBooks = books.map(book => {
      if (book.id === selectedBook.id) {
        return {
          ...book,
          currentPage: finalPageCount,
          status: finalPageCount >= book.pages ? "completed" : "reading"
        }
      }
      return book
    })

    // Save new reading session with actual pages read
    const newSession = {
      id: Date.now(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      duration: time,
      pagesRead: pagesReadDuringSession,
      date: new Date().toISOString(),
      startPage: selectedBook.currentPage || 0,
      endPage: finalPageCount
    }

    const updatedSessions = [newSession, ...readingSessions]
    
    // Update localStorage
    const allBooks = JSON.parse(localStorage.getItem('reading-list') || '[]')
    const finalBooks = allBooks.map((book: any) => 
      updatedBooks.find(b => b.id === book.id) || book
    )
    
    localStorage.setItem('reading-list', JSON.stringify(finalBooks))
    localStorage.setItem('reading-sessions', JSON.stringify(updatedSessions))
    
    // Update state
    setBooks(updatedBooks)
    setReadingSessions(updatedSessions)
    setTime(0)
    setIsRunning(false)
    setSelectedBook(null)

    toast.success("Reading session completed!", {
      description: `You read for ${formatTime(time)} and completed ${pagesReadDuringSession} pages`
    })
  }

  // Save daily goal
  const saveDailyGoal = (minutes: number) => {
    setDailyGoal(minutes)
    localStorage.setItem('daily-reading-goal', minutes.toString())
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col gap-4">
        {/* <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 group">
          Reading Timer
          <Timer className="h-6 w-6 text-blue-500 transition-transform duration-300 group-hover:rotate-12" />
        </h2>
        <p className="text-muted-foreground">Track your reading sessions</p> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="group hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group">
                Reading Session
                <BookOpen className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:rotate-12" />
              </CardTitle>
              <CardDescription>Select a book and start reading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                value={selectedBook?.id} 
                onValueChange={(value) => {
                  const book = books.find(b => b.id === value)
                  setSelectedBook(book)
                }}
              >
                <SelectTrigger className="hover:border-blue-500 transition-colors">
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {books
                    .filter(book => book.status === "reading")
                    .map(book => (
                      <SelectItem 
                        key={book.id} 
                        value={book.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        {book.title}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              {selectedBook && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-muted-foreground">
                        {selectedBook.currentPage || 0} / {selectedBook.pages} pages
                      </span>
                    </div>
                    <Progress 
                      value={((selectedBook.currentPage || 0) / selectedBook.pages) * 100}
                      className="h-2 transition-all duration-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current-page">Current Page</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-blue-50 hover:border-blue-500 transition-colors"
                        onClick={() => {
                          if (currentPage > 0) {
                            const newPage = currentPage - 1
                            setCurrentPage(newPage)
                            updateBookProgress(newPage)
                          }
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Input
                        id="current-page"
                        type="number"
                        value={currentPage}
                        onChange={(e) => {
                          const newPage = parseInt(e.target.value) || 0
                          setCurrentPage(newPage)
                          updateBookProgress(newPage)
                        }}
                        min={0}
                        max={selectedBook.pages}
                        className="hover:border-blue-500 transition-colors"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-blue-50 hover:border-blue-500 transition-colors"
                        onClick={() => {
                          if (currentPage < selectedBook.pages) {
                            const newPage = currentPage + 1
                            setCurrentPage(newPage)
                            updateBookProgress(newPage)
                          }
                        }}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center py-8">
                <div className="text-5xl font-bold font-mono mb-8 text-blue-500 transition-transform duration-300 hover:scale-110">
                  {formatTime(time)}
                </div>
                <div className="flex justify-center gap-4">
                  {!isRunning ? (
                    <Button
                      size="lg"
                      className="w-24 bg-green-500 hover:bg-green-600 transition-all duration-300 hover:scale-105"
                      onClick={startSession}
                      disabled={!selectedBook}
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Start
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-24 bg-amber-500 hover:bg-amber-600 transition-all duration-300 hover:scale-105"
                      onClick={pauseSession}
                    >
                      <PauseCircle className="mr-2 h-5 w-5" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-24 transition-all duration-300 hover:scale-105"
                    onClick={endSession}
                    disabled={time === 0}
                  >
                    <StopCircle className="mr-2 h-5 w-5" />
                    End
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group">
                Daily Reading Goal
                <Target className="h-5 w-5 text-green-500 transition-transform duration-300 group-hover:rotate-12" />
              </CardTitle>
              <CardDescription>Set and track your daily reading goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today's Progress</span>
                  <span className="text-muted-foreground">
                    {todayProgress} / {dailyGoal} minutes
                  </span>
                </div>
                <Progress 
                  value={(todayProgress / dailyGoal) * 100} 
                  className="h-2 transition-all duration-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-goal">Set Daily Goal (minutes)</Label>
                <Input
                  id="daily-goal"
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => saveDailyGoal(parseInt(e.target.value) || 30)}
                  min={1}
                  className="hover:border-green-500 transition-colors"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="group hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group">
              Reading History
              <History className="h-5 w-5 text-purple-500 transition-transform duration-300 group-hover:rotate-12" />
            </CardTitle>
            <CardDescription>Your recent reading sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {readingSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <div>
                    <h4 className="font-medium group-hover:text-purple-500 transition-colors">{session.bookTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()} · {formatTime(session.duration)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-purple-500 transition-transform duration-300 group-hover:scale-110">
                      {session.pagesRead} pages
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.startPage} → {session.endPage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
