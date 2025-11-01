"use client"

import type React from "react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getRecipeById, updateRecipe } from "@/lib/db/recipes"
import { validateRecipeForm } from "@/lib/validation"
import type { Recipe, Ingredient } from "@/lib/types/recipe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RecipeHeader } from "@/components/recipe-header"
import { FormError } from "@/components/form-error"
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react"
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
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; amount: string; unit: string }>>([])

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
              id: ing.id || Date.now().toString(),
              name: ing.name,
              amount: ing.amount?.toString() || "",
              unit: ing.unit || "",
            })),
          )
        } else {
          setIngredients([{ id: Date.now().toString(), name: "", amount: "", unit: "" }])
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const updateIngredient = (id: string, field: keyof { name: string; amount: string; unit: string }, value: string) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    )
  }

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", amount: "", unit: "" },
    ])
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
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

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href={`/recipes/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipe
          </Link>
        </Button>

        <Card className="border-border shadow-lg">
          <CardHeader className="border-b border-border pb-6">
            <CardTitle className="text-3xl font-bold">Edit Recipe</CardTitle>
            <p className="text-muted-foreground mt-2">
              Update your recipe details, ingredients, and instructions
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Recipe Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-xl font-semibold">Recipe Details</h3>
                </div>

                <div className="grid gap-6 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Recipe Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-base"
                      placeholder="Enter recipe name"
                    />
                    <FormError message={formErrors.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="resize-none"
                      placeholder="Describe your recipe..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                      </Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Pizza, Pasta, Dessert"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-sm font-medium">
                        Difficulty <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: "easy" | "medium" | "hard") =>
                          setFormData({ ...formData, difficulty: value })
                        }
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prepTime" className="text-sm font-medium">
                        Prep Time (min)
                      </Label>
                      <Input
                        id="prepTime"
                        name="prep_time_minutes"
                        type="number"
                        value={formData.prep_time_minutes}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                      <FormError message={formErrors.prep_time_minutes} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookTime" className="text-sm font-medium">
                        Cook Time (min)
                      </Label>
                      <Input
                        id="cookTime"
                        name="cook_time_minutes"
                        type="number"
                        value={formData.cook_time_minutes}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                      <FormError message={formErrors.cook_time_minutes} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="servings" className="text-sm font-medium">
                        Servings
                      </Label>
                      <Input
                        id="servings"
                        name="servings"
                        type="number"
                        value={formData.servings}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                      <FormError message={formErrors.servings} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm font-medium">
                      Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      name="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image_url && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border">
                        <img
                          src={formData.image_url}
                          alt="Recipe preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ingredients Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h3 className="text-xl font-semibold">Ingredients</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Ingredient
                  </Button>
                </div>

                <div className="space-y-3 pl-4">
                  {ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex gap-2 items-start group hover:bg-accent/50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
                        <Input
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) =>
                            updateIngredient(ingredient.id, "name", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Amount"
                          value={ingredient.amount}
                          onChange={(e) =>
                            updateIngredient(ingredient.id, "amount", e.target.value)
                          }
                          className="w-full md:w-28"
                        />
                        <Input
                          placeholder="Unit"
                          value={ingredient.unit}
                          onChange={(e) =>
                            updateIngredient(ingredient.id, "unit", e.target.value)
                          }
                          className="w-full md:w-24"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Instructions Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-xl font-semibold">Instructions</h3>
                </div>

                <div className="pl-4 space-y-2">
                  <Label htmlFor="instructions" className="text-sm font-medium">
                    Step-by-step instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={8}
                    className="resize-none font-mono text-sm"
                    placeholder="1. First step...&#10;2. Second step...&#10;3. Third step..."
                  />
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none sm:w-32"
                  asChild
                >
                  <Link href={`/recipes/${id}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={saving} className="flex-1 sm:flex-auto">
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
