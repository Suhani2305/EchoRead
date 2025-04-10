"use client"

import { useState } from "react"
import { Search, Filter, Grid, List } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function LibraryView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      cover: "/placeholder.svg?height=280&width=180",
      progress: 100,
      status: "completed",
      category: "Fiction",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      cover: "/placeholder.svg?height=280&width=180",
      progress: 75,
      status: "reading",
      category: "Fiction",
    },
    {
      id: 3,
      title: "Brave New World",
      author: "Aldous Huxley",
      cover: "/placeholder.svg?height=280&width=180",
      progress: 30,
      status: "reading",
      category: "Science Fiction",
    },
    {
      id: 4,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "/placeholder.svg?height=280&width=180",
      progress: 0,
      status: "to-read",
      category: "Fantasy",
    },
    {
      id: 5,
      title: "1984",
      author: "George Orwell",
      cover: "/placeholder.svg?height=280&width=180",
      progress: 0,
      status: "to-read",
      category: "Dystopian",
    },
    {
      id: 6,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "/placeholder.svg?height=280&width=180",
      progress: 100,
      status: "completed",
      category: "Classic",
    },
  ]

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
        <p className="text-muted-foreground">Manage your books and reading progress</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search books..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="reading">Currently Reading</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="to-read">To Read</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                    {book.status === "reading" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                        <Progress value={book.progress} className="h-2" />
                        <p className="text-xs text-center mt-1">{book.progress}% complete</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant={
                          book.status === "completed" ? "default" : book.status === "reading" ? "secondary" : "outline"
                        }
                      >
                        {book.status === "completed" ? "Completed" : book.status === "reading" ? "Reading" : "To Read"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{book.category}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-4 flex gap-4">
                    <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-16 h-24 object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{book.title}</h3>
                        <Badge
                          variant={
                            book.status === "completed"
                              ? "default"
                              : book.status === "reading"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {book.status === "completed"
                            ? "Completed"
                            : book.status === "reading"
                              ? "Reading"
                              : "To Read"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <p className="text-xs text-muted-foreground mt-1">{book.category}</p>
                      {book.status === "reading" && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-1" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="reading">
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {books
              .filter((book) => book.status === "reading")
              .map((book) =>
                viewMode === "grid" ? (
                  <Card key={book.id} className="overflow-hidden">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                        <Progress value={book.progress} className="h-2" />
                        <p className="text-xs text-center mt-1">{book.progress}% complete</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary">Reading</Badge>
                        <span className="text-xs text-muted-foreground">{book.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={book.id}>
                    <CardContent className="p-4 flex gap-4">
                      <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-16 h-24 object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{book.title}</h3>
                          <Badge variant="secondary">Reading</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-xs text-muted-foreground mt-1">{book.category}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {books
              .filter((book) => book.status === "completed")
              .map((book) =>
                viewMode === "grid" ? (
                  <Card key={book.id} className="overflow-hidden">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge>Completed</Badge>
                        <span className="text-xs text-muted-foreground">{book.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={book.id}>
                    <CardContent className="p-4 flex gap-4">
                      <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-16 h-24 object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{book.title}</h3>
                          <Badge>Completed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-xs text-muted-foreground mt-1">{book.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
          </div>
        </TabsContent>
        <TabsContent value="to-read">
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {books
              .filter((book) => book.status === "to-read")
              .map((book) =>
                viewMode === "grid" ? (
                  <Card key={book.id} className="overflow-hidden">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">To Read</Badge>
                        <span className="text-xs text-muted-foreground">{book.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={book.id}>
                    <CardContent className="p-4 flex gap-4">
                      <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-16 h-24 object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{book.title}</h3>
                          <Badge variant="outline">To Read</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-xs text-muted-foreground mt-1">{book.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
