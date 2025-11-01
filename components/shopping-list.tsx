"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ShoppingCart, Copy, Trash2, Save } from "lucide-react"
import type { Ingredient } from "@/lib/types/recipe"
import { createShoppingList } from "@/lib/db/shopping-lists"
import { useToast } from "@/hooks/use-toast"

interface ShoppingListProps {
  ingredients: Ingredient[]
  onClose: () => void
}

export function ShoppingList({ ingredients, onClose }: ShoppingListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const toggleItem = (ingredientName: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(ingredientName)) {
      newChecked.delete(ingredientName)
    } else {
      newChecked.add(ingredientName)
    }
    setCheckedItems(newChecked)
  }

  const copyToClipboard = () => {
    const list = ingredients
      .map((ing) => {
        const amount = ing.amount ? `${ing.amount}${ing.unit ? ` ${ing.unit}` : ""}` : ""
        return `${ing.name}${amount ? ` - ${amount}` : ""}`
      })
      .join("\n")
    navigator.clipboard.writeText(list)
  }

  const clearChecked = () => {
    setCheckedItems(new Set())
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const items = ingredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount || undefined,
        unit: ing.unit || undefined,
      }))
      const newList = await createShoppingList(`Recipe Ingredients - ${new Date().toLocaleDateString()}`, items)
      toast({
        title: "Success",
        description: "Shopping list saved!",
      })
      onClose()
      router.push(`/shopping-lists/${newList.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shopping list",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy All
            </Button>
            <Button variant="default" size="sm" onClick={handleSave} disabled={saving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" size="sm" onClick={clearChecked} disabled={checkedItems.size === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => {
              const key = `${ingredient.name}-${index}`
              const isChecked = checkedItems.has(key)
              const amount = ingredient.amount
                ? `${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ""}`
                : null

              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 p-2 rounded-lg border ${
                    isChecked ? "bg-muted line-through opacity-60" : "bg-background"
                  }`}
                >
                  <Checkbox
                    id={key}
                    checked={isChecked}
                    onCheckedChange={() => toggleItem(key)}
                  />
                  <label htmlFor={key} className="flex-1 cursor-pointer text-sm">
                    <span className="font-medium">{ingredient.name}</span>
                    {amount && <span className="text-muted-foreground ml-2">({amount})</span>}
                  </label>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

