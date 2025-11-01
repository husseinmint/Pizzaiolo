"use client"

import { createClient } from "@/lib/supabase/client"

export interface ShoppingListItem {
  id: string
  shopping_list_id: string
  name: string
  amount: number | null
  unit: string | null
  is_checked: boolean
  created_at: string
}

export interface ShoppingList {
  id: string
  user_id: string
  name: string
  is_completed: boolean
  created_at: string
  updated_at: string
  items?: ShoppingListItem[]
}

export async function getShoppingLists(): Promise<ShoppingList[]> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be signed in")
  }

  const { data, error } = await supabase
    .from("shopping_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching shopping lists:", error)
    throw new Error("Failed to fetch shopping lists")
  }

  return data || []
}

export async function getShoppingListById(id: string): Promise<ShoppingList | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be signed in")
  }

  const { data: list, error: listError } = await supabase
    .from("shopping_lists")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (listError || !list) {
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from("shopping_list_items")
    .select("*")
    .eq("shopping_list_id", id)
    .order("created_at", { ascending: true })

  if (itemsError) {
    console.error("[v0] Error fetching shopping list items:", itemsError)
  }

  return {
    ...list,
    items: items || [],
  }
}

export async function createShoppingList(name: string, items: Array<{ name: string; amount?: number; unit?: string }>): Promise<ShoppingList> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be signed in")
  }

  const { data: list, error: listError } = await supabase
    .from("shopping_lists")
    .insert({
      user_id: user.id,
      name,
    })
    .select()
    .single()

  if (listError) {
    console.error("[v0] Error creating shopping list:", listError)
    throw new Error("Failed to create shopping list")
  }

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("shopping_list_items").insert(
      items.map((item) => ({
        shopping_list_id: list.id,
        name: item.name,
        amount: item.amount || null,
        unit: item.unit || null,
      })),
    )

    if (itemsError) {
      console.error("[v0] Error adding items:", itemsError)
      throw new Error("Failed to add items")
    }
  }

  return list
}

export async function updateShoppingList(id: string, updates: { name?: string; is_completed?: boolean }): Promise<void> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be signed in")
  }

  const { error } = await supabase
    .from("shopping_lists")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error updating shopping list:", error)
    throw new Error("Failed to update shopping list")
  }
}

export async function deleteShoppingList(id: string): Promise<void> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be signed in")
  }

  const { error } = await supabase.from("shopping_lists").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error deleting shopping list:", error)
    throw new Error("Failed to delete shopping list")
  }
}

export async function addShoppingListItem(listId: string, item: { name: string; amount?: number; unit?: string }): Promise<ShoppingListItem> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("shopping_list_items")
    .insert({
      shopping_list_id: listId,
      name: item.name,
      amount: item.amount || null,
      unit: item.unit || null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding item:", error)
    throw new Error("Failed to add item")
  }

  return data
}

export async function updateShoppingListItem(id: string, updates: { name?: string; amount?: number; unit?: string; is_checked?: boolean }): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("shopping_list_items").update(updates).eq("id", id)

  if (error) {
    console.error("[v0] Error updating item:", error)
    throw new Error("Failed to update item")
  }
}

export async function deleteShoppingListItem(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("shopping_list_items").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting item:", error)
    throw new Error("Failed to delete item")
  }
}


