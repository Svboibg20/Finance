'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { TransactionItem } from "../components/ui/transaction-item";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "transfer" | "shopping";
  name: string;
}

export function Transactions() {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (!user) return;

    const transactionsRef = collection(db, "users", user.uid, "transactions");
    const transactionsQuery = query(transactionsRef, orderBy("date", "desc"), limit(10));

    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const fetchedTransactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString(),
        })) as Transaction[];

        // Calculate totals
        let income = 0;
        let expenses = 0;
        fetchedTransactions.forEach(transaction => {
          if (transaction.amount > 0) {
            income += transaction.amount;
          } else {
            expenses += Math.abs(transaction.amount);
          }
        });

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setTransactions(fetchedTransactions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setError("Error al cargar las transacciones.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Por favor, inicia sesión para ver tus transacciones.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando transacciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20">
      {/* Header Section with blue background */}
      <div className="bg-primary text-primary-foreground rounded-b-3xl -mx-4 -mt-20 p-6 pt-24 mb-6 shadow-xl">
        <h1 className="text-xl font-medium mb-4">Transacciones</h1>
        <Card className="bg-white/20 border-none shadow-2xl">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-primary-foreground/80">Ingresos</p>
                <p className="text-2xl font-bold text-white">+${totalIncome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-primary-foreground/80">Gastos</p>
                <p className="text-2xl font-bold text-white">-${totalExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-6 p-4">
        <Card className="overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Movimientos Recientes</h2>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay transacciones para mostrar.
              </p>
            ) : (
              <ul className="divide-y">
                {transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    name={transaction.name}
                    amount={transaction.amount}
                    type={transaction.type}
                    date={transaction.date}
                  />
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

