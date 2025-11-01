"use client"

import { createClient } from "@/lib/supabase/client"

export async function toggleFavorite(recipeId: string): Promise<boolean> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be signed in to favorite recipes")
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error removing favorite:", error)
      throw new Error("Failed to remove favorite")
    }
    return false
  } else {
    const { error } = await supabase.from("favorites").insert({
      recipe_id: recipeId,
      user_id: user.id,
    })

    if (error) {
      console.error("[v0] Error adding favorite:", error)
      throw new Error("Failed to add favorite")
    }
    return true
  }
}

export async function isFavorite(recipeId: string): Promise<boolean> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .single()

  return !!data
}

export async function getFavoriteRecipes(): Promise<string[]> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error fetching favorites:", error)
    return []
  }

  return (data || []).map((fav) => fav.recipe_id)
}
