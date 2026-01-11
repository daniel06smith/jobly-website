-- Create resumes table to store user resume data
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One resume per user
);

-- Create job_postings table to store job descriptions for analysis
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analyses table to store AI feedback results
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  overall_score INTEGER,
  suggestions JSONB, -- Array of suggestion objects
  keywords_found JSONB, -- Keywords from job posting found in resume
  keywords_missing JSONB, -- Keywords from job posting missing from resume
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resumes
CREATE POLICY "Users can view their own resume" ON public.resumes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resume" ON public.resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resume" ON public.resumes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resume" ON public.resumes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for job_postings
CREATE POLICY "Users can view their own job postings" ON public.job_postings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own job postings" ON public.job_postings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own job postings" ON public.job_postings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own job postings" ON public.job_postings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analyses
CREATE POLICY "Users can view their own analyses" ON public.analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analyses" ON public.analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analyses" ON public.analyses
  FOR DELETE USING (auth.uid() = user_id);
