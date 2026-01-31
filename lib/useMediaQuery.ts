"use client"

import { useState, useEffect, useCallback } from "react"

export function useMediaQuery(query: string): boolean {
  // Initialize with a default value to avoid hydration mismatch
  const [matches, setMatches] = useState(false)

  // Use useCallback to ensure the listener doesn't change on every render
  const handleChange = useCallback((event: MediaQueryListEvent) => {
    setMatches(event.matches)
  }, [])

  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Set initial value
      setMatches(media.matches)

      // Use the stable callback for the event listener
      media.addEventListener("change", handleChange)

      // Clean up
      return () => media.removeEventListener("change", handleChange)
    }

    // Default return for SSR
    return undefined
  }, [query, handleChange]) // Only re-run if query or handleChange changes

  return matches
}
