"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { searchRecipes, deleteRecipe, getAllCategories } from "@/lib/db/recipes"
import { getFavoriteRecipes, toggleFavorite } from "@/lib/db/favorites"
import type { Recipe } from "@/lib/types/recipe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecipeHeader } from "@/components/recipe-header"
import { RecipeLoading } from "@/components/recipe-loading"
import { DeleteDialog } from "@/components/delete-dialog"
import { Edit2, Trash2, Clock, ChefHat, Heart, Filter, Star } from "lucide-react"
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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchInitialData()
  }, [])

  // Auto-search when filters change (but not on initial load)
  useEffect(() => {
    if (!loading && (category || difficulty || showFavoritesOnly)) {
      const timeoutId = setTimeout(() => {
        handleSearch()
      }, 300) // Debounce for 300ms
      
      return () => clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty, showFavoritesOnly])

  const fetchInitialData = async () => {
    try {
      const [recipesData, favoritesData, allCategories] = await Promise.all([
        searchRecipes(""), 
        getFavoriteRecipes(),
        getAllCategories()
      ])

      setRecipes(recipesData)
      setFavorites(favoritesData)
      setCategories(allCategories)
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
                className="px-4 py-2 border border-border rounded-lg bg-background min-w-[140px]"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background min-w-[160px]"
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
              >
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>
            
            {/* Category Quick Filters */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Quick filters:</span>
                <Button
                  variant={category === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory("")}
                  className="h-8"
                >
                  All
                </Button>
                {categories.slice(0, 6).map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className="h-8"
                  >
                    {cat}
                  </Button>
                ))}
                {categories.length > 6 && (
                  <span className="text-sm text-muted-foreground">
                    +{categories.length - 6} more
                  </span>
                )}
              </div>
            )}
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
            {recipes.map((recipe) => {
              const imageLoaded = loadedImages.has(recipe.id)
              
              return (
                <div
                  key={recipe.id}
                  className="group relative bg-card text-card-foreground rounded-2xl border border-border hover:border-foreground/20 transition-all duration-300 overflow-hidden flex flex-col shadow-sm hover:shadow-md"
                >
                  {/* Image Section */}
                  {recipe.image_url && (
                    <div className="relative h-56 bg-muted overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />
                      <img
                        alt={recipe.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                        } group-hover:scale-105`}
                        src={recipe.image_url || "/placeholder.svg"}
                        onLoad={() => {
                          setLoadedImages((prev) => new Set(prev).add(recipe.id))
                        }}
                      />
                      {!imageLoaded && (
                        <div className="absolute inset-0 bg-muted animate-pulse" />
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => handleToggleFavorite(recipe.id)}
                        className="absolute top-4 right-4 p-2.5 bg-background/80 backdrop-blur-sm hover:bg-background border border-border rounded-full transition-all duration-300 z-10 hover:scale-110"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-300 ${
                            favorites.includes(recipe.id)
                              ? 'fill-foreground text-foreground'
                              : 'text-foreground/60'
                          }`}
                        />
                      </button>

                      {/* Difficulty Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-background/80 backdrop-blur-sm border border-border text-foreground font-medium capitalize px-3 py-1"
                        >
                          {recipe.difficulty}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex flex-col flex-1 p-6">
                    {/* Header */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground leading-tight line-clamp-2 flex-1">
                          {recipe.name}
                        </h3>
                      </div>
                      {recipe.category && (
                        <p className="text-sm text-muted-foreground">{recipe.category}</p>
                      )}
                    </div>

                    {/* Description */}
                    {recipe.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {recipe.description}
                      </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                      {recipe.prep_time_minutes && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{recipe.prep_time_minutes}m prep</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center gap-1.5">
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Link href={`/recipes/${recipe.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-background hover:bg-muted border-border"
                        >
                          View Recipe
                        </Button>
                      </Link>
                      <Link href={`/recipes/${recipe.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background hover:bg-muted border-border"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-background hover:bg-destructive/10 border-border text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeleteId(recipe.id)
                          setDeleteOpen(true)
                        }}
                        disabled={deleting === recipe.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
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
