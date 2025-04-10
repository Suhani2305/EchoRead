import { BookOpen, Clock, BarChart2, Award } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function ReadingMetrics() {
  const metrics = [
    {
      title: "Total Books Read",
      value: "24",
      change: "+3 this month",
      icon: BookOpen,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      textColor: "text-emerald-500",
    },
    {
      title: "Daily Reading Time",
      value: "45 min",
      change: "+12% vs last week",
      icon: Clock,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      textColor: "text-blue-500",
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+5% this month",
      icon: BarChart2,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      textColor: "text-purple-500",
    },
    {
      title: "Quiz Performance",
      value: "92%",
      change: "+3% vs last quiz",
      icon: Award,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-amber-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="themed-card">
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <span className={`text-xs ${metric.textColor}`}>{metric.change}</span>
                </div>
              </div>
              <div className={`p-2 rounded-full ${metric.color} text-white`}>
                <metric.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
