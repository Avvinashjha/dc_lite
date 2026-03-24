import { atom } from 'nanostores';

export const showLoginModal = atom<boolean>(false);
export const loginReason = atom<string>('Sign in to continue');

export function openLoginModal(reason?: string) {
    if (reason) loginReason.set(reason);
    showLoginModal.set(true);
}

export function closeLoginModal() {
    showLoginModal.set(false);
}

if (typeof window !== 'undefined') {
    (window as any).__dcOpenLoginModal = openLoginModal;
    (window as any).__dcCloseLoginModal = closeLoginModal;
}
