"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { dataService } from "@/lib/data-service"
import { Progress } from "@/components/ui/progress"
import { BookOpen, TrendingUp, Calendar, Clock, BookMarked, Award, Sparkles } from "lucide-react"

export function ReadingStats() {
  const [books, setBooks] = useState<any[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadBooks = () => {
      const savedBooks = JSON.parse(localStorage.getItem('reading-list') || '[]')
      setBooks(savedBooks)
      setIsLoaded(true)
    }

    loadBooks()
    window.addEventListener('storage', loadBooks)
    return () => window.removeEventListener('storage', loadBooks)
  }, [])

  // Calculate statistics
  const totalBooks = books.length
  const completedBooks = books.filter(book => book.status === "completed").length
  const currentlyReading = books.filter(book => book.status === "reading").length
  const toRead = books.filter(book => book.status === "to-read").length

  // Calculate total pages read
  const totalPagesRead = books.reduce((total, book) => {
    return total + (book.currentPage || 0)
  }, 0)

  // Calculate reading streak (dummy data for now)
  const streak = 5

  // Calculate reading time distribution (dummy data)
  const readingTimeData = {
    morning: 35,
    afternoon: 45,
    evening: 20
  }

  // Calculate genre distribution
  const genreData = books.reduce((acc: Record<string, number>, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1
    return acc
  }, {})

  // Prepare data for pie chart
  const pieChartData = Object.entries(genreData).map(([name, value]) => ({
    name,
    value
  }))

  // Colors for pie chart
  const GENRE_COLORS = {
    'Fiction': '#3B82F6',
    'Non-Fiction': '#22C55E',
    'Science Fiction': '#A855F7',
    'Fantasy': '#F59E0B',
    'Mystery': '#EF4444',
    'Biography': '#14B8A6',
    'Other': '#6B7280'
  }

  // Prepare reading activity data (example data)
  const activityData = [
    { day: 'Mon', pages: 45, hours: 2 },
    { day: 'Tue', pages: 30, hours: 1.5 },
    { day: 'Wed', pages: 60, hours: 3 },
    { day: 'Thu', pages: 25, hours: 1 },
    { day: 'Fri', pages: 50, hours: 2.5 },
    { day: 'Sat', pages: 80, hours: 4 },
    { day: 'Sun', pages: 65, hours: 3.5 }
  ]

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col gap-4">
         
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className={`transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <CardDescription>In your library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform">{totalBooks}</div>
              <div className="absolute right-4 top-4 text-blue-500 group-hover:scale-110 transition-transform">
                <BookMarked className="h-6 w-6" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="text-xs text-muted-foreground">
                  <span className="text-blue-500 font-medium">{completedBooks}</span> completed · 
                  <span className="text-purple-500 font-medium"> {currentlyReading}</span> reading · 
                  <span className="text-emerald-500 font-medium"> {toRead}</span> to read
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`transition-all duration-300 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
              <CardDescription>Total progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform">{totalPagesRead}</div>
              <div className="absolute right-4 top-4 text-indigo-500 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="mt-4">
                <Progress 
                  value={75} 
                  className="h-3 rounded-lg [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:via-purple-500 [&>div]:to-pink-500 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`transition-all duration-300 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
              <CardDescription>Current streak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform">
                {streak} days
                <span className="text-xs text-emerald-500 ml-2">🔥 On Fire!</span>
              </div>
              <div className="absolute right-4 top-4 text-emerald-500 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <div className="mt-4 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      i < 5 
                        ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-300 group-hover:scale-y-125" 
                        : "bg-muted group-hover:bg-muted/70"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`transition-all duration-300 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
              <CardDescription>When you read most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform">Afternoon</div>
              <div className="absolute right-4 top-4 text-purple-500 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <div className="rounded-lg bg-gradient-to-t from-purple-600 via-purple-400 to-fuchsia-300 transition-all duration-500 group-hover:scale-y-110" style={{ height: `${readingTimeData.morning * 0.4}px` }} />
                  <div className="text-[10px] font-medium text-center">AM</div>
                </div>
                <div className="space-y-1">
                  <div className="rounded-lg bg-gradient-to-t from-purple-600 via-purple-400 to-fuchsia-300 transition-all duration-500 group-hover:scale-y-110" style={{ height: `${readingTimeData.afternoon * 0.4}px` }} />
                  <div className="text-[10px] font-medium text-center">PM</div>
                </div>
                <div className="space-y-1">
                  <div className="rounded-lg bg-gradient-to-t from-purple-600 via-purple-400 to-fuchsia-300 transition-all duration-500 group-hover:scale-y-110" style={{ height: `${readingTimeData.evening * 0.4}px` }} />
                  <div className="text-[10px] font-medium text-center">EVE</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Genre Distribution
              <BookOpen className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={GENRE_COLORS[entry.name as keyof typeof GENRE_COLORS] || GENRE_COLORS.Other}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white/80 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value} books ({((data.value / totalBooks) * 100).toFixed(1)}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    wrapperStyle={{
                      paddingLeft: "20px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Reading Activity
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" stroke="#A855F7" />
                  <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                  <Tooltip
                    content={({ payload, label }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="bg-white/80 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-purple-500">
                              {payload[0].value} pages
                            </p>
                            <p className="text-sm text-blue-500">
                              {payload[1].value} hours
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="pages"
                    fill="url(#purpleGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="hours"
                    fill="url(#blueGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Reading Analysis
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardTitle>
          <Tabs defaultValue="week" value={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
              <TabsTrigger value="week" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500">This Week</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500">This Month</TabsTrigger>
              <TabsTrigger value="year" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500">This Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                Genre Distribution
                <BookOpen className="h-4 w-4 text-blue-500" />
              </h4>
              <div className="space-y-3">
                {Object.entries(genreData).map(([genre, count]) => (
                  <div key={genre} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{genre}</span>
                      <span className="text-muted-foreground">{count} books</span>
                    </div>
                    <Progress 
                      value={(count / totalBooks) * 100} 
                      className="h-2.5 rounded-lg [&>div]:transition-all [&>div]:duration-500"
                      style={{
                        background: `linear-gradient(to right, ${
                          genre === 'Fiction' ? 'rgb(59 130 246 / 0.2)' :
                          genre === 'Non-Fiction' ? 'rgb(34 197 94 / 0.2)' :
                          genre === 'Science Fiction' ? 'rgb(168 85 247 / 0.2)' :
                          genre === 'Fantasy' ? 'rgb(245 158 11 / 0.2)' :
                          genre === 'Mystery' ? 'rgb(239 68 68 / 0.2)' :
                          genre === 'Biography' ? 'rgb(20 184 166 / 0.2)' :
                          'rgb(107 114 128 / 0.2)'
                        }, transparent)`
                      }}
                    >
                      <div className={`h-full rounded-lg transition-all duration-500 ${
                        genre === 'Fiction' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                        genre === 'Non-Fiction' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        genre === 'Science Fiction' ? 'bg-gradient-to-r from-purple-500 to-purple-400' :
                        genre === 'Fantasy' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                        genre === 'Mystery' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        genre === 'Biography' ? 'bg-gradient-to-r from-teal-500 to-teal-400' :
                        'bg-gradient-to-r from-gray-500 to-gray-400'
                      }`} />
                    </Progress>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                Reading Activity
                <Calendar className="h-4 w-4 text-blue-500" />
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-lg transition-all duration-300 hover:scale-95 cursor-pointer ${
                      Math.random() > 0.5
                        ? "bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 hover:from-blue-600 hover:to-blue-400"
                        : "bg-muted hover:bg-muted/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
