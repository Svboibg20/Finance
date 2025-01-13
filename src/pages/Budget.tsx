'use client'

import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../lib/firebase'
import { getBudgetCategories, addBudgetCategory, updateBudgetCategory, deleteBudgetCategory } from '../lib/budget-service'
import { addExpense } from '../lib/expense-service'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"
import { EditBudgetModal } from "../components/EditBudgetModal"
import { AddBudgetDialog } from "../components/AddBudgetDialog"
import { AddExpenseDialog } from "../components/AddExpenseDialog"
import { Plus, Wallet } from 'lucide-react'
import { toast } from 'sonner'

interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
}

export function Budget() {
  const [user, loading] = useAuthState(auth)
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    let unsubscribe: () => void

    const fetchCategories = async () => {
      if (user) {
        setIsLoading(true)
        unsubscribe = getBudgetCategories(user.uid, (fetchedCategories) => {
          setCategories(fetchedCategories)
          // Calculate totals
          const budget = fetchedCategories.reduce((acc, cat) => acc + cat.budget, 0)
          const spent = fetchedCategories.reduce((acc, cat) => acc + cat.spent, 0)
          setTotalBudget(budget)
          setTotalSpent(spent)
          setIsLoading(false)
        })
      }
    }

    if (!loading) {
      fetchCategories()
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user, loading])

  const handleAddCategory = async (category: { name: string; budget: number }) => {
    if (!user) return

    try {
      await addBudgetCategory(user.uid, category)
      toast.success('Categoría añadida con éxito')
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Error al añadir la categoría')
    }
  }

  const handleAddExpense = async ({ categoryId, amount }: { categoryId: string; amount: number }) => {
    if (!user) return

    try {
      await addExpense(user.uid, categoryId, amount)
      toast.success('Gasto registrado con éxito')
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error('Error al registrar el gasto')
    }
  }

  const handleUpdateCategory = async (id: string, updates: Partial<BudgetCategory>) => {
    if (!user) return

    try {
      await updateBudgetCategory(user.uid, id, updates)
      setEditingCategory(null)
      toast.success('Categoría actualizada con éxito')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Error al actualizar la categoría')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!user) return

    try {
      await deleteBudgetCategory(user.uid, id)
      toast.success('Categoría eliminada con éxito')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Error al eliminar la categoría')
    }
  }

  if (loading || isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Por favor, inicia sesión para ver tu presupuesto.</div>
  }

  return (
    <div className="relative min-h-screen pb-20">
      {/* Header Section with blue background */}
      <div className="bg-primary text-primary-foreground rounded-b-3xl -mx-4 -mt-20 p-6 pt-24 mb-6 shadow-xl">
        <h1 className="text-xl font-medium mb-4">Presupuesto</h1>
        <Card className="bg-white/20 border-none shadow-2xl">
          <CardContent className="p-3">
            <div className="space-y-1">
              <p className="text-lg text-primary-foreground/100">Total Presupuestado</p>
              <p className="text-4xl font-bold text-white">${totalBudget}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-primary-foreground/80">Gastado: ${totalSpent}</span>
                <span className="text-sm text-primary-foreground/80">
                  {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Categorías</h2>
          <button
            className="flex flex-col items-center gap-2"
            onClick={() => setIsExpenseOpen(true)}
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-xs">Registrar Gasto</span>
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay categorías de presupuesto.</p>
            <p className="text-muted-foreground">Haz clic en el botón + para comenzar.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => {
              const percentage = (category.spent / category.budget) * 100
              const isOverBudget = percentage > 100

              return (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        ${category.spent.toFixed(2)} / ${category.budget}
                      </span>
                      <span className={isOverBudget ? "text-red-500" : "text-muted-foreground"}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={percentage > 100 ? 100 : percentage}
                      className={isOverBudget ? "text-red-500" : ""}
                    />
                    <div className="flex justify-between mt-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button for adding categories */}
      <Button
        size="lg"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsAddOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Agregar categoría</span>
      </Button>

      {/* Dialogs */}
      <AddBudgetDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddCategory}
      />

      <AddExpenseDialog
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onAdd={handleAddExpense}
        categories={categories}
      />

      {editingCategory && (
        <EditBudgetModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={(updates) => handleUpdateCategory(editingCategory.id, updates)}
          category={editingCategory}
        />
      )}
    </div>
  )
}

