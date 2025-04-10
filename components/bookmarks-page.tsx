"use client"

import { useState } from "react"
import { Search, Plus, BookOpen, Quote, StickyNote, Tag, Calendar, BookMarked } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

// Sample bookmarks data
const bookmarks = [
  {
    id: 1,
    type: "quote",
    content: "So we beat on, boats against the current, borne back ceaselessly into the past.",
    book: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    page: 180,
    chapter: 9,
    date: "Apr 3, 2025",
    tags: ["ending", "reflection", "time"],
  },
  {
    id: 2,
    type: "note",
    content:
      "The green light at the end of Daisy's dock symbolizes Gatsby's hopes and dreams for the future, particularly his hope to be reunited with Daisy.",
    book: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    page: 93,
    chapter: 5,
    date: "Apr 2, 2025",
    tags: ["symbolism", "analysis", "green light"],
  },
  {
    id: 3,
    type: "quote",
    content:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness...",
    book: "A Tale of Two Cities",
    author: "Charles Dickens",
    page: 1,
    chapter: 1,
    date: "Mar 30, 2025",
    tags: ["opening", "contrast", "famous"],
  },
  {
    id: 4,
    type: "note",
    content:
      "The mockingbird symbolizes innocence. To kill a mockingbird is to destroy innocence. Several characters can be seen as mockingbirds, including Tom Robinson and Boo Radley.",
    book: "To Kill a Mockingbird",
    author: "Harper Lee",
    page: 103,
    chapter: 10,
    date: "Mar 28, 2025",
    tags: ["symbolism", "theme", "innocence"],
  },
  {
    id: 5,
    type: "quote",
    content: "All animals are equal, but some animals are more equal than others.",
    book: "Animal Farm",
    author: "George Orwell",
    page: 112,
    chapter: 10,
    date: "Mar 25, 2025",
    tags: ["irony", "politics", "corruption"],
  },
]

export function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get all unique tags from bookmarks
  const allTags = Array.from(new Set(bookmarks.flatMap((bookmark) => bookmark.tags))).sort()

  // Filter bookmarks based on search query and selected tags
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => bookmark.tags.includes(tag))

    const matchesType = activeTab === "all" || activeTab === bookmark.type

    return matchesSearch && matchesTags && matchesType
  })

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="container py-6 pt-16 md:pt-10 space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookmarks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bookmark
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Bookmark</DialogTitle>
              <DialogDescription>Save a quote or note from your reading.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bookmark-type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book" className="text-right">
                  Book
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Textarea id="content" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="page" className="text-right">
                  Page
                </Label>
                <Input id="page" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input id="tags" placeholder="Enter tags separated by commas" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Bookmark</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="text-xs h-6">
            Clear filters
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">
            <BookMarked className="mr-2 h-4 w-4" />
            All Bookmarks
          </TabsTrigger>
          <TabsTrigger value="quote">
            <Quote className="mr-2 h-4 w-4" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="note">
            <StickyNote className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </TabsContent>

        <TabsContent value="quote" className="space-y-4">
          {filteredBookmarks
            .filter((b) => b.type === "quote")
            .map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
        </TabsContent>

        <TabsContent value="note" className="space-y-4">
          {filteredBookmarks
            .filter((b) => b.type === "note")
            .map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookmarkCard({ bookmark }: { bookmark: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">{bookmark.book}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{bookmark.author}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{bookmark.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Page {bookmark.page}</span>
              <span>•</span>
              <span>Chapter {bookmark.chapter}</span>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="flex items-center gap-2 mb-2">
              {bookmark.type === "quote" ? (
                <Badge variant="secondary">Quote</Badge>
              ) : (
                <Badge variant="outline">Note</Badge>
              )}
            </div>

            {bookmark.type === "quote" ? (
              <blockquote className="border-l-4 border-primary pl-4 italic">"{bookmark.content}"</blockquote>
            ) : (
              <p>{bookmark.content}</p>
            )}

            <div className="flex items-center gap-2 mt-4">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
