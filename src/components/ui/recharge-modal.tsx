'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"
import { Button } from "./button"
import { Label } from "./label"

interface RechargeModalProps {
  isOpen: boolean
  onClose: () => void
  onRecharge: (amount: number) => void
}

export function RechargeModal({ isOpen, onClose, onRecharge }: RechargeModalProps) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!isNaN(numAmount) && numAmount > 0) {
      onRecharge(numAmount)
      setAmount('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recargar Saldo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad a recargar</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              min="0"
              step="0.01"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Recargar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
