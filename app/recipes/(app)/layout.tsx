import type { ReactNode } from "react"

export const dynamic = 'force-dynamic'

export default function RecipesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
