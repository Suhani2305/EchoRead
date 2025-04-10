// Fallback AI responses when the Gemini API is not working

export const fallbackAIService = {
  getReadingInsights: () => [
    "You read most consistently on weekends. Try setting aside time on weekdays too.",
    "Your reading speed is improving. Keep challenging yourself with varied content.",
    "Consider setting a daily reading goal of 30 minutes to build a stronger habit.",
  ],

  getBookRecommendations: () => [
    {
      title: "Dune",
      author: "Frank Herbert",
      reason: "Matches your interest in immersive world-building and complex characters.",
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      reason: "Similar to other sci-fi books you've enjoyed with problem-solving themes.",
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      reason: "Perfect for fantasy lovers who enjoy adventure and rich storytelling.",
    },
  ],

  getVocabularyAnalysis: () => [
    "Your vocabulary is expanding in scientific terminology. Keep reading non-fiction.",
    "You've mastered 35 new words this month, showing excellent progress.",
    "Try using newly learned words in writing to reinforce retention.",
  ],

  getBookSummary: (bookTitle: string) => {
    const summaries: Record<string, string> = {
      "The Great Gatsby":
        "A tale of wealth, love, and the American Dream in the 1920s. Jay Gatsby's obsession with Daisy Buchanan leads to tragedy, revealing the emptiness behind materialism and social status.",
      "To Kill a Mockingbird":
        "Set in the American South during the 1930s, this story explores racial injustice through the eyes of Scout Finch as her father defends a Black man falsely accused of a crime.",
      "1984":
        "A dystopian vision of a totalitarian future where Big Brother watches everything, and the government controls reality itself. Winston Smith's rebellion becomes a powerful warning about surveillance and freedom.",
      "Brave New World":
        "A futuristic society where humans are genetically engineered and conditioned for social stability. Questions the cost of happiness when it comes at the expense of freedom and individuality.",
    }

    return (
      summaries[bookTitle] ||
      "This classic book explores timeless themes that resonate with readers across generations. Through compelling characters and masterful storytelling, it offers insights into the human condition and society."
    )
  },
}
