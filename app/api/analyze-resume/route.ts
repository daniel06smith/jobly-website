import { generateObject } from "ai"
import { z } from "zod"

const analysisSchema = z.object({
  overallScore: z.number().min(0).max(100).describe("Overall ATS compatibility score from 0-100"),
  suggestions: z
    .array(
      z.object({
        id: z.string().describe("Unique identifier for this suggestion"),
        type: z
          .enum(["add_keyword", "improve_wording", "add_section", "remove_content", "formatting"])
          .describe("Type of suggestion"),
        title: z.string().describe("Short title for the suggestion"),
        description: z.string().describe("Detailed explanation of the suggestion"),
        originalText: z.string().optional().describe("The original text from the resume that needs improvement"),
        suggestedText: z.string().optional().describe("The suggested replacement or addition text"),
        priority: z.enum(["high", "medium", "low"]).describe("Priority level of this suggestion"),
        section: z
          .string()
          .optional()
          .describe("Which section of the resume this applies to (e.g., Experience, Skills, Education)"),
      }),
    )
    .describe("List of specific suggestions to improve the resume"),
  keywordsFound: z
    .array(
      z.object({
        keyword: z.string(),
        context: z.string().optional().describe("Where in the resume this keyword was found"),
      }),
    )
    .describe("Important keywords from the job posting that were found in the resume"),
  keywordsMissing: z
    .array(
      z.object({
        keyword: z.string(),
        importance: z.enum(["critical", "important", "nice-to-have"]),
        suggestion: z.string().describe("How to incorporate this keyword into the resume"),
      }),
    )
    .describe("Important keywords from the job posting that are missing from the resume"),
  summary: z.string().describe("Brief overall assessment of the resume's fit for this position"),
})

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription, resumeId, jobPostingId } = await req.json()

    const { object } = await generateObject({
      model: "google/gemini-2.0-flash-001",
      schema: analysisSchema,
      prompt: `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze the following resume against the job description and provide detailed, actionable feedback.

## Resume:
${resumeText}

## Job Description:
${jobDescription}

## Instructions:
1. Calculate an overall ATS compatibility score (0-100) based on keyword matches, relevant experience, and formatting.
2. Identify specific areas where the resume can be improved to better match this job posting.
3. For each suggestion, provide the original text from the resume (if applicable) and a suggested improvement.
4. Focus on:
   - Missing keywords that are important for ATS scanning
   - Experience descriptions that could be reworded to match job requirements
   - Skills or qualifications that should be highlighted or added
   - Formatting issues that might affect ATS parsing
5. Be specific and actionable - don't give vague advice.
6. Prioritize suggestions that will have the most impact on ATS scoring and recruiter interest.

Provide thorough, professional feedback that will genuinely help the candidate improve their chances of getting an interview.`,
      maxOutputTokens: 4000,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}
