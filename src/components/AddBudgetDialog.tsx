'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface AddBudgetDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (category: { name: string; budget: number }) => void
}

export function AddBudgetDialog({ isOpen, onClose, onAdd }: AddBudgetDialogProps) {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ name, budget: Number(budget) })
    setName('')
    setBudget('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la categoría</Label>
            <Input
              id="name"
              placeholder="Ej: Alimentación"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Presupuesto</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Ej: 1000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Agregar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

