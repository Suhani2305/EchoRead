import { BookOpen, CheckCircle, Award, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      type: "book_completed",
      title: "Completed 'The Great Gatsby'",
      time: "Today, 10:30 AM",
      icon: CheckCircle,
      iconColor: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
      description: "Finished reading with 92% comprehension score",
    },
    {
      id: 2,
      type: "quiz_completed",
      title: "Completed Chapter 3 Quiz",
      time: "Yesterday, 3:45 PM",
      icon: Award,
      iconColor: "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
      description: "Scored 9/10 on 'To Kill a Mockingbird' quiz",
    },
    {
      id: 3,
      type: "reading_session",
      title: "Reading Session",
      time: "Yesterday, 9:15 AM",
      icon: Clock,
      iconColor: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
      description: "Read for 45 minutes (32 pages)",
    },
    {
      id: 4,
      type: "book_started",
      title: "Started 'Brave New World'",
      time: "Apr 2, 2025",
      icon: BookOpen,
      iconColor: "bg-gradient-to-br from-purple-500 to-violet-600 text-white",
      description: "Added to your current reading list",
    },
  ]

  return (
    <Card className="themed-card">
      <CardHeader className="themed-header">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your reading activity over the past few days</CardDescription>
      </CardHeader>
      <CardContent className="themed-content">
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`mt-0.5 rounded-full p-2 ${activity.iconColor} shadow-md`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
