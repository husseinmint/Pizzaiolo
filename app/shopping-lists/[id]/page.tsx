"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import {
  getShoppingListById,
  updateShoppingList,
  addShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
  type ShoppingList,
  type ShoppingListItem,
} from "@/lib/db/shopping-lists"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeHeader } from "@/components/recipe-header"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, X, CheckCircle2, Circle, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { useDirection } from "@/lib/contexts/direction-context"
import { getIngredientCategory } from "@/lib/utils/categories"
import { useUser } from "@/lib/auth/hooks"

export default function ShoppingListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  const { direction } = useDirection()
  const { user } = useUser()
  const [list, setList] = useState<ShoppingList | null>(null)
  const [loading, setLoading] = useState(true)
  const [newItemName, setNewItemName] = useState("")
  const [newItemAmount, setNewItemAmount] = useState("")
  const [newItemUnit, setNewItemUnit] = useState("")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchList()
  }, [id])

  const fetchList = async () => {
    try {
      const data = await getShoppingListById(id)
      setList(data)
    } catch (error) {
      console.error("[v0] Error fetching list:", error)
      toast({
        title: "Error",
        description: "Failed to load shopping list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      })
      return
    }

    setAdding(true)
    try {
      const item = await addShoppingListItem(id, {
        name: newItemName.trim(),
        amount: newItemAmount ? parseFloat(newItemAmount) : undefined,
        unit: newItemUnit.trim() || undefined,
      })
      setList((prev) => (prev ? { ...prev, items: [...(prev.items || []), item] } : null))
      setNewItemName("")
      setNewItemAmount("")
      setNewItemUnit("")
      toast({
        title: "Success",
        description: "Item added",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  const toggleItem = async (item: ShoppingListItem) => {
    try {
      await updateShoppingListItem(item.id, { is_checked: !item.is_checked })
      setList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items?.map((i) => (i.id === item.id ? { ...i, is_checked: !i.is_checked } : i)),
            }
          : null,
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteShoppingListItem(itemId)
      setList((prev) => (prev ? { ...prev, items: prev.items?.filter((i) => i.id !== itemId) } : null))
      toast({
        title: "Success",
        description: "Item removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Shopping list not found</p>
          <Link href="/shopping-lists">
            <Button>Back to Lists</Button>
          </Link>
        </div>
      </div>
    )
  }

  const checkedItems = list.items?.filter((i) => i.is_checked) || []
  const uncheckedItems = list.items?.filter((i) => !i.is_checked) || []

  // Group items by category for print
  const categorizedItems = uncheckedItems.map((item) => ({
    ...item,
    category: getIngredientCategory(item.name),
  })).sort((a, b) => {
    // Sort by category first, then by name
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="min-h-screen bg-background">
      <RecipeHeader showNewButton={false} />

      <main className="max-w-4xl mx-auto px-4 py-8 print-main">
        <div className="flex items-center justify-between mb-6 no-print">
          <Link href="/shopping-lists" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Lists
          </Link>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>

        <Card className="mb-6 no-print">
          <CardHeader>
            <CardTitle className="text-2xl">{list.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                  className="flex-1"
                />
                <Input
                  placeholder="Amount"
                  type="number"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  className="w-24"
                />
                <Input
                  placeholder="Unit"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-20"
                />
                <Button onClick={handleAddItem} disabled={adding}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Print Content - Purchase List Format */}
        {list && (
          <div className="print-content hidden print:block bg-white p-8" dir={direction}>
          {/* Header */}
          <div className="mb-6 pb-4 border-b-4 border-black">
            <h1 className="text-3xl font-bold tracking-tight text-black">Hussein PR</h1>
            <div className="text-sm font-semibold tracking-widest text-black">PURCHASE LIST</div>
          </div>

          {/* Administrative Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Date:</span>
              <span className="border-b border-black flex-1">
                {new Date(list.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Prepared by:</span>
              <span className="border-b border-black flex-1">
                {user?.user_metadata?.full_name || user?.email || 'N/A'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Week:</span>
              <span className="border-b border-black flex-1">
                {getWeekNumber(new Date(list.created_at))}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Supplier:</span>
              <span className="border-b border-black flex-1">
                {list.name.includes('Supplier') ? list.name.split('-')[1]?.trim() : ''}
              </span>
            </div>
          </div>

          <div className="h-px bg-black my-4"></div>

          {/* Items Table */}
          {categorizedItems.length > 0 && (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="py-2 px-2 font-semibold text-black text-center">#</th>
                  <th className="py-2 px-2 font-semibold text-black">Category</th>
                  <th className="py-2 px-2 font-semibold text-black">Item Name</th>
                  <th className="py-2 px-2 font-semibold text-black text-center">Unit</th>
                  <th className="py-2 px-2 font-semibold text-black text-center">Qty</th>
                  <th className="py-2 px-2 font-semibold text-black">Notes</th>
                </tr>
              </thead>
              <tbody>
                {categorizedItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-black">
                    <td className="py-2 px-2 text-center">{index + 1}</td>
                    <td className="py-2 px-2">{item.category}</td>
                    <td className="py-2 px-2 font-medium">{item.name}</td>
                    <td className="py-2 px-2 text-center">{item.unit || ""}</td>
                    <td className="py-2 px-2 text-center">{item.amount || ""}</td>
                    <td className="py-2 px-2 border-b border-black"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Footer */}
          <div className="mt-8 space-y-4">
            <div className="h-px bg-black"></div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Signature:</span>
              <span className="border-b border-black flex-1"></span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Notes:</span>
              <div className="flex-1 space-y-2">
                <div className="border-b border-black h-6"></div>
                <div className="border-b border-black h-6"></div>
                <div className="border-b border-black h-6"></div>
              </div>
            </div>
          </div>
          </div>
        )}

        <div className="space-y-6 no-print">
          {uncheckedItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>To Buy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 shopping-checklist">
                  {uncheckedItems.map((item) => (
                    <div
                      key={item.id}
                      className="shopping-item flex items-center gap-3 p-2 rounded-lg border bg-background hover:bg-muted/50"
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.is_checked}
                        onCheckedChange={() => toggleItem(item)}
                      />
                      <label htmlFor={item.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{item.name}</span>
                        {(item.amount || item.unit) && (
                          <span className="text-muted-foreground ml-2">
                            ({item.amount || ""} {item.unit || ""})
                          </span>
                        )}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {checkedItems.length > 0 && (
            <Card className="no-print">
              <CardHeader>
                <CardTitle className="text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {checkedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg border bg-muted/50 opacity-60 line-through"
                    >
                      <Checkbox
                        id={`checked-${item.id}`}
                        checked={item.is_checked}
                        onCheckedChange={() => toggleItem(item)}
                      />
                      <label htmlFor={`checked-${item.id}`} className="flex-1 cursor-pointer">
                        <span>{item.name}</span>
                        {(item.amount || item.unit) && (
                          <span className="text-muted-foreground ml-2">
                            ({item.amount || ""} {item.unit || ""})
                          </span>
                        )}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {list.items?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No items yet. Add some items to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

