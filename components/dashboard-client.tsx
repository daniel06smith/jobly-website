"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JoblyLogo } from "@/components/jobly-logo"
import { ResumeForm } from "@/components/resume-builder/resume-form"
import { ResumePreview } from "@/components/resume-builder/resume-preview"
import { type ResumeData, emptyResumeData } from "@/components/resume-builder/types"
import { resumeToPlainText } from "@/components/resume-builder/resume-to-text"
import { Upload, FileText, LogOut, Briefcase, Loader2, Trash2, PenLine, FileUp, Eye, Edit } from "lucide-react"

export function DashboardClient({ user, initialResume, initialAnalyses }) {
  const [resume, setResume] = useState(initialResume)
  const [analyses, setAnalyses] = useState(initialAnalyses)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [jobCompany, setJobCompany] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [error, setError] = useState(null)
  const [resumeInputMethod, setResumeInputMethod] = useState<"builder" | "upload">(
    resume?.resume_type === "pdf" ? "upload" : "builder",
  )
  const [resumeData, setResumeData] = useState<ResumeData>(resume?.structured_data || emptyResumeData)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(",")[1]

        const extractRes = await fetch("/api/extract-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, fileName: file.name }),
        })

        if (!extractRes.ok) {
          throw new Error("Failed to process PDF")
        }

        const { extractedText, fileUrl } = await extractRes.json()

        const supabase = createClient()

        if (resume) {
          const { data, error: updateError } = await supabase
            .from("resumes")
            .update({
              file_name: file.name,
              file_url: fileUrl,
              extracted_text: extractedText,
              resume_type: "pdf",
              structured_data: null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id)
            .select()
            .single()

          if (updateError) throw updateError
          setResume(data)
        } else {
          const { data, error: insertError } = await supabase
            .from("resumes")
            .insert({
              user_id: user.id,
              file_name: file.name,
              file_url: fileUrl,
              extracted_text: extractedText,
              resume_type: "pdf",
            })
            .select()
            .single()

          if (insertError) throw insertError
          setResume(data)
        }

        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setIsUploading(false)
    }
  }

  const handleSaveResume = async () => {
    if (!resumeData.personalInfo.fullName) {
      setError("Please enter at least your full name")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const extractedText = resumeToPlainText(resumeData)

      if (resume) {
        const { data, error: updateError } = await supabase
          .from("resumes")
          .update({
            file_name: null,
            file_url: null,
            extracted_text: extractedText,
            resume_type: "structured",
            structured_data: resumeData,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select()
          .single()

        if (updateError) throw updateError
        setResume(data)
      } else {
        const { data, error: insertError } = await supabase
          .from("resumes")
          .insert({
            user_id: user.id,
            extracted_text: extractedText,
            resume_type: "structured",
            structured_data: resumeData,
          })
          .select()
          .single()

        if (insertError) throw insertError
        setResume(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAnalyze = async () => {
    if (!resume || !jobDescription.trim()) {
      setError("Please save a resume and enter a job description")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: jobPosting, error: jobError } = await supabase
        .from("job_postings")
        .insert({
          user_id: user.id,
          title: jobTitle || "Untitled Position",
          company: jobCompany || null,
          description: jobDescription,
        })
        .select()
        .single()

      if (jobError) throw jobError

      const analysisRes = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resume.extracted_text,
          resumeData: resume.structured_data,
          jobDescription: jobDescription,
          resumeId: resume.id,
          jobPostingId: jobPosting.id,
        }),
      })

      if (!analysisRes.ok) {
        throw new Error("Analysis failed")
      }

      const analysisData = await analysisRes.json()

      const { data: analysis, error: analysisError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          resume_id: resume.id,
          job_posting_id: jobPosting.id,
          overall_score: analysisData.overallScore,
          suggestions: analysisData.suggestions,
          keywords_found: analysisData.keywordsFound,
          keywords_missing: analysisData.keywordsMissing,
        })
        .select(
          `
          *,
          job_postings (title, company)
        `,
        )
        .single()

      if (analysisError) throw analysisError

      setAnalyses([analysis, ...analyses])
      setJobTitle("")
      setJobCompany("")
      setJobDescription("")
      router.push(`/analysis/${analysis.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDeleteResume = async () => {
    if (!resume) return

    const supabase = createClient()
    const { error: deleteError } = await supabase.from("resumes").delete().eq("id", resume.id)

    if (!deleteError) {
      setResume(null)
      setResumeData(emptyResumeData)
    }
  }

  const hasResumeContent = resume?.resume_type === "pdf" ? !!resume.file_name : !!resumeData.personalInfo.fullName

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <JoblyLogo />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

          {/* Resume Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Resume
                  </CardTitle>
                  <CardDescription>Build your resume or upload an existing PDF</CardDescription>
                </div>
                {resume && (
                  <Button variant="ghost" size="sm" onClick={handleDeleteResume}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Resume
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={resumeInputMethod} onValueChange={(v) => setResumeInputMethod(v as "builder" | "upload")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="builder">
                    <PenLine className="mr-2 h-4 w-4" />
                    Build Resume
                  </TabsTrigger>
                  <TabsTrigger value="upload">
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload PDF
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="builder" className="mt-0">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form Side */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Resume Details</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="lg:hidden bg-transparent"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? (
                            <>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </>
                          )}
                        </Button>
                      </div>
                      <div className={`${showPreview ? "hidden lg:block" : ""}`}>
                        <div className="max-h-[600px] overflow-y-auto pr-2">
                          <ResumeForm data={resumeData} onChange={setResumeData} />
                        </div>
                        <Button
                          className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white"
                          onClick={handleSaveResume}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Resume"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Preview Side */}
                    <div className={`${showPreview ? "" : "hidden lg:block"}`}>
                      <h3 className="font-medium mb-4">Preview</h3>
                      <div className="border rounded-lg p-6 bg-white shadow-sm max-h-[650px] overflow-y-auto">
                        <ResumePreview data={resumeData} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="mt-0">
                  {resume?.resume_type === "pdf" && resume.file_name ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <FileText className="h-10 w-10 text-teal-600" />
                        <div className="flex-1">
                          <p className="font-medium">{resume.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(resume.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          disabled={isUploading}
                        />
                        <Button variant="outline" className="w-full bg-transparent" disabled={isUploading}>
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Replace Resume
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        disabled={isUploading}
                      />
                      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-12 text-center">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{isUploading ? "Uploading..." : "Click to upload your resume"}</p>
                          <p className="text-sm text-muted-foreground">PDF files only</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Job Posting Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Analyze Against Job Posting
              </CardTitle>
              <CardDescription>Paste the job description to get AI feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    placeholder="Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Paste the full job description here..."
                  className="min-h-[150px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleAnalyze}
                disabled={!hasResumeContent || !jobDescription.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Past Analyses */}
          {analyses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Past Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyses.map((analysis) => (
                    <button
                      key={analysis.id}
                      onClick={() => router.push(`/analysis/${analysis.id}`)}
                      className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{analysis.job_postings?.title || "Untitled Position"}</p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.job_postings?.company || "Unknown Company"} •{" "}
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            analysis.overall_score >= 80
                              ? "bg-green-100 text-green-700"
                              : analysis.overall_score >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {analysis.overall_score}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
