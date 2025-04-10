"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function StatsView() {
  // Weekly reading data
  const weeklyData = [
    { day: "Mon", pages: 32, time: 25, books: 0 },
    { day: "Tue", pages: 45, time: 38, books: 0 },
    { day: "Wed", pages: 19, time: 15, books: 0 },
    { day: "Thu", pages: 28, time: 22, books: 0 },
    { day: "Fri", pages: 50, time: 40, books: 0 },
    { day: "Sat", pages: 65, time: 52, books: 1 },
    { day: "Sun", pages: 70, time: 58, books: 0 },
  ]

  // Monthly reading data
  const monthlyData = [
    { month: "Jan", pages: 320, time: 280, books: 2 },
    { month: "Feb", pages: 450, time: 350, books: 3 },
    { month: "Mar", pages: 280, time: 220, books: 2 },
    { month: "Apr", pages: 580, time: 450, books: 4 },
    { month: "May", pages: 250, time: 200, books: 1 },
    { month: "Jun", pages: 350, time: 300, books: 2 },
    { month: "Jul", pages: 420, time: 380, books: 3 },
    { month: "Aug", pages: 380, time: 320, books: 2 },
    { month: "Sep", pages: 430, time: 360, books: 3 },
    { month: "Oct", pages: 500, time: 420, books: 3 },
    { month: "Nov", pages: 350, time: 280, books: 2 },
    { month: "Dec", pages: 450, time: 400, books: 3 },
  ]

  // Genre distribution data
  const genreData = [
    { name: "Fiction", value: 35 },
    { name: "Science Fiction", value: 20 },
    { name: "Fantasy", value: 15 },
    { name: "Non-Fiction", value: 10 },
    { name: "Mystery", value: 10 },
    { name: "Biography", value: 10 },
  ]

  // Reading time distribution data
  const timeData = [
    { name: "Morning", value: 40 },
    { name: "Afternoon", value: 25 },
    { name: "Evening", value: 35 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reading Statistics</h1>
        <p className="text-muted-foreground">Analyze your reading habits and progress</p>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages Read</CardTitle>
                <CardDescription>Pages read per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    pages: {
                      label: "Pages",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="pages" fill="var(--color-pages)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reading Time</CardTitle>
                <CardDescription>Minutes spent reading per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    time: {
                      label: "Minutes",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="time" stroke="var(--color-time)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Genre Distribution</CardTitle>
                <CardDescription>Books read by genre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reading Time Distribution</CardTitle>
                <CardDescription>When you read the most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {timeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages Read</CardTitle>
                <CardDescription>Pages read per month this year</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    pages: {
                      label: "Pages",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="pages" fill="var(--color-pages)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Books Completed</CardTitle>
                <CardDescription>Books finished per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    books: {
                      label: "Books",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="books" fill="var(--color-books)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Reading Summary</CardTitle>
              <CardDescription>Your reading progress over the years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                  <h3 className="text-4xl font-bold">24</h3>
                  <p className="text-sm text-muted-foreground">Books Read</p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                  <h3 className="text-4xl font-bold">4,320</h3>
                  <p className="text-sm text-muted-foreground">Pages Read</p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                  <h3 className="text-4xl font-bold">180</h3>
                  <p className="text-sm text-muted-foreground">Hours Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
