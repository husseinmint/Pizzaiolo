"use client"

import Link from "next/link"
import { ChefHat, Plus, ShoppingCart, Package, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth-button"
import { useUser } from "@/lib/auth/hooks"
import { usePathname } from "next/navigation"
import { useDirection } from "@/lib/contexts/direction-context"

interface RecipeHeaderProps {
  showNewButton?: boolean
}

export function RecipeHeader({ showNewButton = true }: RecipeHeaderProps) {
  const { user } = useUser()
  const pathname = usePathname()
  const { direction, setDirection } = useDirection()

  const isActive = (path: string) => pathname?.startsWith(path)

  const toggleDirection = () => {
    setDirection(direction === "ltr" ? "rtl" : "ltr")
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10 no-print">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ChefHat className="w-6 h-6" />
          <span className="font-bold">Pizzailo</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/recipes">
            <Button variant={isActive("/recipes") ? "default" : "ghost"} size="sm">
              Recipes
            </Button>
          </Link>
          <Link href="/shopping-lists">
            <Button variant={isActive("/shopping-lists") ? "default" : "ghost"} size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Lists
            </Button>
          </Link>
          <Link href="/ingredients">
            <Button variant={isActive("/ingredients") ? "default" : "ghost"} size="sm" className="gap-2">
              <Package className="w-4 h-4" />
              Ingredients
            </Button>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={toggleDirection} className="gap-2" title={`Current: ${direction.toUpperCase()}`}>
            <Languages className="w-4 h-4" />
            {direction === "rtl" ? "RTL" : "LTR"}
          </Button>
          {showNewButton && user && (
            <Link href="/recipes/new">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                New Recipe
              </Button>
            </Link>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
