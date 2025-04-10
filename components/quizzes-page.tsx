"use client"

import { useState, useEffect } from "react"
import { Book, Quiz } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, RotateCcw, BookOpen, Trophy, Brain } from "lucide-react"
import { quizzes, dataService } from "@/lib/data-service"

interface BookWithDescription extends Book {
  description: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export default function QuizzesPage() {
  const [books, setBooks] = useState<BookWithDescription[]>([])
  const [selectedBook, setSelectedBook] = useState<BookWithDescription | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizHistory, setQuizHistory] = useState<{ [key: string]: { date: string; score: number } }>({})
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    // Load books from data service and localStorage
    const allBooks = dataService.getBooks()
    const booksWithDescription = allBooks.map(book => ({
      ...book,
      description: `A ${book.genre} book by ${book.author} with ${book.pages} pages.`
    }))
    setBooks(booksWithDescription)

    // Load quiz history from localStorage
    const storedHistory = localStorage.getItem("quizHistory")
    if (storedHistory) {
      setQuizHistory(JSON.parse(storedHistory))
    }
  }, [])

  const startQuiz = (book: BookWithDescription) => {
    setSelectedBook(book)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResults(false)
    setAnswers({})
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setAnswers({ ...answers, [currentQuestion]: answerIndex })

    const quiz = quizzes.find((q: Quiz) => q.bookId === selectedBook?.id)
    if (quiz && answerIndex === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    if (!selectedBook) return

    const percentage = (score / 10) * 100
    const date = new Date().toISOString().split("T")[0]

    const newHistory = {
      ...quizHistory,
      [selectedBook.id]: { date, score: percentage },
    }

    setQuizHistory(newHistory)
    localStorage.setItem("quizHistory", JSON.stringify(newHistory))
    setShowResults(true)
  }

  const retakeQuiz = () => {
    if (!selectedBook) return
    startQuiz(selectedBook)
  }

  const resetQuiz = () => {
    setSelectedBook(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResults(false)
    setAnswers({})
  }

  const getQuizForBook = (book: BookWithDescription) => {
    return quizzes.find((q: Quiz) => q.bookId === book.id)
  }

  const getBookScore = (bookId: string) => {
    return quizHistory[bookId]?.score || null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="text-center mb-12 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-4 gradient-text">Book Quizzes</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge and understanding of your favorite books through our interactive quizzes.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        {!selectedBook && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="themed-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Quiz Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-2xl font-bold text-foreground">{Object.keys(quizHistory).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="text-2xl font-bold gradient-text">
                    {Object.values(quizHistory).length > 0
                      ? (
                          Object.values(quizHistory).reduce((acc, curr) => acc + curr.score, 0) /
                          Object.values(quizHistory).length
                        ).toFixed(0)
                      : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="themed-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(quizHistory)
                  .sort((a, b) => new Date(b[1].date).getTime() - new Date(a[1].date).getTime())
                  .slice(0, 2)
                  .map(([bookId, data]) => {
                    const book = books.find(b => b.id === bookId)
                    return book ? (
                      <div key={bookId} className="flex justify-between items-center p-2 rounded-lg bg-secondary/30">
                        <div>
                          <p className="font-medium text-sm text-foreground">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{data.date}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">{data.score}%</span>
                      </div>
                    ) : null
                  })}
              </CardContent>
            </Card>

            <Card className="themed-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(books.map(book => book.genre))).map((genre) => (
                    <div
                      key={genre}
                      className="px-3 py-1 rounded-full bg-secondary/50 text-sm text-foreground"
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedBook ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {books.map((book, idx) => {
              const quiz = getQuizForBook(book)
              const bookScore = getBookScore(book.id)

              if (!quiz) return null

              return (
                <div
                  key={book.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Card className="themed-card group">
                    <CardHeader className="themed-header space-y-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {book.title}
                        </CardTitle>
                        {bookScore !== null && (
                          <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                            <Trophy className="h-4 w-4" />
                            <span className="font-medium">{bookScore}%</span>
                          </div>
                        )}
                      </div>
                      <div className="h-1 w-full bg-gradient-to-r from-primary to-accent rounded-full transform origin-left group-hover:scale-x-110 transition-transform" />
                    </CardHeader>
                    <CardContent className="themed-content space-y-4">
                      <p className="text-muted-foreground">{book.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{book.pages} pages</span>
                        </div>
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-1" />
                          <span>{quiz.questions.length} questions</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => startQuiz(book)}
                        className="w-full gradient-button"
                      >
                        {bookScore !== null ? "Retake Quiz" : "Start Quiz"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto animate-scale-in">
            {!showResults ? (
              <Card className="themed-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl gradient-text">{selectedBook.title}</span>
                    <span className="text-sm font-medium px-4 py-2 bg-primary/10 text-primary rounded-full">
                      Question {currentQuestion + 1} of 10
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Progress 
                      value={((currentQuestion + 1) / 10) * 100} 
                      className="h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
                    />
                  </div>

                  <div key={currentQuestion} className="animate-slide-right">
                    <h3 className="text-xl font-semibold mb-6 text-foreground">
                      {quizzes.find((q: Quiz) => q.bookId === selectedBook.id)?.questions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {quizzes
                        .find((q: Quiz) => q.bookId === selectedBook.id)
                        ?.questions[currentQuestion].options.map((option: string, index: number) => {
                          const isSelected = selectedAnswer === index
                          const isCorrect =
                            index ===
                            quizzes.find((q: Quiz) => q.bookId === selectedBook.id)?.questions[currentQuestion]
                              .correctAnswer

                          return (
                            <div
                              key={index}
                              className="animate-fade-in"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <Button
                                onClick={() => handleAnswer(index)}
                                className={`w-full justify-start p-4 h-auto text-left ${
                                  selectedAnswer !== null
                                    ? isCorrect
                                      ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                      : isSelected
                                      ? "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
                                      : "bg-card"
                                    : "hover:bg-secondary transition-colors"
                                }`}
                                variant={selectedAnswer !== null ? "outline" : "default"}
                              >
                                {selectedAnswer !== null && (
                                  <span className="mr-3">
                                    {isCorrect ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : isSelected ? (
                                      <XCircle className="h-5 w-5 text-destructive" />
                                    ) : null}
                                  </span>
                                )}
                                {option}
                              </Button>
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  {selectedAnswer !== null && (
                    <div className="animate-fade-in">
                      <Button
                        onClick={nextQuestion}
                        className="w-full mt-6 gradient-button"
                      >
                        {currentQuestion < 9 ? "Next Question" : "Complete Quiz"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="themed-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl gradient-text">Quiz Results</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-8 animate-scale-in">
                    <div className="relative inline-block">
                      <div className="text-7xl font-bold gradient-text mb-2">
                        {((score / 10) * 100).toFixed(0)}%
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-10 blur-2xl" />
                    </div>
                    <div className="text-muted-foreground text-lg">
                      {score} out of 10 questions correct
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {quizzes
                      .find((q: Quiz) => q.bookId === selectedBook.id)
                      ?.questions.map((question: QuizQuestion, index: number) => {
                        const userAnswer = answers[index]
                        const isCorrect = userAnswer === question.correctAnswer

                        return (
                          <div
                            key={index}
                            className="animate-slide-left"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className={`p-4 rounded-lg border-2 ${
                              isCorrect ? "bg-green-100 border-green-200" : "bg-destructive/10 border-destructive/30"
                            }`}>
                              <div className="flex items-center mb-2">
                                {isCorrect ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-destructive mr-2" />
                                )}
                                <span className="font-semibold text-foreground">
                                  Question {index + 1}
                                </span>
                              </div>
                              <p className="text-foreground mb-2">{question.question}</p>
                              <p className="text-sm">
                                Your answer:{" "}
                                <span className={isCorrect ? "text-green-600 font-medium" : "text-destructive font-medium"}>
                                  {question.options[userAnswer]}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm mt-1">
                                  Correct answer:{" "}
                                  <span className="text-green-600 font-medium">
                                    {question.options[question.correctAnswer]}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={resetQuiz}
                      className="flex-1 hover:bg-secondary"
                      variant="outline"
                    >
                      Back to Quizzes
                    </Button>
                    <Button
                      onClick={retakeQuiz}
                      className="flex-1 gradient-button"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
