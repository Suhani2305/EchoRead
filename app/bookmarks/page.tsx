import { BookmarksPage as BookmarksPageComponent } from "@/components/bookmarks-page"

export default function BookmarksPage() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
        <p className="text-muted-foreground">Save and organize important quotes and notes</p>
      </div>

      <BookmarksPageComponent />
    </div>
  )
}
