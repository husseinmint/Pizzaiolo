"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
  type ShoppingList,
} from "@/lib/db/shopping-lists"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeHeader } from "@/components/recipe-header"
import { DeleteDialog } from "@/components/delete-dialog"
import { Plus, ShoppingCart, Check, X, Edit2, Trash2, CheckCircle2, Circle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function ShoppingListsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState("")

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    try {
      const data = await getShoppingLists()
      setLists(data)
    } catch (error) {
      console.error("[v0] Error fetching lists:", error)
      toast({
        title: "Error",
        description: "Failed to load shopping lists",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      })
      return
    }

    try {
      const newList = await createShoppingList(newListName.trim(), [])
      setLists([newList, ...lists])
      setNewListName("")
      setShowCreateForm(false)
      toast({
        title: "Success",
        description: "Shopping list created",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shopping list",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      await deleteShoppingList(deleteId)
      setLists(lists.filter((l) => l.id !== deleteId))
      toast({
        title: "Success",
        description: "Shopping list deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shopping list",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
      setDeleteId(null)
    }
  }

  const toggleComplete = async (list: ShoppingList) => {
    try {
      await updateShoppingList(list.id, { is_completed: !list.is_completed })
      setLists(lists.map((l) => (l.id === list.id ? { ...l, is_completed: !l.is_completed } : l)))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update list",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <RecipeHeader showNewButton={false} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Lists</h1>
            <p className="text-muted-foreground mt-1">Manage your shopping lists</p>
          </div>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New List
            </Button>
          )}
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Shopping List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="List name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                  className="flex-1"
                />
                <Button onClick={handleCreateList}>Create</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {lists.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No shopping lists yet</p>
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First List
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <Card
                key={list.id}
                className={`border-border hover:border-primary/50 transition-colors ${
                  list.is_completed ? "opacity-75" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className={`flex items-center gap-2 ${list.is_completed ? "line-through" : ""}`}>
                        {list.is_completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                        {list.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Created {new Date(list.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/shopping-lists/${list.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleComplete(list)}
                      title={list.is_completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {list.is_completed ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteId(list.id)
                        setDeleteOpen(true)
                      }}
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <DeleteDialog
        open={deleteOpen}
        title="Delete Shopping List"
        description="Are you sure you want to delete this shopping list? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        isLoading={deleting}
      />
    </div>
  )
}


