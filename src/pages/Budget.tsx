import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"

export function Budget() {
  const categories = [
    { name: 'Vivienda', budget: 1000, spent: 800 },
    { name: 'Alimentación', budget: 500, spent: 450 },
    { name: 'Transporte', budget: 200, spent: 180 },
    { name: 'Entretenimiento', budget: 300, spent: 250 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Presupuesto</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100
          const isOverBudget = percentage > 100

          return (
            <Card key={category.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    ${category.spent} / ${category.budget}
                  </span>
                  <span className={isOverBudget ? "text-red-500" : "text-muted-foreground"}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className={isOverBudget ? "text-red-500" : ""}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

