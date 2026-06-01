import { atom } from 'nanostores';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const userStore = atom<User | null>(null);
export const isAuthLoading = atom<boolean>(true);

if (typeof window !== 'undefined') {
    onAuthStateChanged(auth, (user) => {
        userStore.set(user);
        isAuthLoading.set(false);

        (window as any).__dcAuthUser = user;
        window.dispatchEvent(new CustomEvent('dc:authchange', { detail: { user } }));
    });

    (window as any).getFirebaseIdToken = async (): Promise<string | null> => {
        const user = userStore.get();
        if (!user) return null;
        try {
            return await user.getIdToken();
        } catch {
            return null;
        }
    };
}
