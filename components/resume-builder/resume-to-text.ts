import type { ResumeData } from "./types"

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = []
  const { personalInfo, education, experience, projects, skills } = data

  // Header
  if (personalInfo.fullName) {
    lines.push(personalInfo.fullName)
  }

  // Contact info
  const contactParts = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean)
  if (contactParts.length > 0) {
    lines.push(contactParts.join(" | "))
  }

  lines.push("")

  // Education
  if (education.length > 0) {
    lines.push("EDUCATION")
    lines.push("-".repeat(40))
    education.forEach((edu) => {
      lines.push(`${edu.school}${edu.location ? `, ${edu.location}` : ""}`)
      const degreeLine = [edu.degree, edu.field].filter(Boolean).join(" in ")
      const dateLine = [edu.startDate, edu.endDate].filter(Boolean).join(" – ")
      if (degreeLine || dateLine) {
        lines.push(`${degreeLine}${dateLine ? ` | ${dateLine}` : ""}`)
      }
      lines.push("")
    })
  }

  // Experience
  if (experience.length > 0) {
    lines.push("EXPERIENCE")
    lines.push("-".repeat(40))
    experience.forEach((exp) => {
      const dateLine = [exp.startDate, exp.endDate].filter(Boolean).join(" – ")
      lines.push(`${exp.title}${dateLine ? ` | ${dateLine}` : ""}`)
      lines.push(`${exp.company}${exp.location ? `, ${exp.location}` : ""}`)
      exp.bullets
        .filter((b) => b.trim())
        .forEach((bullet) => {
          lines.push(`• ${bullet}`)
        })
      lines.push("")
    })
  }

  // Projects
  if (projects.length > 0) {
    lines.push("PROJECTS")
    lines.push("-".repeat(40))
    projects.forEach((proj) => {
      const dateLine = [proj.startDate, proj.endDate].filter(Boolean).join(" – ")
      lines.push(`${proj.name}${proj.technologies ? ` | ${proj.technologies}` : ""}${dateLine ? ` | ${dateLine}` : ""}`)
      proj.bullets
        .filter((b) => b.trim())
        .forEach((bullet) => {
          lines.push(`• ${bullet}`)
        })
      lines.push("")
    })
  }

  // Skills
  if (skills.languages || skills.frameworks || skills.tools || skills.other) {
    lines.push("TECHNICAL SKILLS")
    lines.push("-".repeat(40))
    if (skills.languages) lines.push(`Languages: ${skills.languages}`)
    if (skills.frameworks) lines.push(`Frameworks: ${skills.frameworks}`)
    if (skills.tools) lines.push(`Developer Tools: ${skills.tools}`)
    if (skills.other) lines.push(`Other: ${skills.other}`)
  }

  return lines.join("\n")
}
