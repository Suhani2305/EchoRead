import { BookLibrary } from "@/components/book-library"

export default function LibraryPage() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
        <p className="text-muted-foreground">Manage your books and reading lists</p>
      </div>

      <BookLibrary />
    </div>
  )
}
