"use client"

import { useState } from "react"
import { BookText, Search, Filter, Plus, Volume2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function VocabularyView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const vocabularyWords = [
    {
      id: 1,
      word: "Ephemeral",
      definition: "Lasting for a very short time",
      example: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
      book: "The Great Gatsby",
      date: "Apr 3, 2025",
      mastery: "learning",
    },
    {
      id: 2,
      word: "Ubiquitous",
      definition: "Present, appearing, or found everywhere",
      example: "Smartphones have become ubiquitous in modern society.",
      book: "Brave New World",
      date: "Apr 2, 2025",
      mastery: "learning",
    },
    {
      id: 3,
      word: "Sycophant",
      definition: "A person who acts obsequiously toward someone important to gain advantage",
      example: "He was surrounded by sycophants who agreed with everything he said.",
      book: "1984",
      date: "Mar 30, 2025",
      mastery: "new",
    },
    {
      id: 4,
      word: "Mellifluous",
      definition: "Sweet or musical; pleasant to hear",
      example: "She spoke in a mellifluous voice that captivated the audience.",
      book: "Pride and Prejudice",
      date: "Mar 28, 2025",
      mastery: "mastered",
    },
    {
      id: 5,
      word: "Pernicious",
      definition: "Having a harmful effect, especially in a gradual or subtle way",
      example: "The pernicious effects of the drug were not immediately apparent.",
      book: "To Kill a Mockingbird",
      date: "Mar 25, 2025",
      mastery: "mastered",
    },
    {
      id: 6,
      word: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing",
      example: "Her eloquent speech moved the audience to tears.",
      book: "The Great Gatsby",
      date: "Mar 20, 2025",
      mastery: "mastered",
    },
  ]

  const filteredWords = vocabularyWords.filter(
    (word) =>
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedWords = [...filteredWords].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "alphabetical") {
      return a.word.localeCompare(b.word)
    } else {
      return 0
    }
  })

  const wordsByMastery = {
    new: sortedWords.filter((word) => word.mastery === "new"),
    learning: sortedWords.filter((word) => word.mastery === "learning"),
    mastered: sortedWords.filter((word) => word.mastery === "mastered"),
  }

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-7xl">
      <div className="flex items-center gap-2">
        <BookText className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Vocabulary Builder</h1>
      </div>
      <p className="text-muted-foreground">Track and learn new words from your reading</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search words..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Word
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Word</DialogTitle>
                <DialogDescription>Add a new word to your vocabulary list</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="word">Word</Label>
                  <Input id="word" placeholder="Enter word" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="definition">Definition</Label>
                  <Textarea id="definition" placeholder="Enter definition" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="example">Example</Label>
                  <Textarea id="example" placeholder="Enter example sentence" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="book">Book</Label>
                  <Select>
                    <SelectTrigger id="book">
                      <SelectValue placeholder="Select book" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="the-great-gatsby">The Great Gatsby</SelectItem>
                      <SelectItem value="to-kill-a-mockingbird">To Kill a Mockingbird</SelectItem>
                      <SelectItem value="1984">1984</SelectItem>
                      <SelectItem value="brave-new-world">Brave New World</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Word</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Words</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="mastered">Mastered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wordsByMastery.new.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wordsByMastery.learning.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mastered" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wordsByMastery.mastered.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WordCard({ word }: { word: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{word.word}</CardTitle>
            <CardDescription>Added on {word.date}</CardDescription>
          </div>
          <Badge
            variant={word.mastery === "mastered" ? "default" : word.mastery === "learning" ? "secondary" : "outline"}
          >
            {word.mastery === "mastered" ? "Mastered" : word.mastery === "learning" ? "Learning" : "New"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>{word.definition}</p>
        <p className="text-sm italic">"{word.example}"</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <BookText className="h-3 w-3" />
          <span>{word.book}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Volume2 className="mr-2 h-3 w-3" />
          Pronounce
        </Button>
        <Select defaultValue={word.mastery}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="mastered">Mastered</SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )
}
