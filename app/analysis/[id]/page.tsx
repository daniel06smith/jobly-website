import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalysisViewer } from "@/components/analysis-viewer"

export default async function AnalysisPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch the analysis with related data
  const { data: analysis, error: analysisError } = await supabase
    .from("analyses")
    .select(
      `
      *,
      resumes (id, file_name, extracted_text),
      job_postings (title, company, description)
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (analysisError || !analysis) {
    redirect("/dashboard")
  }

  return <AnalysisViewer analysis={analysis} />
}
