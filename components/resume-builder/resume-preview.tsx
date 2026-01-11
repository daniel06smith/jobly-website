"use client"

import type { ResumeData } from "./types"

interface ResumePreviewProps {
  data: ResumeData
  highlightedSuggestionId?: string | null
  onSuggestionClick?: (id: string) => void
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const { personalInfo, education, experience, projects, skills } = data

  const hasContactInfo =
    personalInfo.phone || personalInfo.email || personalInfo.linkedin || personalInfo.github || personalInfo.website

  return (
    <div className="bg-white text-black font-serif" style={{ fontSize: "10pt", lineHeight: 1.3 }}>
      {/* Header - Name */}
      {personalInfo.fullName && (
        <h1 className="text-center text-2xl font-bold tracking-wide mb-1">{personalInfo.fullName}</h1>
      )}

      {/* Contact Info */}
      {hasContactInfo && (
        <div className="text-center text-xs mb-4 flex flex-wrap justify-center gap-x-2">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>|</span>}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="underline">
              {personalInfo.email}
            </a>
          )}
          {(personalInfo.phone || personalInfo.email) && personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin}`} className="underline">
              {personalInfo.linkedin}
            </a>
          )}
          {(personalInfo.phone || personalInfo.email || personalInfo.linkedin) && personalInfo.github && <span>|</span>}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github}`} className="underline">
              {personalInfo.github}
            </a>
          )}
          {(personalInfo.phone || personalInfo.email || personalInfo.linkedin || personalInfo.github) &&
            personalInfo.website && <span>|</span>}
          {personalInfo.website && (
            <a href={`https://${personalInfo.website}`} className="underline">
              {personalInfo.website}
            </a>
          )}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black mb-2">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{edu.school}</span>
                <span className="text-xs">{edu.location}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic text-xs">
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </span>
                <span className="text-xs">
                  {edu.startDate}
                  {edu.startDate && edu.endDate && " – "}
                  {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black mb-2">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{exp.title}</span>
                <span className="text-xs">
                  {exp.startDate}
                  {exp.startDate && exp.endDate && " – "}
                  {exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic text-xs">{exp.company}</span>
                <span className="text-xs">{exp.location}</span>
              </div>
              {exp.bullets.filter((b) => b.trim()).length > 0 && (
                <ul className="mt-1 ml-4 text-xs list-disc">
                  {exp.bullets
                    .filter((b) => b.trim())
                    .map((bullet, i) => (
                      <li key={i} className="mb-0.5">
                        {bullet}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black mb-2">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span>
                  <span className="font-bold">{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-xs">
                      {" "}
                      | <span className="italic">{proj.technologies}</span>
                    </span>
                  )}
                </span>
                <span className="text-xs">
                  {proj.startDate}
                  {proj.startDate && proj.endDate && " – "}
                  {proj.endDate}
                </span>
              </div>
              {proj.bullets.filter((b) => b.trim()).length > 0 && (
                <ul className="mt-1 ml-4 text-xs list-disc">
                  {proj.bullets
                    .filter((b) => b.trim())
                    .map((bullet, i) => (
                      <li key={i} className="mb-0.5">
                        {bullet}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {(skills.languages || skills.frameworks || skills.tools || skills.other) && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black mb-2">Technical Skills</h2>
          <div className="text-xs space-y-0.5">
            {skills.languages && (
              <p>
                <span className="font-bold">Languages:</span> {skills.languages}
              </p>
            )}
            {skills.frameworks && (
              <p>
                <span className="font-bold">Frameworks:</span> {skills.frameworks}
              </p>
            )}
            {skills.tools && (
              <p>
                <span className="font-bold">Developer Tools:</span> {skills.tools}
              </p>
            )}
            {skills.other && (
              <p>
                <span className="font-bold">Other:</span> {skills.other}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!personalInfo.fullName && education.length === 0 && experience.length === 0 && projects.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg">Your resume preview will appear here</p>
          <p className="text-sm">Start filling out the form on the left</p>
        </div>
      )}
    </div>
  )
}
