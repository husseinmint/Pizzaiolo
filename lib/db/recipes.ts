import { createClient } from "@/lib/supabase/client"
import type { Recipe, Ingredient, RecipeWithIngredients } from "@/lib/types/recipe"

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching recipes:", error)
    throw new Error("Failed to fetch recipes")
  }
  return data || []
}

export async function getRecipeById(id: string): Promise<RecipeWithIngredients | null> {
  const supabase = createClient()

  const { data: recipe, error: recipeError } = await supabase.from("recipes").select("*").eq("id", id).single()

  if (recipeError) {
    console.error("[v0] Error fetching recipe:", recipeError)
    return null
  }

  const { data: ingredients, error: ingredientsError } = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", id)

  if (ingredientsError) {
    console.error("[v0] Error fetching ingredients:", ingredientsError)
    return null
  }

  return {
    ...recipe,
    ingredients: ingredients || [],
  }
}

export async function createRecipe(
  recipe: Omit<Recipe, "id" | "created_at" | "updated_at">,
  ingredients: Ingredient[],
): Promise<Recipe> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      name: recipe.name,
      description: recipe.description || null,
      difficulty: recipe.difficulty,
      category: recipe.category || null,
      prep_time_minutes: recipe.prep_time_minutes || null,
      cook_time_minutes: recipe.cook_time_minutes || null,
      servings: recipe.servings || null,
      instructions: recipe.instructions || null,
      image_url: recipe.image_url || null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating recipe:", error)
    throw new Error("Failed to create recipe")
  }

  if (ingredients.length > 0) {
    const { error: ingredientsError } = await supabase.from("ingredients").insert(
      ingredients.map((ing) => ({
        recipe_id: data.id,
        name: ing.name,
        amount: ing.amount || null,
        unit: ing.unit || null,
      })),
    )

    if (ingredientsError) {
      console.error("[v0] Error adding ingredients:", ingredientsError)
      throw new Error("Failed to add ingredients")
    }
  }

  return data
}

export async function updateRecipe(
  id: string,
  recipe: Partial<Omit<Recipe, "id" | "created_at" | "updated_at">>,
  ingredients: Ingredient[],
): Promise<Recipe> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("recipes")
    .update({
      name: recipe.name,
      description: recipe.description || null,
      difficulty: recipe.difficulty,
      category: recipe.category || null,
      prep_time_minutes: recipe.prep_time_minutes || null,
      cook_time_minutes: recipe.cook_time_minutes || null,
      servings: recipe.servings || null,
      instructions: recipe.instructions || null,
      image_url: recipe.image_url || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating recipe:", error)
    throw new Error("Failed to update recipe")
  }

  await supabase.from("ingredients").delete().eq("recipe_id", id)

  if (ingredients.length > 0) {
    const { error: ingredientsError } = await supabase.from("ingredients").insert(
      ingredients.map((ing) => ({
        recipe_id: id,
        name: ing.name,
        amount: ing.amount || null,
        unit: ing.unit || null,
      })),
    )

    if (ingredientsError) {
      console.error("[v0] Error updating ingredients:", ingredientsError)
      throw new Error("Failed to update ingredients")
    }
  }

  return data
}

export async function deleteRecipe(id: string): Promise<void> {
  const supabase = createClient()

  const { error: ingredientsError } = await supabase.from("ingredients").delete().eq("recipe_id", id)

  if (ingredientsError) {
    console.error("[v0] Error deleting ingredients:", ingredientsError)
    throw new Error("Failed to delete recipe")
  }

  const { error: recipeError } = await supabase.from("recipes").delete().eq("id", id)

  if (recipeError) {
    console.error("[v0] Error deleting recipe:", recipeError)
    throw new Error("Failed to delete recipe")
  }
}

export async function duplicateRecipe(id: string): Promise<Recipe> {
  const supabase = createClient()

  // Get the original recipe
  const original = await getRecipeById(id)
  if (!original) {
    throw new Error("Recipe not found")
  }

  // Create new recipe with "Copy of" prefix
  const newRecipe = await createRecipe(
    {
      name: `Copy of ${original.name}`,
      description: original.description,
      difficulty: original.difficulty,
      category: original.category,
      prep_time_minutes: original.prep_time_minutes,
      cook_time_minutes: original.cook_time_minutes,
      servings: original.servings,
      instructions: original.instructions,
      image_url: original.image_url,
    },
    original.ingredients.map((ing) => ({
      id: "",
      recipe_id: "",
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      created_at: "",
    })),
  )

  return newRecipe
}

export async function getAllCategories(): Promise<string[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("recipes")
    .select("category")
    .not("category", "is", null)

  if (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }

  const uniqueCategories = Array.from(
    new Set(data.map((r) => r.category).filter(Boolean))
  ) as string[]

  return uniqueCategories.sort()
}

export async function searchRecipes(
  query: string,
  difficulty?: string,
  category?: string,
  favoritesOnly?: boolean,
): Promise<Recipe[]> {
  const supabase = createClient()

  let queryBuilder = supabase.from("recipes").select("*")

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
  }

  if (difficulty) {
    queryBuilder = queryBuilder.eq("difficulty", difficulty)
  }

  if (category) {
    queryBuilder = queryBuilder.eq("category", category)
  }

  const { data, error } = await queryBuilder.order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error searching recipes:", error)
    return []
  }

  let results = data || []

  // Filter favorites on client side (since we need user context)
  if (favoritesOnly) {
    // This will be handled in the component with favorites list
    return results
  }

  return results
}
