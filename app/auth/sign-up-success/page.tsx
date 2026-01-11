import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JoblyLogo } from "@/components/jobly-logo"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center gap-3 p-6">
        <Link href="/">
          <JoblyLogo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <Mail className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-muted-foreground mt-2">
                We&apos;ve sent you a confirmation link. Please check your email to verify your account before signing
                in.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
