import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { file, fileName } = await req.json()

    // Use Gemini to extract text from PDF
    const { text: extractedText } = await generateText({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all the text content from this resume PDF. Return only the extracted text, preserving the structure as much as possible. Do not add any commentary or formatting instructions.",
            },
            {
              type: "file",
              data: file,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
      maxOutputTokens: 4000,
    })

    // For now, we'll store a placeholder URL since we're extracting text directly
    // In production, you'd upload to Supabase Storage
    const supabase = await createClient()
    const fileUrl = `resume_${Date.now()}.pdf`

    return Response.json({
      extractedText,
      fileUrl,
    })
  } catch (error) {
    console.error("PDF extraction error:", error)
    return Response.json({ error: "Failed to extract PDF" }, { status: 500 })
  }
}
