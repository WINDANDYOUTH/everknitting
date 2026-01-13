'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { FileWarning } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const isDatabaseError = error.message.includes('P2010') || error.message.includes('does not exist')

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-neutral-50 shadow-sm m-6">
      <FileWarning className="w-12 h-12 text-amber-500 mb-4" />
      <h2 className="text-xl font-bold text-neutral-900">Something went wrong!</h2>
      <p className="text-neutral-600 mt-2 max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>

      {isDatabaseError && (
        <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded text-sm text-left max-w-lg">
          <p className="font-bold mb-2">Setup Required:</p>
          <p>It looks like the database tables haven't been created yet.</p>
          <p className="mt-2">Please run the SQL script provided in <code>docs/setup-database.sql</code> in your Supabase SQL Editor.</p>
        </div>
      )}

      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm text-white transition-colors hover:bg-emerald-700"
      >
        Try again
      </button>
    </div>
  )
}
