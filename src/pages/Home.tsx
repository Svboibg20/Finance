'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "../components/ui/card"
import { Plus, Minus, HomeIcon, Wallet, PieChart, Settings } from 'lucide-react'
import { TransactionItem } from "../components/ui/transaction-item"
import { RechargeModal } from "../components/ui/recharge-modal"
import { WithdrawModal } from "../components/ui/withdraw-modal"
import { AddExpenseDialog } from "../components/AddExpenseDialog"
import { toast } from 'sonner'
import { auth, db } from '../lib/firebase'
import { doc, updateDoc, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initializeUserData } from '../lib/firebase-service'
import { getBudgetCategories } from '../lib/budget-service'
import { addExpense } from '../lib/expense-service'


export function Home() {
  const [user, loading] = useAuthState(auth);
  const [balance, setBalance] = useState(0)
  const [isRechargeOpen, setIsRechargeOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<{ id: string; name: string; amount: number; type: "transfer" | "shopping"; date: string; }[]>([])
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const setupUserData = async () => {
      if (user) {
        try {
          // Initialize user data if needed
          await initializeUserData(user.uid);

          // Set up real-time listeners
          const userRef = doc(db, 'users', user.uid);
          const unsubscribeUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              setBalance(doc.data().balance || 0);
            }
          }, (error) => {
            console.error("Error fetching user data:", error);
            setError("Error al cargar los datos del usuario. Por favor, recarga la página.");
          });

          const transactionsRef = collection(db, 'users', user.uid, 'transactions');
          const transactionsQuery = query(
            transactionsRef,
            orderBy('date', 'desc'),
            limit(10)
          );

          const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
            const transactions = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              date: doc.data().date?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString()
            })) as { id: string; name: string; amount: number; type: "transfer" | "shopping"; date: string; }[];
            setRecentTransactions(transactions);
          }, (error) => {
            console.error("Error fetching transactions:", error);
            setError("Error al cargar las transacciones. Por favor, recarga la página.");
          });

          const unsubscribeCategories = getBudgetCategories(user.uid, (fetchedCategories) => {
            setCategories(fetchedCategories);
          });

          setIsInitializing(false);
          return () => {
            unsubscribeUser();
            unsubscribeTransactions();
            unsubscribeCategories();
          };
        } catch (error) {
          console.error('Error setting up user data:', error);
          setError('Error al cargar los datos. Por favor, recarga la página.');
          setIsInitializing(false);
        }
      }
    };

    if (user && !loading) {
      setupUserData();
    }
  }, [user, loading]);

  const handleRecharge = async (amount: number) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const newBalance = balance + amount;

      // Update user balance
      await updateDoc(userRef, { balance: newBalance });

      // Add transaction
      const transactionRef = collection(db, 'users', user.uid, 'transactions');
      await addDoc(transactionRef, {
        name: "Recarga",
        amount: amount,
        type: "transfer",
        date: serverTimestamp()
      });

      toast.success(`Recarga exitosa de $${amount.toFixed(2)}`);
    } catch (error) {
      console.error("Error al recargar:", error);
      toast.error("Error al procesar la recarga. Por favor, intente de nuevo.");
    }
  }

  const handleWithdraw = async (amount: number) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const newBalance = balance - amount;

      if (newBalance < 0) {
        toast.error("Saldo insuficiente para realizar el retiro.");
        return;
      }

      // Update user balance
      await updateDoc(userRef, { balance: newBalance });

      // Add transaction
      const transactionRef = collection(db, 'users', user.uid, 'transactions');
      await addDoc(transactionRef, {
        name: "Retiro",
        amount: -amount,
        type: "transfer",
        date: serverTimestamp()
      });

      toast.success(`Retiro exitoso de $${amount}`);
    } catch (error) {
      console.error("Error al retirar:", error);
      toast.error("Error al procesar el retiro. Por favor, intente de nuevo.");
    }
  }

  const handleAddExpense = async (categoryId: string, amount: number) => {
    if (!user) return;

    try {
      await addExpense(user.uid, categoryId, amount);
      toast.success(`Gasto de $${amount} registrado con éxito`);
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
      if (error === "Insufficient balance") {
        toast.error("Saldo insuficiente para registrar el gasto.");
      } else {
        toast.error("Error al registrar el gasto. Por favor, intente de nuevo.");
      }
    }
  };

  if (loading || isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Por favor, inicia sesión para ver tu cuenta.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground rounded-b-3xl -mx-4 -mt-20 p-6 pt-24 mb-6 shadow-xl">
        <h1 className="text-xl font-medium mb-4">Bienvenido de vuelta, {user.displayName}</h1>
        <Card className="bg-white/20 border-none shadow-2xl">
          <CardContent className="p-3">
            <div className="space-y-1">
              <p className="text-lg text-primary-foreground/100">Saldo Actual</p>
              <p className="text-4xl font-bold text-white">${balance}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 px-4">
        <button
          className="flex flex-col items-center gap-2"
          onClick={() => setIsRechargeOpen(true)}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-xs">Recargar</span>
        </button>
        <button
          className="flex flex-col items-center gap-2"
          onClick={() => setIsWithdrawOpen(true)}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Minus className="h-6 w-6" />
          </div>
          <span className="text-xs">Retirar</span>
        </button>
        <button
          className="flex flex-col items-center gap-2"
          onClick={() => setIsExpenseOpen(true)}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="text-xs">Registrar Gasto</span>
        </button>
      </div>

      {/* Modals */}
      <RechargeModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        onRecharge={handleRecharge}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onWithdraw={handleWithdraw}
        maxAmount={balance}
      />
      <AddExpenseDialog
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onAdd={({ categoryId, amount }) => {
          handleAddExpense(categoryId, amount)
        }}
        categories={categories}
      />

      {/* Recent Transactions */}
      <div
        className="bg-transparent text-primary-foreground rounded-t-3xl -mx-4  p-6"
        style={{ boxShadow: "0 -10px 10px 0px rgba(0, 0, 0, 0.1)" }}
      >
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 text-black">Movimientos Recientes</h2>
          <div className="divide-y text-black">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <TransactionItem key={transaction.id} {...transaction} />
            ))}
          </div>
        </CardContent>
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

