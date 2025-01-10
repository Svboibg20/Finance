import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { name?: string; budget?: number }) => void;
  category: { name: string; budget: number };
}

export function EditBudgetModal({ isOpen, onClose, onSave, category }: EditBudgetModalProps) {
  const [name, setName] = useState(category.name);
  const [budget, setBudget] = useState(category.budget.toString());

  useEffect(() => {
    setName(category.name);
    setBudget(category.budget.toString());
  }, [category]);

  const handleSave = () => {
    onSave({ name, budget: Number(budget) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoría de Presupuesto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Presupuesto"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

