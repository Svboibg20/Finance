import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from 'lucide-react'

export function Dashboard() {
  return (
    <div className=" mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-primary text-primary-foreground rounded-b-3xl -mx-4 -mt-20 p-6 pt-24 mb-6 shadow-xl">
        <h1 className="text-2xl font-medium">Saldo actual</h1>
        <div className="mt-4">
          <p className="text-4xl font-bold">$70,501.00</p>
          <p className="mt-1 text-primary-foreground/80">Balance Total</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button className="flex flex-col items-center justify-center rounded-lg bg-white/10 p-4 hover:bg-white/20">
            <ArrowUpIcon className="h-6 w-6" />
            <span className="mt-2 text-sm">Transferir</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-lg bg-white/10 p-4 hover:bg-white/20">
            <ArrowDownIcon className="h-6 w-6" />
            <span className="mt-2 text-sm">Recibir</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-lg bg-white/10 p-4 hover:bg-white/20">
            <DollarSign className="h-6 w-6" />
            <span className="mt-2 text-sm">Pagar</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-lg bg-white/10 p-4 hover:bg-white/20">
            <DollarSign className="h-6 w-6" />
            <span className="mt-2 text-sm">Historial</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">$5,000.00</div>
            <p className="text-xs text-muted-foreground">+20.1% del mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">$3,000.00</div>
            <p className="text-xs text-muted-foreground">+10.5% del mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorro</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,000.00</div>
            <p className="text-xs text-muted-foreground">40% de los ingresos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

