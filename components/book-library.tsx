"use client"

import { useState, useEffect } from "react"
import { Search, Plus, BookOpen, CheckCircle, Clock, Filter, Image, BookOpenCheck, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function BookLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("reading")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [books, setBooks] = useState<any[]>([])
  const [previewCover, setPreviewCover] = useState("")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [updateProgress, setUpdateProgress] = useState(false)
  const [currentPageInput, setCurrentPageInput] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<any>(null)

  // Load books from localStorage
  useEffect(() => {
    const loadBooks = () => {
      const savedBooks = JSON.parse(localStorage.getItem('reading-list') || '[]')
      setBooks(savedBooks)
    }

    loadBooks()
    // Listen for storage changes from other components
    window.addEventListener('storage', loadBooks)
    return () => window.removeEventListener('storage', loadBooks)
  }, [])

  // Filter books based on search query, status, and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = book.status === activeTab

    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre

    return matchesSearch && matchesStatus && matchesGenre
  })

  // Get unique genres for filter
  const genres = Array.from(new Set(books.map((book) => book.genre)))

  // Add a new book
  const addBook = (newBook: Partial<any>) => {
    const book: any = {
      id: (books.length + 1).toString(),
      title: newBook.title || "Untitled Book",
      author: newBook.author || "Unknown Author",
      cover: newBook.cover || "/placeholder.svg?height=200&width=150",
      genre: newBook.genre || "Fiction",
      pages: newBook.pages || 0,
      status: newBook.status || "to-read",
      dateAdded: new Date().toISOString().split("T")[0],
    }

    setBooks([...books, book])
    localStorage.setItem('reading-list', JSON.stringify([...books, book]))
    toast.success('Book Added', {
      description: `${book.title} has been added to your library`
    })
  }

  // Preview cover image
  const handleCoverUrlChange = (url: string) => {
    setPreviewCover(url)
  }

  // Update book status
  const updateBookStatus = (bookId: string, newStatus: "reading" | "completed" | "to-read") => {
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          status: newStatus,
          dateCompleted: newStatus === "completed" ? new Date().toISOString() : book.dateCompleted,
        }
      }
      return book
    })
    setBooks(updatedBooks)
    localStorage.setItem('reading-list', JSON.stringify(updatedBooks))
  }

  // Update reading progress
  const updateReadingProgress = (bookId: string, currentPage: number) => {
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          currentPage: Math.min(currentPage, book.pages),
          status: currentPage >= book.pages ? "completed" : "reading",
          dateCompleted: currentPage >= book.pages ? new Date().toISOString() : book.dateCompleted,
        }
      }
      return book
    })
    setBooks(updatedBooks)
    localStorage.setItem('reading-list', JSON.stringify(updatedBooks))
    
    if (currentPage >= (selectedBook?.pages || 0)) {
      toast.success('Book Completed! 🎉', {
        description: `Congratulations on finishing ${selectedBook?.title}!`
      })
    } else {
      toast.success('Progress Updated', {
        description: `Your progress has been saved: ${currentPage}/${selectedBook?.pages} pages`
      })
    }
  }

  // Remove book
  const removeBook = (bookId: string) => {
    const updatedBooks = books.filter(book => book.id !== bookId)
    setBooks(updatedBooks)
    localStorage.setItem('reading-list', JSON.stringify(updatedBooks))
    toast.success('Book Removed', {
      description: `${bookToDelete?.title} has been removed from your library`
    })
    setShowDeleteDialog(false)
    setBookToDelete(null)
  }

  return (
    <div className="container py-6 pt-16 md:pt-10 space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedGenre} onValueChange={(value) => setSelectedGenre(value)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{selectedGenre === "all" ? "All Genres" : selectedGenre}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog onOpenChange={() => setPreviewCover("")}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Add a new book to your library.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                addBook({
                  title: formData.get("title") as string,
                  author: formData.get("author") as string,
                  genre: formData.get("genre") as string,
                  pages: Number(formData.get("pages")),
                  status: formData.get("status") as "reading" | "completed" | "to-read",
                  cover: formData.get("cover") as string || "/placeholder.svg?height=200&width=150",
                })
                setPreviewCover("")
                ;(e.target as HTMLFormElement).reset()
                ;(document.querySelector("[data-dialog-close]") as HTMLButtonElement)?.click()
              }}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <div className="w-[120px] flex-shrink-0">
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-muted">
                    {previewCover ? (
                      <img 
                        src={previewCover} 
                        alt="Cover preview" 
                        className="w-full h-full object-cover"
                        onError={() => setPreviewCover("")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="cover">Cover Image URL</Label>
                    <Input 
                      id="cover" 
                      name="cover" 
                      type="url" 
                      placeholder="https://..."
                      onChange={(e) => handleCoverUrlChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" name="author" required />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Select name="genre" defaultValue="fiction">
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="science-fiction">Science Fiction</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="biography">Biography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pages">Number of Pages</Label>
                  <Input id="pages" name="pages" type="number" min="1" required />
                </div>
                <div>
                  <Label htmlFor="status">Reading Status</Label>
                  <Select name="status" defaultValue="to-read">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-read">To Read</SelectItem>
                      <SelectItem value="reading">Currently Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Book</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={updateProgress} onOpenChange={setUpdateProgress}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5" />
              Update Reading Progress
            </DialogTitle>
            <DialogDescription>
              Update your current page for "{selectedBook?.title}"
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (currentPageInput && selectedBook) {
              updateReadingProgress(selectedBook.id, parseInt(currentPageInput))
              setUpdateProgress(false)
              setSelectedBook(null)
              setCurrentPageInput("")
            }
          }}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Label htmlFor="current-page">Current Page</Label>
                  <span className="text-muted-foreground">Total: {selectedBook?.pages} pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="current-page"
                    type="number"
                    min="1"
                    max={selectedBook?.pages}
                    value={currentPageInput}
                    onChange={(e) => setCurrentPageInput(e.target.value)}
                    placeholder={selectedBook?.currentPage?.toString() || "0"}
                    required
                  />
                  <span className="text-muted-foreground whitespace-nowrap">/ {selectedBook?.pages}</span>
                </div>
                {selectedBook && (
                  <Progress 
                    value={((parseInt(currentPageInput) || selectedBook?.currentPage || 0) / selectedBook.pages) * 100} 
                    className="h-2"
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!currentPageInput}>Update Progress</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Remove Book
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{bookToDelete?.title}" from your library? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteDialog(false)
                setBookToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeBook(bookToDelete?.id)}
            >
              Remove Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="reading" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="reading">
            <BookOpen className="mr-2 h-4 w-4" />
            Currently Reading
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="to-read">
            <Clock className="mr-2 h-4 w-4" />
            To Read
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reading">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-0">
                    <div className="flex p-4">
                      <div className="mr-4">
                        <img
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          className="w-20 h-30 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setBookToDelete(book)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{book.genre}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {book.currentPage || 0} / {book.pages} pages
                          </span>
                        </div>
                        <Progress value={((book.currentPage || 0) / book.pages) * 100} className="h-2" />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1" 
                          onClick={() => {
                            setSelectedBook(book)
                            setCurrentPageInput(book.currentPage?.toString() || "")
                            setUpdateProgress(true)
                          }}
                        >
                          Update Progress
                        </Button>
                        <Button className="flex-1" onClick={() => updateBookStatus(book.id, "completed")}>
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No books found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || selectedGenre
                  ? "Try adjusting your search or filters"
                  : "Add books to your reading list to get started"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-0">
                    <div className="flex p-4">
                      <div className="mr-4">
                        <img
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          className="w-20 h-30 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setBookToDelete(book)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{book.genre}</Badge>
                          {book.dateCompleted && (
                            <span className="text-xs text-muted-foreground">
                              Completed on {new Date(book.dateCompleted).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => updateBookStatus(book.id, "reading")}
                        >
                          Read Again
                        </Button>
                        <Button className="flex-1">Write Review</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No completed books</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || selectedGenre
                  ? "Try adjusting your search or filters"
                  : "Complete books to see them here"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="to-read">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-0">
                    <div className="flex p-4">
                      <div className="mr-4">
                        <img
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          className="w-20 h-30 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setBookToDelete(book)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{book.genre}</Badge>
                          <span className="text-xs text-muted-foreground">{book.pages} pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <Button className="w-full" onClick={() => updateBookStatus(book.id, "reading")}>
                        Start Reading
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No books in your reading list</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || selectedGenre
                  ? "Try adjusting your search or filters"
                  : "Add books to your reading list to get started"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
