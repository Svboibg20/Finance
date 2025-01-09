import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { TransactionItem } from "../components/ui/transaction-item";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function Transactions() {
  const [user] = useAuthState(auth);
  interface Transaction {
    id: string;
    date: string;
    [key: string]: any;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        }));
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

  if (loading) return <p>Cargando transacciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="bg-primary text-primary-foreground rounded-b-3xl -mx-4 -mt-20 p-6 pt-24 shadow-xl">
        <h1 className="text-xl font-medium mb-4">Transacciones</h1>
      </div>
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">Movimientos Recientes</h2>
          <ul className="divide-y">
            {transactions.map((transaction) => (
              <TransactionItem name={""} amount={0} type={"transfer"} key={transaction.id} {...transaction} />
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
