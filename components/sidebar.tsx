"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  BarChart2,
  Clock,
  Brain,
  BookMarked,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Sparkles,
  BookText,
  GraduationCap,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Jane Doe",
    username: "janedoe",
    readingLevel: "Advanced Reader",
    profilePic: "/default-avatar.png"
  })

  // After mounting, set mounted to true for animations
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Load saved profile data on mount
    const savedSettings = localStorage.getItem("userSettings")
    const savedProfilePic = localStorage.getItem("profilePic")
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setProfileData(prev => ({
        ...prev,
        name: settings.name,
        username: settings.username,
        readingLevel: settings.readingLevel
      }))
    }
    
    if (savedProfilePic) {
      setProfileData(prev => ({
        ...prev,
        profilePic: savedProfilePic
      }))
    }

    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      setProfileData(event.detail)
    }

    window.addEventListener('profileUpdate', handleProfileUpdate as EventListener)

    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener)
    }
  }, [])

  const routes = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "My Library",
      href: "/library",
      icon: BookOpen,
    },
    {
      name: "Reading Stats",
      href: "/stats",
      icon: BarChart2,
    },
    {
      name: "Reading Timer",
      href: "/timer",
      icon: Clock,
    },
    {
      name: "AI Insights",
      href: "/insights",
      icon: Sparkles,
    },
    {
      name: "Quizzes",
      href: "/quizzes",
      icon: GraduationCap,
    },
    {
      name: "Vocabulary",
      href: "/vocabulary",
      icon: BookText,
    },
    {
      name: "Learning Path",
      href: "/learning-path",
      icon: Brain,
    },
    {
      name: "Bookmarks",
      href: "/bookmarks",
      icon: BookMarked,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar")
      const menuButton = document.getElementById("menu-button")

      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <div className="fixed top-0 left-0 z-40 w-full h-16 md:hidden bg-background border-b flex items-center px-4">
        <Button
          id="menu-button"
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border-primary/20"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="ml-4 flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            EchoRead
          </h1>
        </div>
      </div>

      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          mounted ? "animate-fade-in" : "opacity-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Link href="/" className="flex items-center gap-2 mb-8 p-2">
              <div className="bg-white/10 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                EchoRead
              </h1>
            </Link>

            <div className="flex items-center gap-3 mb-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Avatar className="border-2 border-white/20">
                <AvatarImage src={profileData.profilePic} alt={profileData.name} width={48} height={48} className="object-cover w-full h-full" />
                <AvatarFallback className="bg-primary/30">{profileData.name.split(' ').map(word => word[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{profileData.name}</p>
                <p className="text-xs text-white/70">{profileData.readingLevel}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {routes.map((route, index) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    pathname === route.href
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                    mounted ? `animate-slide-in [animation-delay:${index * 50}ms]` : "opacity-0",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <route.icon className="h-4 w-4" />
                    {route.name}
                  </div>
                  {pathname === route.href && <ChevronRight className="h-4 w-4 text-white/70" />}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-white"
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <p className="text-xs text-center mt-4 text-white/50">EchoRead v1.2.0 • Demo Mode</p>
          </div>
        </div>
      </aside>
    </>
  )
}
