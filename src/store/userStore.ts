import { atom } from 'nanostores';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const userStore = atom<User | null>(null);
export const isAuthLoading = atom<boolean>(true);

if (typeof window !== 'undefined') {
    async function waitForAuthUser(): Promise<User | null> {
        const existing = userStore.get() || auth.currentUser;
        if (existing) return existing;

        const maybeAuthStateReady = (auth as typeof auth & { authStateReady?: () => Promise<void> }).authStateReady;
        if (typeof maybeAuthStateReady === 'function') {
            await maybeAuthStateReady.call(auth);
            return userStore.get() || auth.currentUser;
        }

        if (!isAuthLoading.get()) return null;

        return new Promise((resolve) => {
            const timeout = window.setTimeout(() => {
                unsubscribe();
                resolve(userStore.get() || auth.currentUser);
            }, 3000);

            const unsubscribe = onAuthStateChanged(auth, (user) => {
                window.clearTimeout(timeout);
                unsubscribe();
                resolve(user);
            });
        });
    }

    onAuthStateChanged(auth, (user) => {
        userStore.set(user);
        isAuthLoading.set(false);

        (window as any).__dcAuthUser = user;
        window.dispatchEvent(new CustomEvent('dc:authchange', { detail: { user } }));
    });

    (window as any).getFirebaseIdToken = async (forceRefresh = false): Promise<string | null> => {
        const user = await waitForAuthUser();
        if (!user) return null;
        try {
            return await user.getIdToken(forceRefresh);
        } catch (err) {
            console.warn('[auth] Failed to get Firebase ID token:', err);
            return null;
        }
    };
}
