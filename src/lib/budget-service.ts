import { db } from './firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
}

export const getBudgetCategories = (userId: string, callback: (categories: BudgetCategory[]) => void) => {
  const q = query(collection(db, 'users', userId, 'budgetCategories'));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BudgetCategory));
    callback(categories);
  });
};

export const addBudgetCategory = async (userId: string, category: { name: string, budget: number }) => {
  const categoriesRef = collection(db, 'users', userId, 'budgetCategories');
  await setDoc(doc(categoriesRef), { ...category, spent: 0 });
};

export const updateBudgetCategory = async (userId: string, categoryId: string, updates: Partial<BudgetCategory>) => {
  const categoryRef = doc(db, 'users', userId, 'budgetCategories', categoryId);
  await updateDoc(categoryRef, updates);
};

export const deleteBudgetCategory = async (userId: string, categoryId: string) => {
  const categoryRef = doc(db, 'users', userId, 'budgetCategories', categoryId);
  await deleteDoc(categoryRef);
};


export const getUserBalance = (userId: string, callback: (balance: number) => void) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().balance || 0);
    }
  });
};

