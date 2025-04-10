import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"
import "@/app/animation.css"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "EchoRead - AI-Powered Reading Platform",
  description: "Track your reading progress, get personalized insights, and improve your comprehension",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased transition-all duration-200",
        "text-size-base font-family-default"
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Main content with proper margin to prevent overlap */}
            <div className="flex-1 md:ml-64 pt-16 md:pt-0">
              <main className="w-full overflow-y-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'