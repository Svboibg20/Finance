import { ArrowDownIcon, ArrowUpIcon, ShoppingBagIcon } from 'lucide-react'
import { cn } from "../../lib/utils"

interface TransactionItemProps {
  name: string
  amount: number
  type: 'transfer' | 'shopping'
  date: string
}

export function TransactionItem({ name, amount, type, date }: TransactionItemProps) {
  const isNegative = amount < 0
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isNegative ? "bg-red-100" : "bg-green-100"
        )}>
          {type === 'shopping' ? (
            <ShoppingBagIcon className="h-5 w-5 text-muted-foreground" />
          ) : isNegative ? (
            <ArrowUpIcon className="h-5 w-5 text-red-500" />
          ) : (
            <ArrowDownIcon className="h-5 w-5 text-green-500" />
          )}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground text-black">{date}</p>
        </div>
      </div>
      <p className={cn(
        "font-medium",
        isNegative ? "text-black" : "text-green-500"
      )}>
        {isNegative ? '-' : '+'}${Math.abs(amount)}
      </p>
    </div>
  )
}
