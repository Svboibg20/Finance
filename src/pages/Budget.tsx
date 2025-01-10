'use client'

import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../lib/firebase'
import { getBudgetCategories, addBudgetCategory, updateBudgetCategory, deleteBudgetCategory, addExpense } from '../lib/budget-service'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"
import { EditBudgetModal } from "../components/EditBudgetModal"
import { AddBudgetDialog } from "../components/AddBudgetDialog"
import { AddExpenseDialog } from "../components/AddExpenseDialog"
import { Plus, PlusCircle } from 'lucide-react'
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

  useEffect(() => {
    let unsubscribe: () => void

    const fetchCategories = async () => {
      if (user) {
        setIsLoading(true)
        unsubscribe = getBudgetCategories(user.uid, (fetchedCategories) => {
          setCategories(fetchedCategories)
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
    if (!user) {
      console.error('No user logged in');
      toast.error('Debes iniciar sesión para registrar un gasto');
      return;
    }
  
    console.log('User UID:', user.uid); // Añade este log
  
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
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Presupuesto</h1>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setIsExpenseOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Registrar Gasto
          </Button>
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
                        ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
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

