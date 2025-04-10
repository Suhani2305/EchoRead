import { ReadingStats } from "@/components/reading-stats"

export default function StatsPage() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reading Stats</h1>
        <p className="text-muted-foreground">Track your reading progress and performance</p>
      </div>

      <ReadingStats />
    </div>
  )
}
