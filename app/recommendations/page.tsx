"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function RecommendationsPage() {
  const router = useRouter()
  const [addedBooks, setAddedBooks] = useState<number[]>([])
  
  const recommendations = [
    {
      id: 1,
      title: "Dune",
      author: "Frank Herbert",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
      match: "98%",
      description: "A science fiction masterpiece about power, politics, and human nature.",
      genre: "Science Fiction",
      pages: 412
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
      match: "95%",
      description: "An astronaut wakes up alone on a spacecraft with no memory of how he got there.",
      genre: "Science Fiction",
      pages: 496
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
      match: "92%",
      description: "A classic fantasy adventure about a hobbit's unexpected journey.",
      genre: "Fantasy",
      pages: 366
    },
    {
      id: 4,
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg",
      match: "90%",
      description: "A young man grows to become the most notorious wizard his world has ever seen.",
      genre: "Fantasy",
      pages: 662
    },
    {
      id: 5,
      title: "Foundation",
      author: "Isaac Asimov",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1417900846i/29579.jpg",
      match: "89%",
      description: "A mathematical science predicts the future of human civilization.",
      genre: "Science Fiction",
      pages: 244
    },
    {
      id: 6,
      title: "The Way of Kings",
      author: "Brandon Sanderson",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659905828i/7235533.jpg",
      match: "88%",
      description: "Epic fantasy with unique magic systems and complex characters.",
      genre: "Fantasy",
      pages: 1007
    },
  ]

  const addToReadingList = (book: typeof recommendations[0]) => {
    // Add to currently reading in My Library
    const existingBooks = JSON.parse(localStorage.getItem('reading-list') || '[]')
    const newBook = {
      ...book,
      status: 'reading',
      currentPage: 0,
      dateAdded: new Date().toISOString()
    }
    
    localStorage.setItem('reading-list', JSON.stringify([...existingBooks, newBook]))
    setAddedBooks(prev => [...prev, book.id])
    
    toast.success('Added to Reading List', {
      description: `${book.title} has been added to your Currently Reading list`
    })
  }

  return (
    <div className="container py-6 pt-16 md:pt-10 md:py-10 space-y-8 max-w-7xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommended Books</h1>
          <p className="text-muted-foreground">Personalized book recommendations based on your reading history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((book) => (
          <Card key={book.id} className="flex flex-col">
            <CardHeader className="flex-row gap-4 space-y-0">
              <div className="w-[130px] flex-shrink-0">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full aspect-[2/3] object-cover rounded-md shadow-md"
                />
              </div>
              <div className="space-y-1">
                <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 px-2 py-1 rounded-full">
                    {book.match} match
                  </span>
                  <span className="text-xs text-muted-foreground">{book.genre}</span>
                </div>
                <p className="text-xs text-muted-foreground">{book.pages} pages</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">{book.description}</p>
              <Button 
                className="w-full" 
                onClick={() => addToReadingList(book)}
                disabled={addedBooks.includes(book.id)}
                variant={addedBooks.includes(book.id) ? "secondary" : "default"}
              >
                {addedBooks.includes(book.id) ? 'Added to Reading List' : 'Add to Reading List'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 