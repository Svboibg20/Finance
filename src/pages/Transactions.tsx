import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Card } from "../components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

export function Transactions() {
  const transactions = [
    { id: 1, date: '2023-05-01', description: 'Salario', amount: 5000, type: 'ingreso' },
    { id: 2, date: '2023-05-02', description: 'Supermercado', amount: -200, type: 'gasto' },
    { id: 3, date: '2023-05-03', description: 'Gasolina', amount: -50, type: 'gasto' },
    { id: 4, date: '2023-05-04', description: 'Venta en línea', amount: 100, type: 'ingreso' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Transacciones</h1>
      </div>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead className="text-right">Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.type === 'ingreso' ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <ArrowUpIcon className="h-4 w-4" />
                      Ingreso
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600">
                      <ArrowDownIcon className="h-4 w-4" />
                      Gasto
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

