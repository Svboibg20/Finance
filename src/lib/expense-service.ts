import { db } from './firebase';
import { doc, collection, runTransaction, serverTimestamp, increment } from 'firebase/firestore';

export const addExpense = async (userId: string, categoryId: string, amount: number) => {
  const userRef = doc(db, 'users', userId);
  const categoryRef = doc(db, 'users', userId, 'budgetCategories', categoryId);
  const expensesRef = collection(categoryRef, 'expenses');

  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      throw "User document does not exist!";
    }

    const newBalance = (userDoc.data().balance || 0) - amount;
    if (newBalance < 0) {
      throw "Insufficient balance";
    }

    transaction.update(userRef, { balance: newBalance });
    
    transaction.update(categoryRef, {
      spent: increment(amount)
    });

    transaction.set(doc(expensesRef), {
      amount,
      date: serverTimestamp()
    });
  });
};

