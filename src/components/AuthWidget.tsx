import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { userStore, isAuthLoading } from '../store/userStore';
import { auth, googleProvider, githubProvider } from '../lib/firebase';
import { signInWithPopup, signOut, linkWithPopup, type AuthProvider } from 'firebase/auth';

export default function AuthWidget() {
    const user = useStore(userStore);
    const loading = useStore(isAuthLoading);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setLoginModalOpen(false);
                setProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setImageError(false);
    }, [user?.uid]);

    const handleLogin = async (provider: AuthProvider) => {
        setLoginModalOpen(false);
        try {
            await signInWithPopup(auth, provider);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error("Login failed:", err);
            alert(`Login failed: ${message}`);
        }
    };

    const handleLink = async (provider: AuthProvider) => {
        if (!user) return;
        try {
            await linkWithPopup(user, provider);
            alert("Account linked successfully!");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error("Linking failed:", err);
            alert(`Linking failed: ${message}`);
        }
    };

    const handleLogout = async () => {
        setProfileMenuOpen(false);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return "?";
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length === 0) return "?";
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
    };

    if (loading) {
        return <div class="auth-widget">...</div>;
    }

    if (user) {
        const providers = user.providerData.map(p => p.providerId);
        const isGoogleLinked = providers.includes('google.com');
        const isGithubLinked = providers.includes('github.com');
        const initials = getInitials(user.displayName);

        return (
            <div class="auth-widget auth-widget--logged-in" ref={wrapperRef}>
                {user.photoURL && !imageError ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        class="auth-widget__avatar"
                        onError={() => setImageError(true)}
                        onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                    />
                ) : (
                    <div
                        class="auth-widget__initials"
                        onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                    >
                        {initials}
                    </div>
                )}

                {isProfileMenuOpen && (
                    <div class="auth-widget__dropdown">
                        <div class="auth-widget__user-info">
                            <div class="auth-widget__user-name">{user.displayName || 'User'}</div>
                            <div class="auth-widget__user-email">{user.email}</div>
                        </div>

                        {!isGoogleLinked && (
                            <button onClick={() => handleLink(googleProvider)} class="auth-widget__link-btn button button--small button--outline">
                                Link Google
                            </button>
                        )}
                        {!isGithubLinked && (
                            <button onClick={() => handleLink(githubProvider)} class="auth-widget__link-btn button button--small button--outline">
                                Link GitHub
                            </button>
                        )}

                        <button onClick={handleLogout} class="auth-widget__signout-btn button button--small button--primary">
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div class="auth-widget" ref={wrapperRef}>
            <button
                onClick={() => setLoginModalOpen(!isLoginModalOpen)}
                class="button button--primary"
            >
                Login
            </button>

            {isLoginModalOpen && (
                <div class="auth-widget__popover">
                    <div class="auth-widget__popover-header">
                        <div class="auth-widget__popover-title">Welcome Back</div>
                        <div class="auth-widget__popover-subtitle">Sign in to continue learning</div>
                    </div>

                    <button onClick={() => handleLogin(googleProvider)} class="auth-widget__popover-btn button button--outline">
                        <span>Google</span>
                    </button>
                    <button onClick={() => handleLogin(githubProvider)} class="auth-widget__popover-btn button button--outline">
                        <span>GitHub</span>
                    </button>
                </div>
            )}
        </div>
    );
}
