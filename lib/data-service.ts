// Types
export type Book = {
  id: string
  title: string
  author: string
  cover: string
  genre: string
  pages: number
  currentPage?: number
  status: "reading" | "completed" | "to-read"
  dateAdded: string
  dateCompleted?: string
  rating?: number
}

export type ReadingStats = {
  totalBooks: number
  completedBooks: number
  inProgressBooks: number
  totalPages: number
  totalReadingTime: number
  averageReadingSpeed: number
}

export type VocabularyWord = {
  id: string
  word: string
  definition: string
  example: string
  partOfSpeech: string
  book: string
  dateAdded: string
  mastery: "learning" | "mastered"
}

export interface Quiz {
  id: string
  title: string
  bookId: string
  questions: {
    question: string
    options: string[]
    correctAnswer: number
  }[]
  dateCompleted?: string
  score?: number
}

// Sample data
const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Fiction",
    pages: 180,
    currentPage: 117,
    status: "reading",
    dateAdded: "2025-03-15",
  },
  {
    id: "2",
    title: "Brave New World",
    author: "Aldous Huxley",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Science Fiction",
    pages: 311,
    currentPage: 72,
    status: "reading",
    dateAdded: "2025-03-20",
  },
  {
    id: "3",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Psychology",
    pages: 499,
    currentPage: 210,
    status: "reading",
    dateAdded: "2025-03-25",
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Fiction",
    pages: 281,
    status: "completed",
    dateAdded: "2025-02-10",
    dateCompleted: "2025-03-28",
    rating: 5,
  },
  {
    id: "5",
    title: "1984",
    author: "George Orwell",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Science Fiction",
    pages: 328,
    status: "completed",
    dateAdded: "2025-02-15",
    dateCompleted: "2025-03-15",
    rating: 4,
  },
  {
    id: "6",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Fantasy",
    pages: 310,
    status: "completed",
    dateAdded: "2025-01-22",
    dateCompleted: "2025-02-22",
    rating: 5,
  },
  {
    id: "7",
    title: "Dune",
    author: "Frank Herbert",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Science Fiction",
    pages: 412,
    status: "to-read",
    dateAdded: "2025-04-01",
  },
  {
    id: "8",
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Science Fiction",
    pages: 476,
    status: "to-read",
    dateAdded: "2025-03-30",
  },
  {
    id: "9",
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: "/placeholder.svg?height=180&width=120",
    genre: "Fiction",
    pages: 197,
    status: "to-read",
    dateAdded: "2025-03-25",
  },
]

const vocabularyWords: VocabularyWord[] = [
  {
    id: "1",
    word: "Ephemeral",
    definition: "Lasting for a very short time",
    example: "The ephemeral nature of cherry blossoms makes them all the more special.",
    partOfSpeech: "adjective",
    book: "The Great Gatsby",
    dateAdded: "2025-04-03",
    mastery: "learning",
  },
  {
    id: "2",
    word: "Sycophant",
    definition: "A person who acts obsequiously toward someone important in order to gain advantage",
    example: "He surrounded himself with sycophants who constantly praised his ideas.",
    partOfSpeech: "noun",
    book: "1984",
    dateAdded: "2025-04-02",
    mastery: "learning",
  },
  {
    id: "3",
    word: "Ubiquitous",
    definition: "Present, appearing, or found everywhere",
    example: "Mobile phones have become ubiquitous in modern society.",
    partOfSpeech: "adjective",
    book: "Brave New World",
    dateAdded: "2025-04-01",
    mastery: "mastered",
  },
  {
    id: "4",
    word: "Pernicious",
    definition: "Having a harmful effect, especially in a gradual or subtle way",
    example: "The pernicious effects of corruption were felt throughout the government.",
    partOfSpeech: "adjective",
    book: "To Kill a Mockingbird",
    dateAdded: "2025-03-30",
    mastery: "learning",
  },
  {
    id: "5",
    word: "Eloquent",
    definition: "Fluent or persuasive in speaking or writing",
    example: "She gave an eloquent speech that moved the audience to tears.",
    partOfSpeech: "adjective",
    book: "Pride and Prejudice",
    dateAdded: "2025-03-29",
    mastery: "mastered",
  },
]

export const quizzes: Quiz[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    bookId: "1",
    questions: [
      {
        question: "What is the main theme of the book?",
        options: ["Love", "War", "Adventure", "Mystery"],
        correctAnswer: 0
      },
      {
        question: "Who is the narrator of The Great Gatsby?",
        options: ["Jay Gatsby", "Daisy Buchanan", "Nick Carraway", "Tom Buchanan"],
        correctAnswer: 2,
      },
      {
        question: "What does the green light at the end of Daisy's dock symbolize?",
        options: ["Money", "Envy", "Gatsby's hopes and dreams", "The American Dream"],
        correctAnswer: 2,
      },
      {
        question: "In which city does the novel primarily take place?",
        options: ["Chicago", "New York", "Boston", "Philadelphia"],
        correctAnswer: 1,
      },
      {
        question: "What is Jay Gatsby's real name?",
        options: ["James Gatz", "John Gatsby", "Jay Gatsby", "James Buchanan"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of Daisy and Tom's daughter?",
        options: ["Pammy", "Daisy Jr.", "Elizabeth", "Margaret"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the valley between West Egg and New York City?",
        options: ["Valley of Ashes", "Death Valley", "Dust Valley", "Ash Valley"],
        correctAnswer: 0,
      },
      {
        question: "Who is Myrtle Wilson?",
        options: ["Tom's wife", "Gatsby's cousin", "Tom's mistress", "Nick's girlfriend"],
        correctAnswer: 2,
      },
      {
        question: "What is the name of the hotel where Tom and Myrtle meet?",
        options: ["The Plaza", "The Waldorf", "The Plaza Hotel", "The Plaza Suites"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who owns the billboard with the eyes?",
        options: ["Dr. T.J. Eckleburg", "Dr. J. Eckleburg", "Dr. T. Eckleburg", "Dr. J. T. Eckleburg"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who kills Gatsby?",
        options: ["George Wilson", "Tom Buchanan", "Nick Carraway", "Meyer Wolfsheim"],
        correctAnswer: 0,
      }
    ],
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    bookId: "4",
    questions: [
      {
        question: "Who is the protagonist of To Kill a Mockingbird?",
        options: ["Atticus Finch", "Scout Finch", "Jem Finch", "Boo Radley"],
        correctAnswer: 1,
      },
      {
        question: "What is Atticus Finch's profession?",
        options: ["Doctor", "Teacher", "Lawyer", "Sheriff"],
        correctAnswer: 2,
      },
      {
        question: "Which character is known as Boo Radley?",
        options: ["Tom Robinson", "Arthur Radley", "Bob Ewell", "Mayella Ewell"],
        correctAnswer: 1,
      },
      {
        question: "What is the name of the town where the story takes place?",
        options: ["Maycomb", "Mayfield", "Mayville", "Maytown"],
        correctAnswer: 0,
      },
      {
        question: "Who is Calpurnia?",
        options: ["Scout's teacher", "The Finch family's cook", "Atticus's sister", "Jem's friend"],
        correctAnswer: 1,
      },
      {
        question: "What is the name of the man Atticus defends in court?",
        options: ["Tom Robinson", "Bob Ewell", "Boo Radley", "Dill Harris"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of Scout's brother?",
        options: ["Jem", "Dill", "Atticus", "Boo"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of Scout's friend who visits in the summer?",
        options: ["Dill", "Jem", "Boo", "Tom"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who attacks Scout and Jem?",
        options: ["Bob Ewell", "Tom Robinson", "Boo Radley", "Dill Harris"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who saves Scout and Jem?",
        options: ["Boo Radley", "Atticus Finch", "Tom Robinson", "Bob Ewell"],
        correctAnswer: 0,
      }
    ],
    dateCompleted: "2025-04-01",
    score: 90,
  },
  {
    id: "3",
    title: "1984",
    bookId: "5",
    questions: [
      {
        question: "Who is the main character of 1984?",
        options: ["Winston Smith", "Julia", "O'Brien", "Big Brother"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the totalitarian party that rules Oceania?",
        options: ["The Party", "The Brotherhood", "The Inner Party", "The Outer Party"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the language that the Party is creating?",
        options: ["Newspeak", "Oldspeak", "Doublespeak", "Partyspeak"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the place where Winston works?",
        options: ["Ministry of Truth", "Ministry of Love", "Ministry of Peace", "Ministry of Plenty"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the woman Winston falls in love with?",
        options: ["Julia", "Katharine", "Syme", "O'Brien"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who betrays Winston?",
        options: ["O'Brien", "Syme", "Parsons", "Ampleforth"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the place where Winston is tortured?",
        options: ["Room 101", "Room 101", "Room 101", "Room 101"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who is vaporized?",
        options: ["Syme", "Parsons", "Ampleforth", "O'Brien"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who is Winston's neighbor?",
        options: ["Parsons", "Syme", "Ampleforth", "O'Brien"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the man who is Winston's friend?",
        options: ["Syme", "Parsons", "Ampleforth", "O'Brien"],
        correctAnswer: 0,
      }
    ],
  },
  {
    id: "4",
    title: "The Hobbit",
    bookId: "6",
    questions: [
      {
        question: "Who is the main character of The Hobbit?",
        options: ["Bilbo Baggins", "Gandalf", "Thorin", "Smaug"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the dragon that Bilbo and the dwarves are trying to defeat?",
        options: ["Smaug", "Glaurung", "Ancalagon", "Scatha"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the wizard who helps Bilbo and the dwarves?",
        options: ["Gandalf", "Saruman", "Radagast", "Alatar"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the ring that Bilbo finds?",
        options: ["The One Ring", "The Ring of Power", "The Ring of Doom", "The Ring of Destiny"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the mountain where Smaug lives?",
        options: ["Erebor", "Moria", "Mordor", "Gondor"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the forest where Bilbo and the dwarves get lost?",
        options: ["Mirkwood", "Lothlórien", "Fangorn", "Greenwood"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the river that Bilbo and the dwarves cross?",
        options: ["The Anduin", "The Brandywine", "The Bruinen", "The Celduin"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the town where Bilbo lives?",
        options: ["Hobbiton", "Bree", "Rivendell", "Gondor"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the dwarf who leads the company?",
        options: ["Thorin", "Balin", "Dwalin", "Fili"],
        correctAnswer: 0,
      },
      {
        question: "What is the name of the creature that Bilbo meets in the cave?",
        options: ["Gollum", "Smaug", "Sauron", "Saruman"],
        correctAnswer: 0,
      }
    ],
  }
]

// Data service functions
export const dataService = {
  // Books
  getBooks: () => books,
  getBookById: (id: string) => books.find((book) => book.id === id),
  getBooksByStatus: (status: "reading" | "completed" | "to-read") => books.filter((book) => book.status === status),

  // Reading stats
  getReadingStats: (): ReadingStats => ({
    totalBooks: books.length,
    completedBooks: books.filter((book) => book.status === "completed").length,
    inProgressBooks: books.filter((book) => book.status === "reading").length,
    totalPages: books.reduce((total, book) => {
      if (book.status === "completed") {
        return total + book.pages
      } else if (book.status === "reading" && book.currentPage) {
        return total + book.currentPage
      }
      return total
    }, 0),
    totalReadingTime: 1250, // in minutes
    averageReadingSpeed: 35, // pages per hour
  }),

  // Reading data
  getWeeklyReadingData: () => [
    { day: "Mon", pages: 32, time: 25, books: 0 },
    { day: "Tue", pages: 45, time: 38, books: 0 },
    { day: "Wed", pages: 19, time: 15, books: 0 },
    { day: "Thu", pages: 28, time: 22, books: 0 },
    { day: "Fri", pages: 50, time: 40, books: 1 },
    { day: "Sat", pages: 65, time: 52, books: 0 },
    { day: "Sun", pages: 70, time: 58, books: 0 },
  ],

  getMonthlyReadingData: () => [
    { month: "Jan", pages: 320, time: 250, books: 2 },
    { month: "Feb", pages: 450, time: 380, books: 3 },
    { month: "Mar", pages: 520, time: 420, books: 3 },
    { month: "Apr", pages: 280, time: 220, books: 2 },
    { month: "May", pages: 500, time: 400, books: 4 },
    { month: "Jun", pages: 650, time: 520, books: 5 },
    { month: "Jul", pages: 700, time: 580, books: 5 },
    { month: "Aug", pages: 550, time: 450, books: 4 },
    { month: "Sep", pages: 480, time: 390, books: 3 },
    { month: "Oct", pages: 520, time: 420, books: 4 },
    { month: "Nov", pages: 610, time: 500, books: 4 },
    { month: "Dec", pages: 720, time: 600, books: 5 },
  ],

  getGenreDistribution: () => [
    { name: "Fiction", value: 35 },
    { name: "Science Fiction", value: 25 },
    { name: "Fantasy", value: 15 },
    { name: "Non-Fiction", value: 10 },
    { name: "Biography", value: 8 },
    { name: "Mystery", value: 7 },
  ],

  getReadingSpeedData: () => [
    { month: "Jan", wpm: 220 },
    { month: "Feb", wpm: 225 },
    { month: "Mar", wpm: 230 },
    { month: "Apr", wpm: 235 },
    { month: "May", wpm: 240 },
    { month: "Jun", wpm: 245 },
    { month: "Jul", wpm: 250 },
    { month: "Aug", wpm: 255 },
    { month: "Sep", wpm: 260 },
    { month: "Oct", wpm: 265 },
    { month: "Nov", wpm: 270 },
    { month: "Dec", wpm: 275 },
  ],

  getQuizPerformanceData: () => [
    { book: "The Great Gatsby", score: 92 },
    { book: "To Kill a Mockingbird", score: 88 },
    { book: "1984", score: 95 },
    { book: "Brave New World", score: 85 },
    { book: "The Hobbit", score: 90 },
  ],

  // Vocabulary
  getVocabularyWords: () => vocabularyWords,

  // Quizzes
  getAvailableQuizzes: () => quizzes.filter((quiz) => !quiz.dateCompleted),
  getCompletedQuizzes: () => quizzes.filter((quiz) => quiz.dateCompleted),
  getQuizById: (id: string) => quizzes.find((quiz) => quiz.id === id),
}
