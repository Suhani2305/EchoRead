import { LearningPath } from "@/components/learning-path"

export default function LearningPathPage() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Path</h1>
        <p className="text-muted-foreground">Your personalized reading journey</p>
      </div>

      <LearningPath />
    </div>
  )
}
