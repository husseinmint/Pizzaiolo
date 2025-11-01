import type { ValidationError } from "@/lib/types/recipe"

export function validateRecipeForm(data: {
  name: string
  prep_time_minutes?: string | number
  cook_time_minutes?: string | number
  servings?: string | number
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: "name", message: "Recipe name is required" })
  } else if (data.name.trim().length < 3) {
    errors.push({ field: "name", message: "Recipe name must be at least 3 characters" })
  }

  if (data.prep_time_minutes) {
    const prep = Number(data.prep_time_minutes)
    if (isNaN(prep) || prep < 0) {
      errors.push({ field: "prep_time_minutes", message: "Prep time must be a positive number" })
    }
  }

  if (data.cook_time_minutes) {
    const cook = Number(data.cook_time_minutes)
    if (isNaN(cook) || cook < 0) {
      errors.push({ field: "cook_time_minutes", message: "Cook time must be a positive number" })
    }
  }

  if (data.servings) {
    const servings = Number(data.servings)
    if (isNaN(servings) || servings < 1) {
      errors.push({ field: "servings", message: "Servings must be at least 1" })
    }
  }

  return errors
}

export function validateIngredient(ingredient: { name: string; amount?: string; unit?: string }): ValidationError[] {
  const errors: ValidationError[] = []

  if (!ingredient.name || ingredient.name.trim().length === 0) {
    errors.push({ field: "ingredient_name", message: "Ingredient name is required" })
  }

  if (ingredient.amount) {
    const amount = Number(ingredient.amount)
    if (isNaN(amount) || amount <= 0) {
      errors.push({ field: "ingredient_amount", message: "Amount must be a positive number" })
    }
  }

  return errors
}
