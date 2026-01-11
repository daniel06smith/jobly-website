"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { type ResumeData, generateId } from "./types"

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    })
  }

  const updateSkills = (field: string, value: string) => {
    onChange({
      ...data,
      skills: { ...data.skills, [field]: value },
    })
  }

  // Education handlers
  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          id: generateId(),
          school: "",
          degree: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    })
  }

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }

  // Experience handlers
  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        {
          id: generateId(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: [""],
        },
      ],
    })
  }

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    })
  }

  const addExperienceBullet = (expId: string) => {
    const exp = data.experience.find((e) => e.id === expId)
    if (exp) {
      updateExperience(expId, "bullets", [...exp.bullets, ""])
    }
  }

  const updateExperienceBullet = (expId: string, index: number, value: string) => {
    const exp = data.experience.find((e) => e.id === expId)
    if (exp) {
      const newBullets = [...exp.bullets]
      newBullets[index] = value
      updateExperience(expId, "bullets", newBullets)
    }
  }

  const removeExperienceBullet = (expId: string, index: number) => {
    const exp = data.experience.find((e) => e.id === expId)
    if (exp && exp.bullets.length > 1) {
      updateExperience(
        expId,
        "bullets",
        exp.bullets.filter((_, i) => i !== index),
      )
    }
  }

  // Project handlers
  const addProject = () => {
    onChange({
      ...data,
      projects: [
        ...data.projects,
        {
          id: generateId(),
          name: "",
          technologies: "",
          startDate: "",
          endDate: "",
          bullets: [""],
        },
      ],
    })
  }

  const updateProject = (id: string, field: string, value: string | string[]) => {
    onChange({
      ...data,
      projects: data.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    })
  }

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((proj) => proj.id !== id),
    })
  }

  const addProjectBullet = (projId: string) => {
    const proj = data.projects.find((p) => p.id === projId)
    if (proj) {
      updateProject(projId, "bullets", [...proj.bullets, ""])
    }
  }

  const updateProjectBullet = (projId: string, index: number, value: string) => {
    const proj = data.projects.find((p) => p.id === projId)
    if (proj) {
      const newBullets = [...proj.bullets]
      newBullets[index] = value
      updateProject(projId, "bullets", newBullets)
    }
  }

  const removeProjectBullet = (projId: string, index: number) => {
    const proj = data.projects.find((p) => p.id === projId)
    if (proj && proj.bullets.length > 1) {
      updateProject(
        projId,
        "bullets",
        proj.bullets.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Jake Ryan"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jake@email.com"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="123-456-7890"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/jake"
                value={data.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                placeholder="github.com/jake"
                value={data.personalInfo.github}
                onChange={(e) => updatePersonalInfo("github", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="jakesite.com"
                value={data.personalInfo.website}
                onChange={(e) => updatePersonalInfo("website", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Education</CardTitle>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.education.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No education added yet. Click &quot;Add&quot; to get started.
            </p>
          ) : (
            data.education.map((edu, index) => (
              <div key={edu.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Education {index + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>School *</Label>
                    <Input
                      placeholder="Southwestern University"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Georgetown, TX"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      placeholder="Bachelor of Arts"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input
                      placeholder="Computer Science"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      placeholder="Aug. 2018"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      placeholder="May 2021"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Experience</CardTitle>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.experience.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No experience added yet. Click &quot;Add&quot; to get started.
            </p>
          ) : (
            data.experience.map((exp, index) => (
              <div key={exp.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Experience {index + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input
                      placeholder="Software Engineer"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input
                      placeholder="Tech Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Austin, TX"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        placeholder="Jun. 2022"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        placeholder="Present"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Bullet Points</Label>
                    <Button variant="ghost" size="sm" onClick={() => addExperienceBullet(exp.id)}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add Bullet
                    </Button>
                  </div>
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <Input
                        placeholder="Describe your achievement or responsibility..."
                        value={bullet}
                        onChange={(e) => updateExperienceBullet(exp.id, bulletIndex, e.target.value)}
                        className="flex-1"
                      />
                      {exp.bullets.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeExperienceBullet(exp.id, bulletIndex)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Projects</CardTitle>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.projects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No projects added yet. Click &quot;Add&quot; to get started.
            </p>
          ) : (
            data.projects.map((proj, index) => (
              <div key={proj.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Project {index + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project Name *</Label>
                    <Input
                      placeholder="Gitlytics"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Technologies</Label>
                    <Input
                      placeholder="Python, Flask, React"
                      value={proj.technologies}
                      onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      placeholder="Jun. 2020"
                      value={proj.startDate}
                      onChange={(e) => updateProject(proj.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      placeholder="Present"
                      value={proj.endDate}
                      onChange={(e) => updateProject(proj.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Bullet Points</Label>
                    <Button variant="ghost" size="sm" onClick={() => addProjectBullet(proj.id)}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add Bullet
                    </Button>
                  </div>
                  {proj.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <Input
                        placeholder="Describe the project feature or your contribution..."
                        value={bullet}
                        onChange={(e) => updateProjectBullet(proj.id, bulletIndex, e.target.value)}
                        className="flex-1"
                      />
                      {proj.bullets.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeProjectBullet(proj.id, bulletIndex)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technical Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="languages">Languages</Label>
            <Input
              id="languages"
              placeholder="JavaScript, Python, Java, C++"
              value={data.skills.languages}
              onChange={(e) => updateSkills("languages", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frameworks">Frameworks / Libraries</Label>
            <Input
              id="frameworks"
              placeholder="React, Node.js, Django, Flask"
              value={data.skills.frameworks}
              onChange={(e) => updateSkills("frameworks", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tools">Developer Tools</Label>
            <Input
              id="tools"
              placeholder="Git, Docker, AWS, VS Code"
              value={data.skills.tools}
              onChange={(e) => updateSkills("tools", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="other">Other Skills</Label>
            <Input
              id="other"
              placeholder="Agile, Scrum, Technical Writing"
              value={data.skills.other}
              onChange={(e) => updateSkills("other", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
