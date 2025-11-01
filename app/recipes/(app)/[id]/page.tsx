"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { getRecipeById, deleteRecipe } from "@/lib/db/recipes"
import { isFavorite, toggleFavorite } from "@/lib/db/favorites"
import type { Recipe, Ingredient } from "@/lib/types/recipe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RecipeHeader } from "@/components/recipe-header"
import { DeleteDialog } from "@/components/delete-dialog"
import { ArrowLeft, Edit2, Trash2, Clock, Users, Flame, Heart, ShoppingCart, ChefHat, Copy, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShoppingList } from "@/components/shopping-list"
import { CookingMode } from "@/components/cooking-mode"
import { duplicateRecipe } from "@/lib/db/recipes"
import { useRouter } from "next/navigation"
import { useDirection } from "@/lib/contexts/direction-context"

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { direction } = useDirection()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [showCookingMode, setShowCookingMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const data = await getRecipeById(id)
      if (data) {
        setRecipe(data)
        setIngredients(data.ingredients || [])
        const favStatus = await isFavorite(id)
        setIsFav(favStatus)
      }
    } catch (error) {
      console.error("[v0] Error fetching recipe:", error)
      toast({
        title: "Error",
        description: "Failed to load recipe",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteRecipe(id)
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      })
      router.push("/recipes")
    } catch (error) {
      console.error("[v0] Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive",
      })
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  const handleToggleFavorite = async () => {
    try {
      const newStatus = await toggleFavorite(id)
      setIsFav(newStatus)
      toast({
        title: newStatus ? "Added to favorites" : "Removed from favorites",
        description: newStatus ? "Recipe saved to your favorites" : "Recipe removed from your favorites",
      })
    } catch (error) {
      console.error("[v0] Favorite error:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      })
    }
  }

  const handleDuplicate = async () => {
    try {
      const newRecipe = await duplicateRecipe(id)
      toast({
        title: "Success",
        description: "Recipe duplicated successfully",
      })
      router.push(`/recipes/${newRecipe.id}`)
    } catch (error) {
      console.error("[v0] Duplicate error:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate recipe",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Recipe not found</p>
          <Link href="/recipes">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4" />
              Back to Recipes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const instructionsArray = recipe.instructions
    ? recipe.instructions.split("\n").filter((line) => line.trim())
    : []

  return (
    <div className="min-h-screen bg-background">
      <RecipeHeader showNewButton={false} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Print Version */}
        <div className="hidden print:block bg-white p-8" dir={direction}>
          <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
          {recipe.category && <p className="text-xl text-muted-foreground mb-4">{recipe.category}</p>}
          {recipe.description && <p className="mb-6">{recipe.description}</p>}
          
          {ingredients.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
              <ul className="space-y-2">
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    <strong>{ingredient.name}</strong>
                    {ingredient.amount && (
                      <span> - {ingredient.amount} {ingredient.unit || ""}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {instructionsArray.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
              <ol className="space-y-2">
                {instructionsArray.map((instruction, index) => (
                  <li key={index}>
                    <strong>{index + 1}.</strong> {instruction.trim()}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Screen Version */}
        <div className="print:hidden">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>

          <div className="space-y-8">
            {/* Hero Image */}
            {recipe.image_url && (
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={recipe.image_url || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute top-6 right-6 h-12 w-12 rounded-full backdrop-blur-md transition-all ${
                    isFav 
                      ? 'bg-red-500/90 hover:bg-red-600/90 text-white' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
                </Button>
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      {recipe.category && (
                        <Badge className="mb-3 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30">
                          {recipe.category}
                        </Badge>
                      )}
                      <h1 className="text-5xl font-bold text-white mb-2">{recipe.name}</h1>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-sm px-4 py-2 bg-white/90 backdrop-blur-md capitalize"
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              {recipe.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {recipe.description}
                </p>
              )}

              {/* Quick Info */}
              {(recipe.prep_time_minutes || recipe.cook_time_minutes || recipe.servings) && (
                <div className="grid grid-cols-3 gap-4">
                  {recipe.prep_time_minutes && (
                    <Card className="border-border/50">
                      <CardContent className="pt-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Prep Time</p>
                          <p className="font-semibold">{recipe.prep_time_minutes}m</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {recipe.cook_time_minutes && (
                    <Card className="border-border/50">
                      <CardContent className="pt-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                          <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cook Time</p>
                          <p className="font-semibold">{recipe.cook_time_minutes}m</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {recipe.servings && (
                    <Card className="border-border/50">
                      <CardContent className="pt-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Users className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Servings</p>
                          <p className="font-semibold">{recipe.servings}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Ingredients Card */}
            {ingredients.length > 0 && (
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-2xl">Ingredients</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowShoppingList(true)}>
                    <ShoppingCart className="w-4 h-4" />
                    Add to List
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {ingredients.map((ingredient) => (
                      <li key={ingredient.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          <span className="font-medium">{ingredient.name}</span>
                        </div>
                        {ingredient.amount && (
                          <span className="text-muted-foreground font-mono text-sm">
                            {ingredient.amount} {ingredient.unit || ""}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Instructions Card */}
            {instructionsArray.length > 0 && (
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-2xl">Instructions</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowCookingMode(true)}>
                    <ChefHat className="w-4 h-4" />
                    Cooking Mode
                  </Button>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-6">
                    {instructionsArray.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-foreground leading-relaxed pt-1">{instruction.trim()}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Separator />
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                className="flex-1 min-w-[140px]"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recipes
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/recipes/${recipe.id}/edit`}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </main>

      <DeleteDialog
        open={deleteOpen}
        title="Delete Recipe"
        description="Are you sure you want to delete this recipe? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        isLoading={deleting}
      />

      {showShoppingList && (
        <ShoppingList ingredients={ingredients} onClose={() => setShowShoppingList(false)} />
      )}

      {showCookingMode && recipe && (
        <CookingMode
          instructions={recipe.instructions || ""}
          prepTime={recipe.prep_time_minutes}
          cookTime={recipe.cook_time_minutes}
          onClose={() => setShowCookingMode(false)}
        />
      )}
    </div>
  )
}
