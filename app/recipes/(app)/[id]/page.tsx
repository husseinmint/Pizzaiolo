"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { getRecipeById, deleteRecipe } from "@/lib/db/recipes"
import { isFavorite, toggleFavorite } from "@/lib/db/favorites"
import type { Recipe, Ingredient } from "@/lib/types/recipe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [servingsMultiplier, setServingsMultiplier] = useState(1)
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
      window.location.href = "/recipes"
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

  const calculateScaledAmount = (amount: number | null): number | null => {
    if (amount === null) return null
    return Math.round((amount * servingsMultiplier) * 100) / 100
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

  return (
    <div className="min-h-screen bg-background">
      <RecipeHeader showNewButton={false} />

      <main className="max-w-4xl mx-auto px-4 py-8 print-main">
        {/* Print Content for Recipes */}
        {recipe && (
          <div className="recipe-print-content hidden print:block bg-white p-8" dir={direction}>
          <h1>{recipe.name}</h1>
          {recipe.category && <p style={{ marginBottom: '1rem' }}>{recipe.category}</p>}
          {recipe.description && <p style={{ marginBottom: '1.5rem' }}>{recipe.description}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {recipe.prep_time_minutes && (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18pt' }}>{recipe.prep_time_minutes}m</div>
                <div style={{ fontSize: '10pt' }}>Prep Time</div>
              </div>
            )}
            {recipe.cook_time_minutes && (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18pt' }}>{recipe.cook_time_minutes}m</div>
                <div style={{ fontSize: '10pt' }}>Cook Time</div>
              </div>
            )}
            {recipe.servings && (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18pt' }}>{recipe.servings}</div>
                <div style={{ fontSize: '10pt' }}>Servings</div>
              </div>
            )}
          </div>

          {ingredients.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    <strong>{ingredient.name}</strong>
                    {ingredient.amount && (
                      <span> - {calculateScaledAmount(ingredient.amount)} {ingredient.unit || ""}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions && (
            <div>
              <h2>Instructions</h2>
              <div className="instructions">
                {recipe.instructions.split("\n").map(
                  (line, index) =>
                    line.trim() && (
                      <p key={index}>
                        <strong>{index + 1}.</strong> {line.trim()}
                      </p>
                    ),
                )}
              </div>
            </div>
          )}
          </div>
        )}

        {/* Screen Content */}
        <div className="no-print">
          <Link href="/recipes" className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </Link>

          <div className="space-y-6">
          {recipe.image_url && (
            <div className="h-96 bg-muted rounded-lg overflow-hidden relative">
              <img
                src={recipe.image_url || "/placeholder.svg"}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleToggleFavorite}
                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <Heart className="w-6 h-6 text-white" fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">{recipe.name}</h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-foreground">
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </span>
            </div>
            {recipe.category && <p className="text-lg text-muted-foreground">{recipe.category}</p>}
            {recipe.description && <p className="text-lg text-foreground">{recipe.description}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {recipe.prep_time_minutes && (
              <Card className="border-border">
                <CardContent className="pt-6 space-y-2 text-center">
                  <Clock className="w-5 h-5 mx-auto opacity-60" />
                  <div className="text-2xl font-bold">{recipe.prep_time_minutes}m</div>
                  <div className="text-sm text-muted-foreground">Prep Time</div>
                </CardContent>
              </Card>
            )}
            {recipe.cook_time_minutes && (
              <Card className="border-border">
                <CardContent className="pt-6 space-y-2 text-center">
                  <Flame className="w-5 h-5 mx-auto opacity-60" />
                  <div className="text-2xl font-bold">{recipe.cook_time_minutes}m</div>
                  <div className="text-sm text-muted-foreground">Cook Time</div>
                </CardContent>
              </Card>
            )}
            {recipe.servings && (
              <Card className="border-border">
                <CardContent className="pt-6 space-y-2 text-center">
                  <Users className="w-5 h-5 mx-auto opacity-60" />
                  <div className="text-2xl font-bold">{recipe.servings}</div>
                  <div className="text-sm text-muted-foreground">Servings</div>
                </CardContent>
              </Card>
            )}
          </div>

          {ingredients.length > 0 && (
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ingredients</CardTitle>
                <div className="flex gap-2 items-center no-print">
                  {recipe.servings && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Servings:</span>
                      <input
                        type="number"
                        min="1"
                        value={servingsMultiplier * (recipe.servings || 1)}
                        onChange={(e) => {
                          const newServings = Number.parseInt(e.target.value) || 1
                          setServingsMultiplier(newServings / (recipe.servings || 1))
                        }}
                        className="w-16 px-2 py-1 border border-border rounded text-sm"
                      />
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setShowShoppingList(true)}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="ingredients-list space-y-2">
                  {ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full print-hidden"></span>
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.amount && (
                        <span className="text-muted-foreground">
                          {calculateScaledAmount(ingredient.amount)} {ingredient.unit || ""}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {recipe.instructions && (
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Instructions</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowCookingMode(true)} className="no-print">
                  <ChefHat className="w-4 h-4 mr-2" />
                  Cooking Mode
                </Button>
              </CardHeader>
              <CardContent>
                <div className="instructions space-y-4">
                  {recipe.instructions.split("\n").map(
                    (line, index) =>
                      line.trim() && (
                        <p key={index} className="text-foreground">
                          <span className="font-semibold">{index + 1}.</span> {line.trim()}
                        </p>
                      ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 pt-6 border-t border-border flex-wrap no-print">
            <Link href="/recipes" className="flex-1 min-w-[120px]">
              <Button variant="outline" className="w-full border-border bg-transparent">
                Back to Recipes
              </Button>
            </Link>
            <Button variant="outline" onClick={handlePrint} className="gap-2 border-border bg-transparent">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDuplicate} className="gap-2 border-border bg-transparent">
              <Copy className="w-4 h-4" />
              Duplicate
            </Button>
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Button variant="outline" className="gap-2 border-border bg-transparent">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
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
