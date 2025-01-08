import { Link, useLocation } from 'react-router-dom'
import { Home, PieChart, Receipt, Wallet } from 'lucide-react'
import { cn } from '../lib/utils'

export function BottomNav() {
  const location = useLocation()

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: PieChart },
    { name: 'Transacciones', href: '/transactions', icon: Receipt },
    { name: 'Presupuesto', href: '/budget', icon: Wallet },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t py-2">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center gap-1"
            >
              <item.icon 
                className={cn(
                  "h-6 w-6",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span 
                className={cn(
                  "text-xs",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

