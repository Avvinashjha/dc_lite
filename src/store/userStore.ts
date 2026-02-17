import { atom } from 'nanostores';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const userStore = atom<User | null>(null);
export const isAuthLoading = atom<boolean>(true);

// Subscribe to auth state changes
if (typeof window !== 'undefined') {
    onAuthStateChanged(auth, (user) => {
        userStore.set(user);
        isAuthLoading.set(false);
    });
}
