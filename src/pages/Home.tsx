import { Card, CardContent } from "../components/ui/card"
import { Plus,  Home as HomeIcon, Wallet, PieChart, Settings } from 'lucide-react'


export function Home() {
  

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground rounded-b-3xl -mx-4 -mt-20 p-6 pt-24 mb-6 shadow-xl">
        <h1 className="text-xl font-medium mb-4">Bienvenido de vuelta</h1>
        <Card className="bg-white/20 border-none shadow-2xl">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-primary-foreground/100">TU BALANCE</p>
              <p className="text-4xl font-bold">$70,501.00</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 px-4">
        <button className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-xs">Recargar</span>
        </button>
      </div>



      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-6">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1">
            <HomeIcon className="h-6 w-6 text-primary" />
            <span className="text-xs text-primary">Inicio</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Wallet className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pagos</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <PieChart className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Stats</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

