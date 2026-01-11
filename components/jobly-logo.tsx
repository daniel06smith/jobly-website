import Image from 'next/image'

export function JoblyLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image 
        src="/jobly-logo.png" 
        alt="Jobly Logo" 
        width={40} 
        height={40}
        className="rounded-lg"
      />
      <span className="text-xl font-medium text-foreground">jobly</span>
    </div>
  )
}
