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
    const allBooks = dataService.getBooks()
    const booksWithDescription = allBooks.map(book => ({
      ...book,
      description: `A ${book.genre} book by ${book.author} with ${book.pages} pages.`
    }))
    setBooks(booksWithDescription)

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
        <div className="mb-12 animate-fade-in text-left">
          <h1 className="text-4xl font-bold mb-4 text-black">Book Quizzes</h1>
          <p className="text-muted-foreground max-w-2xl">
            Test your knowledge and understanding of your favorite books through our interactive quizzes.
          </p>
        </div>

        {!selectedBook && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition duration-300">
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
                  <span className="text-2xl font-bold text-purple-600">
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

            <Card className="hover:shadow-lg transition duration-300">
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
                        <span className="text-sm font-semibold text-purple-600">{data.score}%</span>
                      </div>
                    ) : null
                  })}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(books.map(book => book.genre))).map((genre) => (
                    <div
                      key={genre}
                      className="px-3 py-1 rounded-full bg-purple-100 text-sm text-purple-700"
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
                <Card key={book.id} className="transition duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-foreground">
                        {book.title}
                      </CardTitle>
                      {bookScore !== null && (
                        <div className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                          <Trophy className="h-4 w-4" />
                          <span className="font-medium">{bookScore}%</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      className="w-full bg-purple-600 text-white hover:bg-purple-700 transition duration-200 shadow-md"
                    >
                      {bookScore !== null ? "Retake Quiz" : "Start Quiz"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-lg text-muted-foreground">
            {/* Quiz rendering continues... */}
            {selectedBook && !showResults && (
  <Card className="max-w-3xl mx-auto p-6 animate-fade-in shadow-lg">
    <CardHeader>
      <CardTitle className="text-2xl text-left text-foreground mb-2">
        {selectedBook.title} - Question {currentQuestion + 1}/10
      </CardTitle>
      <Progress value={((currentQuestion + 1) / 10) * 100} className="h-2 bg-muted" />
    </CardHeader>
    <CardContent className="space-y-6 mt-4">
      <p className="text-lg text-left text-black font-medium">
        {getQuizForBook(selectedBook)?.questions[currentQuestion].question}
      </p>
      <div className="grid grid-cols-1 gap-4">
        {getQuizForBook(selectedBook)?.questions[currentQuestion].options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = getQuizForBook(selectedBook)?.questions[currentQuestion].correctAnswer === index
          const isWrong = isSelected && !isCorrect

          return (
            <Button
              key={index}
              variant="outline"
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswer(index)}
              className={`w-full justify-start px-4 py-2 text-left transition duration-200 border rounded-lg 
                ${isSelected ? (isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500") : ""}
                hover:bg-purple-50`}
            >
              {option}
              {isSelected && (
                <span className="ml-auto">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </span>
              )}
            </Button>
          )
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="text-right">
          <Button
            onClick={nextQuestion}
            className="bg-purple-600 text-white hover:bg-purple-700 transition duration-200"
          >
            {currentQuestion < 9 ? "Next" : "Finish"}
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
)}

{selectedBook && showResults && (
  <Card className="max-w-xl mx-auto p-6 animate-fade-in shadow-lg mt-8 text-center">
    <CardHeader>
      <CardTitle className="text-2xl text-black">Quiz Completed!</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-xl font-semibold text-purple-600">Your Score: {score}/10</p>
      <Progress value={(score / 10) * 100} className="h-2 bg-muted" />
      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={retakeQuiz} className="bg-purple-600 text-white hover:bg-purple-700">
          <RotateCcw className="h-4 w-4 mr-2" /> Retake Quiz
        </Button>
        <Button variant="outline" onClick={resetQuiz}>
          Back to Books
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
