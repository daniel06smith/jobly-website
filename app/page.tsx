import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JoblyLogo } from "@/components/jobly-logo"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Top bar */}
      <div className="h-2 w-full bg-foreground" />

      <header className="flex items-center p-6">
        <JoblyLogo />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
            You think big.
            <br />
            We&apos;ll elevate it.
          </h1>

          <p className="max-w-md text-lg text-muted-foreground">
            Works with AI to directly modify your resume that&apos;s tailored to jobs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[140px] bg-teal-600 hover:bg-teal-700 text-white">
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[140px] bg-transparent">
              <Link href="/auth/login">Log in</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <div className="h-2 w-full bg-foreground" />
    </div>
  )
}
