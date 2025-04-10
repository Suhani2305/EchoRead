"use client"

import { useState } from "react"
import { GraduationCap, BookOpen, CheckCircle, XCircle, Clock, Award, ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function QuizzesView() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizResults, setQuizResults] = useState<{ correct: boolean; selectedAnswer: string | null }[]>([])

  const availableQuizzes = [
    {
      id: 1,
      title: "The Great Gatsby",
      description: "Chapter 1-3 Comprehension",
      questions: 10,
      difficulty: "Medium",
      estimatedTime: "15 min",
      status: "available",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      description: "Character Analysis",
      questions: 8,
      difficulty: "Hard",
      estimatedTime: "12 min",
      status: "available",
    },
    {
      id: 3,
      title: "Brave New World",
      description: "Themes and Symbolism",
      questions: 12,
      difficulty: "Hard",
      estimatedTime: "20 min",
      status: "available",
    },
    {
      id: 4,
      title: "1984",
      description: "Plot and Setting",
      questions: 10,
      difficulty: "Medium",
      estimatedTime: "15 min",
      status: "locked",
    },
  ]

  const completedQuizzes = [
    {
      id: 101,
      title: "Pride and Prejudice",
      description: "Character Relationships",
      score: 90,
      date: "Apr 2, 2025",
    },
    {
      id: 102,
      title: "The Great Gatsby",
      description: "Themes and Motifs",
      score: 75,
      date: "Mar 28, 2025",
    },
    {
      id: 103,
      title: "To Kill a Mockingbird",
      description: "Plot Comprehension",
      score: 85,
      date: "Mar 20, 2025",
    },
  ]

  const currentQuiz = {
    title: "The Great Gatsby",
    description: "Chapter 1-3 Comprehension",
    questions: [
      {
        id: 1,
        question: "Who is the narrator of The Great Gatsby?",
        options: ["Jay Gatsby", "Nick Carraway", "Daisy Buchanan", "Tom Buchanan"],
        correctAnswer: "Nick Carraway",
      },
      {
        id: 2,
        question: "Where does Nick Carraway live?",
        options: ["East Egg", "West Egg", "New York City", "Louisville"],
        correctAnswer: "West Egg",
      },
      {
        id: 3,
        question: "What color is the light at the end of Daisy's dock?",
        options: ["Red", "Blue", "Green", "Yellow"],
        correctAnswer: "Green",
      },
    ],
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuiz.questions[currentQuestion].correctAnswer
    setQuizResults([...quizResults, { correct: isCorrect, selectedAnswer }])

    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Quiz completed
      setShowResult(true)
    }
  }

  const handleCheckAnswer = () => {
    if (selectedAnswer !== null) {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizResults([])
  }

  const renderQuizContent = () => {
    if (showResult && currentQuestion === currentQuiz.questions.length - 1) {
      // Show final results
      const correctAnswers = quizResults.filter((result) => result.correct).length
      const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100)

      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Quiz Completed!</h2>
            <p className="text-muted-foreground">You scored {score}% on this quiz</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span>
                {correctAnswers} out of {currentQuiz.questions.length} correct
              </span>
            </div>
            <Progress value={score} className="h-2" />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Question Summary</h3>
            {currentQuiz.questions.map((question, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {quizResults[index]?.correct ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm text-muted-foreground">
                    Your answer:{" "}
                    <span className={quizResults[index]?.correct ? "text-green-600" : "text-red-600"}>
                      {quizResults[index]?.selectedAnswer}
                    </span>
                  </p>
                  {!quizResults[index]?.correct && (
                    <p className="text-sm text-green-600">Correct answer: {question.correctAnswer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetQuiz}>
              Try Again
            </Button>
            <Button>Back to Quizzes</Button>
          </div>
        </div>
      )
    }

    const currentQ = currentQuiz.questions[currentQuestion]

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </p>
            <Progress value={((currentQuestion + 1) / currentQuiz.questions.length) * 100} className="h-2 mt-2" />
          </div>
        </div>

        <div className="py-4">
          <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>

          <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isCorrect = option === currentQ.correctAnswer
                const isSelected = option === selectedAnswer

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 border p-3 rounded-lg ${
                      showResult && isSelected && !isCorrect ? "border-red-500 bg-red-50" : ""
                    } ${showResult && isCorrect ? "border-green-500 bg-green-50" : ""} ${
                      !showResult ? "hover:bg-muted cursor-pointer" : ""
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} disabled={showResult} />
                    <Label
                      htmlFor={`option-${index}`}
                      className={`flex-1 cursor-pointer ${showResult && isCorrect ? "font-medium" : ""}`}
                    >
                      {option}
                    </Label>
                    {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          {!showResult ? (
            <Button onClick={handleCheckAnswer} disabled={selectedAnswer === null}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < currentQuiz.questions.length - 1 ? (
                <>
                  Next Question <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-7xl">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
      </div>
      <p className="text-muted-foreground">Test your comprehension with interactive quizzes</p>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available Quizzes</TabsTrigger>
          <TabsTrigger value="active">Active Quiz</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableQuizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{quiz.title}</CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </div>
                    {quiz.status === "locked" ? <Badge variant="outline">Locked</Badge> : <Badge>Available</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{quiz.estimatedTime}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={quiz.status === "locked"}>
                    Start Quiz
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentQuiz.title}</CardTitle>
              <CardDescription>{currentQuiz.description}</CardDescription>
            </CardHeader>
            <CardContent>{renderQuizContent()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedQuizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{quiz.title}</CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </div>
                    <div className="text-2xl font-bold">{quiz.score}%</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={quiz.score} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed on {quiz.date}</span>
                      <span
                        className={
                          quiz.score >= 80 ? "text-green-600" : quiz.score >= 60 ? "text-amber-600" : "text-red-600"
                        }
                      >
                        {quiz.score >= 80 ? "Excellent" : quiz.score >= 60 ? "Good" : "Needs Improvement"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Review Quiz
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
