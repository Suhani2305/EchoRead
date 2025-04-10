"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function RecommendedBooks() {
  const router = useRouter()
  
  const books = [
    {
      id: 1,
      title: "Dune",
      author: "Frank Herbert",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
      match: "98%",
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
      match: "95%",
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
      match: "92%",
    },
  ]

  const handleViewMore = () => {
    router.push("/recommendations")
  }

  return (
    <Card className="themed-card">
      <CardHeader className="themed-header">
        <CardTitle>Recommended Books</CardTitle>
        <CardDescription>Based on your reading preferences</CardDescription>
      </CardHeader>
      <CardContent className="themed-content">
        <div className="space-y-4">
          {books.map((book, index) => (
            <div
              key={book.id}
              className="flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-15 w-10 object-cover rounded shadow-md"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  AI
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </div>
              <div className="text-xs font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 px-2 py-1 rounded-full">
                {book.match} match
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={handleViewMore}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            View More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
