import { AIInsightsPage } from "@/components/ai-insights-page"

export default function InsightsPage() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground">Personalized reading insights and recommendations</p>
      </div>

      <AIInsightsPage />
    </div>
  )
}
