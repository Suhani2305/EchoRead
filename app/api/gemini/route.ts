import { GoogleGenerativeAI } from "@google/generative-ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Initialize the Gemini API with the correct model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json()

    console.log("API Request:", { type, promptLength: prompt?.length })

    // Create a system prompt based on the type of AI feature
    let systemPrompt = ""

    if (type === "reading-insights") {
      systemPrompt = `You are an AI reading assistant that analyzes reading data and provides personalized insights.
      Based on the following reading data, provide 3 concise, helpful insights about reading patterns, habits, or suggestions for improvement.
      Format each insight as "Insight: explanation" with each insight on a new line.
      Keep each insight under 30 words and make them actionable and specific.`
    } else if (type === "book-recommendations") {
      systemPrompt = `You are an AI reading assistant that recommends books.
      Based on the following reading history and preferences, recommend 3 books the user might enjoy.
      Format each recommendation as "Title by Author: reason" with each recommendation on a new line.
      Keep the reason under 15 words.`
    } else if (type === "vocabulary-analysis") {
      systemPrompt = `You are an AI reading assistant that analyzes vocabulary usage.
      Based on the following vocabulary data, provide 3 insights about the user's vocabulary growth, patterns, or suggestions.
      Format each insight as "Insight: explanation" with each insight on a new line.
      Keep each insight under 30 words.`
    } else if (type === "book-summary") {
      systemPrompt = `You are an AI reading assistant that provides concise book summaries.
      Provide a 100-word summary of the book, highlighting key themes and takeaways.`
    }

    try {
      // Use a simpler model to avoid quota issues
      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" })

      console.log("Generating content with Gemini...")

      // Generate content with proper formatting
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      })

      const response = result.response
      const text = response.text()

      console.log("Generated response:", text.substring(0, 100) + "...")

      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (apiError) {
      console.error("Gemini API Error:", apiError)

      // If the API fails, return fallback data based on the type
      let fallbackResponse = ""

      if (type === "reading-insights") {
        fallbackResponse =
          "Insight: You read most consistently on weekends. Try setting aside time on weekdays too.\n" +
          "Insight: Your reading speed is improving. Keep challenging yourself with varied content.\n" +
          "Insight: Consider setting a daily reading goal of 30 minutes to build a stronger habit."
      } else if (type === "book-recommendations") {
        fallbackResponse =
          "Dune by Frank Herbert: Matches your interest in immersive world-building and complex characters.\n" +
          "Project Hail Mary by Andy Weir: Similar to other sci-fi books you've enjoyed with problem-solving themes.\n" +
          "The Hobbit by J.R.R. Tolkien: Perfect for fantasy lovers who enjoy adventure and rich storytelling."
      } else if (type === "vocabulary-analysis") {
        fallbackResponse =
          "Insight: Your vocabulary is expanding in scientific terminology. Keep reading non-fiction.\n" +
          "Insight: You've mastered 35 new words this month, showing excellent progress.\n" +
          "Insight: Try using newly learned words in writing to reinforce retention."
      } else if (type === "book-summary") {
        fallbackResponse =
          "This classic book explores timeless themes that resonate with readers across generations. Through compelling characters and masterful storytelling, it offers insights into the human condition and society."
      }

      console.log("Using fallback response")

      return new Response(JSON.stringify({ text: fallbackResponse, fallback: true }), {
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    console.error("Error in Gemini API:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process AI request: " + (error instanceof Error ? error.message : String(error)),
        fallback: true,
        text: "This is a fallback response due to an API error. The AI features are currently using pre-defined responses for demonstration purposes.",
      }),
      {
        status: 200, // Return 200 even for errors to prevent breaking the UI
        headers: { "content-type": "application/json" },
      },
    )
  }
}
