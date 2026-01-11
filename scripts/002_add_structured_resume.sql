-- Add structured resume data to the resumes table
-- This allows users to either upload a PDF OR fill out a form

-- Add new columns for structured data
ALTER TABLE public.resumes
ADD COLUMN IF NOT EXISTS resume_type TEXT DEFAULT 'pdf' CHECK (resume_type IN ('pdf', 'structured')),
ADD COLUMN IF NOT EXISTS structured_data JSONB;

-- The structured_data JSONB will contain:
-- {
--   "personalInfo": {
--     "fullName": "Jake Ryan",
--     "email": "jake@email.com",
--     "phone": "123-456-7890",
--     "linkedin": "linkedin.com/in/jake",
--     "github": "github.com/jake",
--     "website": ""
--   },
--   "education": [
--     {
--       "id": "uuid",
--       "school": "University Name",
--       "degree": "Bachelor of Science",
--       "field": "Computer Science",
--       "location": "City, State",
--       "startDate": "Aug 2018",
--       "endDate": "May 2022",
--       "gpa": "3.8"
--     }
--   ],
--   "experience": [
--     {
--       "id": "uuid",
--       "title": "Software Engineer",
--       "company": "Company Name",
--       "location": "City, State",
--       "startDate": "Jun 2022",
--       "endDate": "Present",
--       "bullets": [
--         "Developed feature X using React and Node.js",
--         "Led team of 3 engineers"
--       ]
--     }
--   ],
--   "projects": [
--     {
--       "id": "uuid",
--       "name": "Project Name",
--       "technologies": "React, Node.js, PostgreSQL",
--       "startDate": "Jan 2023",
--       "endDate": "Mar 2023",
--       "bullets": [
--         "Built a full-stack application"
--       ]
--     }
--   ],
--   "skills": {
--     "languages": "JavaScript, Python, Java",
--     "frameworks": "React, Node.js, Django",
--     "tools": "Git, Docker, AWS",
--     "other": ""
--   }
-- }

-- Make file_name and file_url nullable for structured resumes
ALTER TABLE public.resumes
ALTER COLUMN file_name DROP NOT NULL,
ALTER COLUMN file_url DROP NOT NULL;

-- Add constraint to ensure either PDF data or structured data is present
-- (We'll handle this in application logic instead to avoid complex constraints)
