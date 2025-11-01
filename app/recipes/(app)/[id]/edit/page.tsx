"use client"

import type React from "react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getRecipeById, updateRecipe } from "@/lib/db/recipes"
import { validateRecipeForm } from "@/lib/validation"
import type { Recipe, Ingredient } from "@/lib/types/recipe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeHeader } from "@/components/recipe-header"
import { FormError } from "@/components/form-error"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/lib/auth/hooks"

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { toast } = useToast()
  const { user, loading: userLoading } = useUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "medium" as const,
    category: "",
    prep_time_minutes: "",
    cook_time_minutes: "",
    servings: "",
    instructions: "",
    image_url: "",
  })
  const [ingredients, setIngredients] = useState<Array<{ id?: string; name: string; amount: string; unit: string }>>([])

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, userLoading, router])

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const data = await getRecipeById(id)
      if (data) {
        setRecipe(data)

        setFormData({
          name: data.name,
          description: data.description || "",
          difficulty: data.difficulty,
          category: data.category || "",
          prep_time_minutes: data.prep_time_minutes?.toString() || "",
          cook_time_minutes: data.cook_time_minutes?.toString() || "",
          servings: data.servings?.toString() || "",
          instructions: data.instructions || "",
          image_url: data.image_url || "",
        })

        if (data.ingredients && data.ingredients.length > 0) {
          setIngredients(
            data.ingredients.map((ing) => ({
              id: ing.id,
              name: ing.name,
              amount: ing.amount?.toString() || "",
              unit: ing.unit || "",
            })),
          )
        } else {
          setIngredients([{ name: "", amount: "", unit: "" }])
        }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    const errors = validateRecipeForm({
      name: formData.name,
      prep_time_minutes: formData.prep_time_minutes,
      cook_time_minutes: formData.cook_time_minutes,
      servings: formData.servings,
    })

    if (errors.length > 0) {
      const errorMap: Record<string, string> = {}
      errors.forEach((err) => {
        errorMap[err.field] = err.message
      })
      setFormErrors(errorMap)
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const validIngredients: Ingredient[] = ingredients
        .filter((ing) => ing.name.trim())
        .map((ing) => ({
          id: ing.id || "",
          recipe_id: id,
          name: ing.name,
          amount: ing.amount ? Number.parseFloat(ing.amount) : null,
          unit: ing.unit || null,
          created_at: "",
        }))

      await updateRecipe(
        id,
        {
          name: formData.name,
          description: formData.description || null,
          difficulty: formData.difficulty,
          category: formData.category || null,
          prep_time_minutes: formData.prep_time_minutes ? Number.parseInt(formData.prep_time_minutes) : null,
          cook_time_minutes: formData.cook_time_minutes ? Number.parseInt(formData.cook_time_minutes) : null,
          servings: formData.servings ? Number.parseInt(formData.servings) : null,
          instructions: formData.instructions || null,
          image_url: formData.image_url || null,
        },
        validIngredients,
      )

      toast({
        title: "Success",
        description: "Recipe updated successfully",
      })

      router.push(`/recipes/${id}`)
    } catch (error) {
      console.error("[v0] Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/recipes/${id}`}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipe
        </Link>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Recipe Details</h3>

                <div>
                  <label className="block text-sm font-medium mb-2">Recipe Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  />
                  <FormError message={formErrors.name} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty *</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prep Time (min)</label>
                    <input
                      type="number"
                      name="prep_time_minutes"
                      value={formData.prep_time_minutes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    />
                    <FormError message={formErrors.prep_time_minutes} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cook Time (min)</label>
                    <input
                      type="number"
                      name="cook_time_minutes"
                      value={formData.cook_time_minutes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    />
                    <FormError message={formErrors.cook_time_minutes} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Servings</label>
                    <input
                      type="number"
                      name="servings"
                      value={formData.servings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    />
                    <FormError message={formErrors.servings} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Ingredients</h3>
                  <Button
                    type="button"
                    onClick={addIngredient}
                    variant="outline"
                    size="sm"
                    className="gap-1 border-border bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="Ingredient name"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                        className="w-24 px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="Amount"
                      />
                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                        className="w-20 px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="Unit"
                      />
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Instructions</h3>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-border">
                <Link href={`/recipes/${params.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-border bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
