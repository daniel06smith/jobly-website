export function JoblyLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600">
        <span className="text-xl font-bold text-white">J</span>
      </div>
      <span className="text-xl font-medium text-foreground">jobly</span>
    </div>
  )
}
