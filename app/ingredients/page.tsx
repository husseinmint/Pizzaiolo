"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllIngredients, searchIngredients, type IngredientSummary } from "@/lib/db/ingredients"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeHeader } from "@/components/recipe-header"
import { Input } from "@/components/ui/input"
import { Search, ChefHat, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function IngredientsPage() {
  const { toast } = useToast()
  const [ingredients, setIngredients] = useState<IngredientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchIngredients()
  }, [])

  const fetchIngredients = async () => {
    try {
      const data = await getAllIngredients()
      setIngredients(data)
    } catch (error) {
      console.error("[v0] Error fetching ingredients:", error)
      toast({
        title: "Error",
        description: "Failed to load ingredients",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchIngredients()
      return
    }

    setSearching(true)
    try {
      const results = await searchIngredients(searchTerm.trim())
      setIngredients(results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search ingredients",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <RecipeHeader showNewButton={false} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ingredients</h1>
            <p className="text-muted-foreground mt-1">Browse all ingredients used in your recipes</p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={searching}>
              <Search className="w-4 h-4 mr-2" />
              {searching ? "Searching..." : "Search"}
            </Button>
            {searchTerm && (
              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                fetchIngredients()
              }}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {ingredients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm ? "No ingredients found" : "No ingredients yet. Create some recipes to see ingredients here!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map((ingredient) => (
              <Card key={ingredient.name} className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {ingredient.name}
                  </CardTitle>
                  <CardDescription>
                    Used in {ingredient.recipe_count} recipe{ingredient.recipe_count !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ingredient.total_amount && ingredient.unit && (
                    <p className="text-sm text-muted-foreground mb-3">
                      Total: {ingredient.total_amount} {ingredient.unit}
                    </p>
                  )}
                  {ingredient.recipes.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Recipes:</p>
                      <div className="space-y-1">
                        {ingredient.recipes.slice(0, 3).map((recipe) => (
                          <Link
                            key={recipe.id}
                            href={`/recipes/${recipe.id}`}
                            className="block text-sm text-primary hover:underline"
                          >
                            • {recipe.name}
                          </Link>
                        ))}
                        {ingredient.recipes.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{ingredient.recipes.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}


