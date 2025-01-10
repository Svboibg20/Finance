import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const initializeUserData = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Create initial user document if it doesn't exist
    await setDoc(userRef, {
      balance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      savings: 0,
      createdAt: new Date(),
    });
  }
};