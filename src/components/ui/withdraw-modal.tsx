'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"
import { Button } from "./button"
import { Label } from "./label"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onWithdraw: (amount: number) => void
  maxAmount: number
}

export function WithdrawModal({ isOpen, onClose, onWithdraw, maxAmount }: WithdrawModalProps) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!isNaN(numAmount) && numAmount > 0 && numAmount <= maxAmount) {
      onWithdraw(numAmount)
      setAmount('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Retirar Saldo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad a retirar</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              min="0"
              max={maxAmount}
              step="0.01"
              required
            />
            <p className="text-sm text-muted-foreground">
              Saldo disponible: ${maxAmount}
            </p>
          </div>
          <Button type="submit" className="w-full">
            Retirar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
