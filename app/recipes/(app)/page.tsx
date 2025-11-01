"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { searchRecipes, deleteRecipe } from "@/lib/db/recipes"
import { getFavoriteRecipes, toggleFavorite } from "@/lib/db/favorites"
import type { Recipe } from "@/lib/types/recipe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeHeader } from "@/components/recipe-header"
import { RecipeLoading } from "@/components/recipe-loading"
import { DeleteDialog } from "@/components/delete-dialog"
import { Edit2, Trash2, Clock, Users, Heart, Filter, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [recipesData, favoritesData] = await Promise.all([searchRecipes(""), getFavoriteRecipes()])

      setRecipes(recipesData)
      setFavorites(favoritesData)
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(recipesData.map((r) => r.category).filter(Boolean))) as string[]
      setCategories(uniqueCategories.sort())
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load recipes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setSearching(true)
    try {
      let results = await searchRecipes(
        searchTerm,
        difficulty || undefined,
        category || undefined,
      )
      
      // Filter favorites on client side if needed
      if (showFavoritesOnly) {
        results = results.filter((r) => favorites.includes(r.id))
      }
      
      setRecipes(results)
    } catch (error) {
      console.error("[v0] Search error:", error)
      toast({
        title: "Error",
        description: "Failed to search recipes",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setDifficulty("")
    setCategory("")
    setShowFavoritesOnly(false)
    fetchInitialData()
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(deleteId)
    try {
      await deleteRecipe(deleteId)
      setRecipes(recipes.filter((r) => r.id !== deleteId))
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
      setDeleteOpen(false)
      setDeleteId(null)
    }
  }

  const handleToggleFavorite = async (recipeId: string) => {
    try {
      const isFav = await toggleFavorite(recipeId)
      if (isFav) {
        setFavorites([...favorites, recipeId])
        toast({
          title: "Added to favorites",
          description: "Recipe saved to your favorites",
        })
      } else {
        setFavorites(favorites.filter((id) => id !== recipeId))
        toast({
          title: "Removed from favorites",
          description: "Recipe removed from your favorites",
        })
      }
    } catch (error) {
      console.error("[v0] Favorite error:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <RecipeLoading />
  }

  return (
    <div className="min-h-screen bg-background">
      <RecipeHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Our Recipes</h1>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background"
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowFavoritesOnly(!showFavoritesOnly)
                  setTimeout(handleSearch, 0)
                }}
                className="gap-2"
              >
                <Star className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Favorites Only
              </Button>
              {(searchTerm || difficulty || category || showFavoritesOnly) && (
                <Button variant="outline" size="sm" onClick={handleClearFilters} className="gap-2">
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">No recipes found.</p>
            <Link href="/recipes/new">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">Create Recipe</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="border-border hover:border-primary/50 transition-colors overflow-hidden flex flex-col"
              >
                {recipe.image_url && (
                  <div className="h-40 bg-muted overflow-hidden relative">
                    <img
                      src={recipe.image_url || "/placeholder.svg"}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleToggleFavorite(recipe.id)}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <Heart
                        className="w-4 h-4 text-white"
                        fill={favorites.includes(recipe.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2">{recipe.name}</CardTitle>
                      {recipe.category && <CardDescription className="mt-1">{recipe.category}</CardDescription>}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap bg-muted text-foreground">
                      {recipe.difficulty}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {recipe.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>
                  )}

                  <div className="flex gap-4 text-sm text-muted-foreground mb-4 mt-auto">
                    {recipe.prep_time_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.prep_time_minutes}m prep
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Link href={`/recipes/${recipe.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-border bg-transparent">
                        View
                      </Button>
                    </Link>
                    <Link href={`/recipes/${recipe.id}/edit`}>
                      <Button variant="outline" size="sm" className="border-border bg-transparent">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteId(recipe.id)
                        setDeleteOpen(true)
                      }}
                      disabled={deleting === recipe.id}
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <DeleteDialog
        open={deleteOpen}
        title="Delete Recipe"
        description="Are you sure you want to delete this recipe? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        isLoading={deleting !== null}
      />
    </div>
  )
}
