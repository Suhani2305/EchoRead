declare module '@/lib/types' {
  import { LucideIcon } from 'lucide-react'

  export interface Book {
    id: string
    title: string
    author: string
    completed: boolean
    progress?: number
    coverUrl?: string
    genre?: string
    description?: string
    pages?: number
    status?: 'reading' | 'completed' | 'to-read'
  }

  export interface Achievement {
    id: number
    title: string
    description: string
    icon?: LucideIcon
    completed: boolean
    date?: string
    progress?: number
    total?: number
  }

  export interface Milestone {
    id: number
    title: string
    description: string
    completed: boolean
    current?: boolean
    books: Book[]
    skills: string[]
    progress: number
    completedBooks: number
    totalBooks: number
  }

  export interface Recommendation {
    id: number
    title: string
    description: string
    icon: LucideIcon
  }

  export interface LearningPath {
    currentLevel: string
    progress: number
    nextLevel: string
    milestones: Milestone[]
    achievements: Achievement[]
    recommendations: Recommendation[]
  }
} 