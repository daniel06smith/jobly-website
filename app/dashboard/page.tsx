import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: resume } = await supabase.from("resumes").select("*").eq("user_id", user.id).maybeSingle()

  // Fetch user's past analyses
  const { data: analyses } = await supabase
    .from("analyses")
    .select(
      `
      *,
      job_postings (title, company)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <DashboardClient user={user} initialResume={resume} initialAnalyses={analyses || []} />
}
