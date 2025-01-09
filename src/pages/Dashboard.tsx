import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from 'lucide-react';
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export function Dashboard() {
  const [user] = useAuthState(auth);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setBalance(userData?.balance || 0);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error al cargar el balance:", error);
        setError("Error al cargar los datos. Por favor, recarga la página.");
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-primary text-primary-foreground rounded-b-3xl -mx-4 -mt-20 p-6 pt-24 mb-6 shadow-xl">
        <h1 className="text-xl font-medium mb-4">Ventaja rentable</h1>
        <Card className="bg-white/20 border-none shadow-2xl">
          <CardContent className="p-3">
            <div className="space-y-1">
              <p className="text-lg text-primary-foreground/100">Saldo Actual</p>
              <p className="text-4xl font-bold text-white">${balance}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
  );
}
