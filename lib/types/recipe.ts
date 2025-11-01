export interface Recipe {
  id: string
  name: string
  description: string | null
  difficulty: "easy" | "medium" | "hard"
  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number | null
  category: string | null
  instructions: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  isFavorite?: boolean
}

export interface Ingredient {
  id: string
  recipe_id: string
  name: string
  amount: number | null
  unit: string | null
  created_at: string
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Ingredient[]
}

export interface Favorite {
  id: string
  recipe_id: string
  created_at: string
}

export interface ValidationError {
  field: string
  message: string
}
