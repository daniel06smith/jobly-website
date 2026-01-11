export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  linkedin: string
  github: string
  website: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Project {
  id: string
  name: string
  technologies: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Skills {
  languages: string
  frameworks: string
  tools: string
  other: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skills
}

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    languages: "",
    frameworks: "",
    tools: "",
    other: "",
  },
}

export function generateId(): string {
  return crypto.randomUUID()
}
