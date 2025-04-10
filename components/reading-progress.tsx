"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { day: "Mon", pages: 32, time: 25 },
  { day: "Tue", pages: 45, time: 38 },
  { day: "Wed", pages: 19, time: 15 },
  { day: "Thu", pages: 28, time: 22 },
  { day: "Fri", pages: 50, time: 40 },
  { day: "Sat", pages: 65, time: 52 },
  { day: "Sun", pages: 70, time: 58 },
]

export function ReadingProgress() {
  return (
    <Card className="themed-card">
      <CardHeader className="themed-header">
        <CardTitle>Weekly Reading Progress</CardTitle>
        <CardDescription>Pages read and time spent reading over the past week</CardDescription>
      </CardHeader>
      <CardContent className="themed-content p-6">
        <ChartContainer
          config={{
            pages: {
              label: "Pages Read",
              color: "#8b5cf6",
            },
            time: {
              label: "Reading Time (min)",
              color: "#3b82f6",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="hsl(var(--muted-foreground))"
                opacity={0.2} 
              />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                }}
              />
              <Area
                type="monotone"
                dataKey="pages"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#colorPages)"
                dot={{ stroke: "#8b5cf6", strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "white" }}
              />
              <Area
                type="monotone"
                dataKey="time"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorTime)"
                dot={{ stroke: "#3b82f6", strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
