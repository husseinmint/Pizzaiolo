"use client"

import { createClient } from "@/lib/supabase/client"

export interface IngredientSummary {
  name: string
  total_amount: number | null
  unit: string | null
  recipe_count: number
  recipes: Array<{ id: string; name: string }>
}

export async function getAllIngredients(): Promise<IngredientSummary[]> {
  const supabase = createClient()

  const { data: ingredients, error } = await supabase.from("ingredients").select("name, amount, unit, recipe_id, recipes(id, name)")

  if (error) {
    console.error("[v0] Error fetching ingredients:", error)
    return []
  }

  // Group ingredients by name
  const grouped = new Map<string, IngredientSummary>()

  ingredients?.forEach((ing: any) => {
    const name = ing.name.toLowerCase().trim()
    if (!grouped.has(name)) {
      grouped.set(name, {
        name: ing.name,
        total_amount: 0,
        unit: ing.unit,
        recipe_count: 0,
        recipes: [],
      })
    }

    const item = grouped.get(name)!
    if (ing.amount) {
      item.total_amount = (item.total_amount || 0) + ing.amount
    }
    if (ing.recipes && ing.recipes.length > 0) {
      const recipe = ing.recipes[0]
      if (!item.recipes.find((r) => r.id === recipe.id)) {
        item.recipes.push({ id: recipe.id, name: recipe.name })
        item.recipe_count = item.recipes.length
      }
    }
  })

  return Array.from(grouped.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export async function searchIngredients(query: string): Promise<IngredientSummary[]> {
  const supabase = createClient()

  const { data: ingredients, error } = await supabase
    .from("ingredients")
    .select("name, amount, unit, recipe_id, recipes(id, name)")
    .ilike("name", `%${query}%`)

  if (error) {
    console.error("[v0] Error searching ingredients:", error)
    return []
  }

  // Group ingredients by name (same logic as getAllIngredients)
  const grouped = new Map<string, IngredientSummary>()

  ingredients?.forEach((ing: any) => {
    const name = ing.name.toLowerCase().trim()
    if (!grouped.has(name)) {
      grouped.set(name, {
        name: ing.name,
        total_amount: 0,
        unit: ing.unit,
        recipe_count: 0,
        recipes: [],
      })
    }

    const item = grouped.get(name)!
    if (ing.amount) {
      item.total_amount = (item.total_amount || 0) + ing.amount
    }
    if (ing.recipes && ing.recipes.length > 0) {
      const recipe = ing.recipes[0]
      if (!item.recipes.find((r) => r.id === recipe.id)) {
        item.recipes.push({ id: recipe.id, name: recipe.name })
        item.recipe_count = item.recipes.length
      }
    }
  })

  return Array.from(grouped.values()).sort((a, b) => a.name.localeCompare(b.name))
}


