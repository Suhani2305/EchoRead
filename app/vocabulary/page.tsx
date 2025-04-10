import { VocabularyPage as VocabularyPageComponent } from "@/components/vocabulary-page"

export default function VocabularyPage() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vocabulary Builder</h1>
        <p className="text-muted-foreground">Track and expand your vocabulary</p>
      </div>

      <VocabularyPageComponent />
    </div>
  )
}
