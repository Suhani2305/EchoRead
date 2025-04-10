import { ReadingTimer } from "@/components/reading-timer"

export default function TimerPage() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reading Timer</h1>
        <p className="text-muted-foreground">Track your reading sessions and set goals</p>
      </div>

      <ReadingTimer />
    </div>
  )
}
