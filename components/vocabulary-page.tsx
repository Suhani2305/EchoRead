"use client"

import { useState } from "react"
import { Search, Plus, BookText, Bookmark, ArrowUpDown, Check, X } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataService, type VocabularyWord } from "@/lib/data-service"

export function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("list")
  const [currentFlashcard, setCurrentFlashcard] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>(dataService.getVocabularyWords())

  // Get books for the select dropdown
  const books = dataService.getBooks()

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedVocabulary = [...vocabularyWords].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const filteredVocabulary = sortedVocabulary.filter(
    (word) =>
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Create flashcards from vocabulary words
  const flashcards = vocabularyWords.map((word) => ({
    id: word.id,
    word: word.word,
    definition: word.definition,
    example: word.example,
  }))

  const nextFlashcard = () => {
    setShowDefinition(false)
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length)
  }

  const prevFlashcard = () => {
    setShowDefinition(false)
    setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition)
  }

  // Add a new vocabulary word
  const addVocabularyWord = (newWord: Partial<VocabularyWord>) => {
    const word: VocabularyWord = {
      id: (vocabularyWords.length + 1).toString(),
      word: newWord.word || "Untitled Word",
      definition: newWord.definition || "No definition provided",
      example: newWord.example || "No example provided",
      partOfSpeech: newWord.partOfSpeech || "noun",
      book: newWord.book || "Unknown Book",
      dateAdded: new Date().toISOString().split("T")[0],
      mastery: "learning",
    }

    setVocabularyWords([...vocabularyWords, word])
  }

  // Update word mastery status
  const updateWordMastery = (wordId: string, mastery: "learning" | "mastered") => {
    setVocabularyWords(
      vocabularyWords.map((word) => {
        if (word.id === wordId) {
          return { ...word, mastery }
        }
        return word
      }),
    )
  }

  return (
    <div className="container py-6 pt-16 md:pt-10 space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vocabulary..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Word
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vocabulary Word</DialogTitle>
              <DialogDescription>Add a new word to your vocabulary list.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                addVocabularyWord({
                  word: formData.get("word") as string,
                  definition: formData.get("definition") as string,
                  example: formData.get("example") as string,
                  partOfSpeech: formData.get("partOfSpeech") as string,
                  book: formData.get("book") as string,
                })
                ;(e.target as HTMLFormElement).reset()
                ;(document.querySelector("[data-dialog-close]") as HTMLButtonElement)?.click()
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="word" className="text-right">
                    Word
                  </Label>
                  <Input id="word" name="word" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="partOfSpeech" className="text-right">
                    Part of Speech
                  </Label>
                  <Select name="partOfSpeech" defaultValue="noun">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select part of speech" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noun">Noun</SelectItem>
                      <SelectItem value="verb">Verb</SelectItem>
                      <SelectItem value="adjective">Adjective</SelectItem>
                      <SelectItem value="adverb">Adverb</SelectItem>
                      <SelectItem value="preposition">Preposition</SelectItem>
                      <SelectItem value="conjunction">Conjunction</SelectItem>
                      <SelectItem value="pronoun">Pronoun</SelectItem>
                      <SelectItem value="interjection">Interjection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="definition" className="text-right">
                    Definition
                  </Label>
                  <Textarea id="definition" name="definition" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="example" className="text-right">
                    Example
                  </Label>
                  <Textarea id="example" name="example" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="book" className="text-right">
                    Book
                  </Label>
                  <Select name="book">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select book" />
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
              </div>
              <DialogFooter>
                <Button type="submit">Add Word</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list">
            <BookText className="mr-2 h-4 w-4" />
            Word List
          </TabsTrigger>
          <TabsTrigger value="flashcards">
            <Bookmark className="mr-2 h-4 w-4" />
            Flashcards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary List</CardTitle>
              <CardDescription>{filteredVocabulary.length} words in your vocabulary</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort("word")}>
                      <div className="flex items-center">
                        Word
                        {sortColumn === "word" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("definition")}>
                      <div className="flex items-center">
                        Definition
                        {sortColumn === "definition" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="hidden md:table-cell w-[150px] cursor-pointer"
                      onClick={() => handleSort("book")}
                    >
                      <div className="flex items-center">
                        Book
                        {sortColumn === "book" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="hidden md:table-cell w-[120px] cursor-pointer"
                      onClick={() => handleSort("dateAdded")}
                    >
                      <div className="flex items-center">
                        Added
                        {sortColumn === "dateAdded" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-right cursor-pointer" onClick={() => handleSort("mastery")}>
                      <div className="flex items-center justify-end">
                        Status
                        {sortColumn === "mastery" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVocabulary.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">
                        <div>
                          {word.word}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {word.partOfSpeech}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2">{word.definition}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{word.book}</TableCell>
                      <TableCell className="hidden md:table-cell">{word.dateAdded}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={word.mastery === "mastered" ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() =>
                            updateWordMastery(word.id, word.mastery === "mastered" ? "learning" : "mastered")
                          }
                        >
                          {word.mastery === "mastered" ? "Mastered" : "Learning"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards">
          <div className="max-w-2xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-center">Flashcards</CardTitle>
                <CardDescription className="text-center">
                  Card {currentFlashcard + 1} of {flashcards.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-[300px] flex items-center justify-center p-6 bg-muted rounded-md cursor-pointer"
                  onClick={toggleDefinition}
                >
                  <div className="text-center">
                    {!showDefinition ? (
                      <h2 className="text-3xl font-bold">{flashcards[currentFlashcard]?.word}</h2>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">{flashcards[currentFlashcard]?.definition}</h3>
                        <p className="text-muted-foreground italic">"{flashcards[currentFlashcard]?.example}"</p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Click the card to {showDefinition ? "hide" : "show"} the definition
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevFlashcard}>
                  Previous
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateWordMastery(flashcards[currentFlashcard]?.id, "learning")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateWordMastery(flashcards[currentFlashcard]?.id, "mastered")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={nextFlashcard}>Next</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
