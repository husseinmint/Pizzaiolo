"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Direction = "ltr" | "rtl"

interface DirectionContextType {
  direction: Direction
  setDirection: (dir: Direction) => void
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

export function DirectionProvider({ children }: { children: ReactNode }) {
  const [direction, setDirectionState] = useState<Direction>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-direction")
      return (saved as Direction) || "ltr"
    }
    return "ltr"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app-direction", direction)
      document.documentElement.setAttribute("dir", direction)
    }
  }, [direction])

  const setDirection = (dir: Direction) => {
    setDirectionState(dir)
  }

  return <DirectionContext.Provider value={{ direction, setDirection }}>{children}</DirectionContext.Provider>
}

export function useDirection() {
  const context = useContext(DirectionContext)
  if (context === undefined) {
    throw new Error("useDirection must be used within a DirectionProvider")
  }
  return context
}


