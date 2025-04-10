import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, type } = await req.json()

    // Create a prompt based on the type of AI feature
    let systemPrompt = ""

    if (type === "reading-insights") {
      systemPrompt = `You are an AI reading assistant that analyzes reading data and provides personalized insights.
      Based on the following reading data, provide 3 concise, helpful insights about reading patterns, habits, or suggestions for improvement.
      Keep each insight under 30 words and make them actionable and specific.`
    } else if (type === "book-recommendations") {
      systemPrompt = `You are an AI reading assistant that recommends books.
      Based on the following reading history and preferences, recommend 3 books the user might enjoy.
      For each book, provide the title, author, and a brief reason for the recommendation in 15 words or less.`
    } else if (type === "vocabulary-analysis") {
      systemPrompt = `You are an AI reading assistant that analyzes vocabulary usage.
      Based on the following vocabulary data, provide 3 insights about the user's vocabulary growth, patterns, or suggestions.
      Keep each insight under 30 words.`
    }

    const prompt = messages[messages.length - 1].content

    const response = await openai("gpt-4o", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const stream = streamText(response)
    return new Response(stream)
  } catch (error) {
    console.error("Error in AI API:", error)
    return new Response(JSON.stringify({ error: "Failed to process AI request" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
