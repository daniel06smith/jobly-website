"use client"

import { useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, X, Check, Download, Sparkles, Undo2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ResumePreview } from "@/components/resume-builder/resume-preview"
import type { ResumeData } from "@/components/resume-builder/types"

export function AnalysisViewer({ analysis }) {
  const [suggestions, setSuggestions] = useState(analysis.suggestions || [])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const [modifiedResumeData, setModifiedResumeData] = useState<ResumeData | null>(
    analysis.resumes?.structured_data || null,
  )
  const [modifiedResumeText, setModifiedResumeText] = useState<string>(
    analysis.resumes?.extracted_text || "",
  )
  const router = useRouter()
  const resumeRef = useRef<HTMLDivElement>(null)

  const isStructuredResume = !!analysis.resumes?.structured_data

  const currentScore = useMemo(() => {
    const baseScore = analysis.overall_score || 0
    const totalSuggestions = suggestions.length
    if (totalSuggestions === 0) return baseScore

    const pointsPerSuggestion = (100 - baseScore) / totalSuggestions
    const acceptedCount = acceptedIds.size
    const newScore = Math.min(100, Math.round(baseScore + pointsPerSuggestion * acceptedCount))
    return newScore
  }, [analysis.overall_score, suggestions.length, acceptedIds.size])

  const handleAccept = (suggestion: any) => {
    setAcceptedIds((prev) => new Set([...prev, suggestion.id]))

    // Apply the suggestion to the resume data if it's structured
    if (isStructuredResume && suggestion.path && suggestion.suggestedText) {
      setModifiedResumeData((prev) => {
        if (!prev) return prev
        return applyChange(prev, suggestion.path, suggestion.suggestedText)
      })
    } else if (!isStructuredResume && suggestion.originalText && suggestion.suggestedText) {
      // For non-structured resumes, replace text directly
      setModifiedResumeText((prev) => prev.replace(suggestion.originalText, suggestion.suggestedText))
    }

    setSelectedSuggestion(null)
  }

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]))
    setSelectedSuggestion(null)
  }

  const handleUndo = (suggestion: any) => {
    setAcceptedIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(suggestion.id)
      return newSet
    })

    // Revert the change
    if (isStructuredResume && suggestion.path && suggestion.originalText) {
      setModifiedResumeData((prev) => {
        if (!prev) return prev
        return applyChange(prev, suggestion.path, suggestion.originalText)
      })
    } else if (!isStructuredResume && suggestion.originalText && suggestion.suggestedText) {
      // For non-structured resumes, replace back to original text
      setModifiedResumeText((prev) => prev.replace(suggestion.suggestedText, suggestion.originalText))
    }
  }

  const applyChange = (data: ResumeData, path: string, value: string): ResumeData => {
    const newData = JSON.parse(JSON.stringify(data))
    const parts = path.split(".")
    let current: any = newData

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (part.includes("[")) {
        const [arrName, indexStr] = part.split("[")
        const index = Number.parseInt(indexStr.replace("]", ""))
        current = current[arrName][index]
      } else {
        current = current[part]
      }
    }

    const lastPart = parts[parts.length - 1]
    if (lastPart.includes("[")) {
      const [arrName, indexStr] = lastPart.split("[")
      const index = Number.parseInt(indexStr.replace("]", ""))
      current[arrName][index] = value
    } else {
      current[lastPart] = value
    }

    return newData
  }

  const handleDownload = async () => {
    if (!resumeRef.current) return

    // Use html2canvas and jsPDF for PDF generation
    const html2canvas = (await import("html2canvas")).default
    const { jsPDF } = await import("jspdf")

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
    pdf.save("optimized-resume.pdf")
  }

  const activeSuggestions = suggestions.filter((s: any) => !dismissedIds.has(s.id) && !acceptedIds.has(s.id))
  const acceptedSuggestions = suggestions.filter((s: any) => acceptedIds.has(s.id))

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200"
    if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "keyword":
        return "bg-blue-100 text-blue-700"
      case "impact":
        return "bg-purple-100 text-purple-700"
      case "clarity":
        return "bg-orange-100 text-orange-700"
      case "format":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-teal-100 text-teal-700"
    }
  }

  return (
    <div className="flex h-svh flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-4 border-b bg-background px-4 py-3">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
          <Home className="h-5 w-5" />
        </Link>
        <div className="h-6 w-px bg-border" />
        <span className="text-sm font-medium">Resume Analysis</span>

        <div className="ml-auto flex items-center gap-4">
          <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${getScoreBgColor(currentScore)}`}>
            <div className={`h-2 w-2 rounded-full ${getScoreColor(currentScore)}`} />
            <span className="text-sm font-semibold tabular-nums">{currentScore}% Match</span>
            {currentScore > analysis.overall_score && (
              <span className="text-xs opacity-75">(+{currentScore - analysis.overall_score})</span>
            )}
          </div>
          <Button
            onClick={handleDownload}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={acceptedIds.size === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Resume Panel */}
        <div className="flex-1 overflow-auto border-r bg-background">
          <div className="p-8">
            <div ref={resumeRef} className="mx-auto max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
              {isStructuredResume && modifiedResumeData ? (
                <ResumePreview data={modifiedResumeData} />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {modifiedResumeText || "No resume content available"}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Suggestions Panel - Fixed scrolling issue */}
        <div className="w-[420px] flex-shrink-0 flex flex-col bg-background">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Suggestions</h2>
                <p className="text-xs text-muted-foreground">
                  {activeSuggestions.length} remaining · {acceptedIds.size} applied
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable Suggestions Content - Fixed */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {/* Active Suggestions */}
              {activeSuggestions.length === 0 && acceptedSuggestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="font-medium">All suggestions reviewed!</p>
                  <p className="text-sm">You&apos;ve addressed all the recommendations.</p>
                </div>
              ) : (
                <>
                  {activeSuggestions.map((suggestion: any) => (
                    <Card
                      key={suggestion.id}
                      className={`transition-all cursor-pointer hover:shadow-md ${
                        selectedSuggestion === suggestion.id ? "ring-2 ring-teal-500 shadow-md" : ""
                      }`}
                      onClick={() => setSelectedSuggestion(suggestion.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {suggestion.category && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(suggestion.category)}`}
                                  >
                                    {suggestion.category}
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-sm">{suggestion.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                            </div>
                          </div>

                          {suggestion.originalText && suggestion.suggestedText && (
                            <div className="space-y-2 pt-2 border-t">
                              <div className="rounded bg-red-50 p-2.5 border border-red-100">
                                <p className="text-xs font-medium text-red-600 mb-1">Current:</p>
                                <p className="text-sm text-red-800 line-through">{suggestion.originalText}</p>
                              </div>
                              <div className="rounded bg-green-50 p-2.5 border border-green-100">
                                <p className="text-xs font-medium text-green-600 mb-1">Suggested:</p>
                                <p className="text-sm text-green-800">{suggestion.suggestedText}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAccept(suggestion)
                              }}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDismiss(suggestion.id)
                              }}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Applied Changes Section */}
                  {acceptedSuggestions.length > 0 && (
                    <div className="pt-4 border-t mt-4">
                      <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Applied Changes ({acceptedSuggestions.length})
                      </h3>
                      <div className="space-y-2">
                        {acceptedSuggestions.map((suggestion: any) => (
                          <div
                            key={suggestion.id}
                            className="flex items-center justify-between rounded-lg bg-green-50 p-3 border border-green-100"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-green-800 truncate">{suggestion.title}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-700 hover:text-green-800 hover:bg-green-100 h-7 px-2"
                              onClick={() => handleUndo(suggestion)}
                            >
                              <Undo2 className="h-3 w-3 mr-1" />
                              Undo
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Keywords Section */}
              {analysis.keywords_missing?.length > 0 && (
                <div className="pt-4 border-t mt-4">
                  <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords_missing.map((kw: any, i: number) => (
                      <span
                        key={i}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          kw.importance === "critical"
                            ? "bg-red-100 text-red-700"
                            : kw.importance === "important"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {kw.keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.keywords_found?.length > 0 && (
                <div className="pt-4 border-t mt-4">
                  <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Keywords Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords_found.map((kw: any, i: number) => (
                      <span
                        key={i}
                        className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                      >
                        {kw.keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
