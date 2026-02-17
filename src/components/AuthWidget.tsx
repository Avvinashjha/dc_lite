import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { userStore, isAuthLoading } from '../store/userStore';
import { auth, googleProvider, githubProvider } from '../lib/firebase';
import { signInWithPopup, signOut, linkWithPopup } from 'firebase/auth';

export default function AuthWidget() {
    const user = useStore(userStore);
    const loading = useStore(isAuthLoading);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
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

    // Reset image error state when user changes
    useEffect(() => {
        setImageError(false);
    }, [user?.uid]);

    const handleLogin = async (provider: any) => {
        setLoginModalOpen(false);
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error("Login failed:", error);
            alert(`Login failed: ${error.message}`);
        }
    };

    const handleLink = async (provider: any) => {
        if (!user) return;
        try {
            await linkWithPopup(user, provider);
            alert("Account linked successfully!");
        } catch (error: any) {
            console.error("Linking failed:", error);
            alert(`Linking failed: ${error.message}`);
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
            <div class="auth-widget logged-in" style={{ position: 'relative' }} ref={wrapperRef}>
                {user.photoURL && !imageError ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        class="user-avatar"
                        onError={() => setImageError(true)}
                        onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                        style={{
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            cursor: 'pointer',
                            border: '2px solid transparent',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            objectFit: 'cover'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                ) : (
                    <div
                        onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary, #2563eb)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            userSelect: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {initials}
                    </div>
                )}

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        backgroundColor: 'var(--color-bg, #1a1a1a)',
                        color: 'var(--color-text, #fff)',
                        border: '1px solid var(--color-border, #333)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        minWidth: '240px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>
                        <div style={{ borderBottom: '1px solid var(--color-border, #333)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{ fontWeight: '600', fontSize: '1rem' }}>{user.displayName || 'User'}</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.7, wordBreak: 'break-all' }}>{user.email}</div>
                        </div>

                        {!isGoogleLinked && (
                            <button onClick={() => handleLink(googleProvider)} class="button button--small button--outline" style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Link Google
                            </button>
                        )}
                        {!isGithubLinked && (
                            <button onClick={() => handleLink(githubProvider)} class="button button--small button--outline" style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Link GitHub
                            </button>
                        )}

                        <button onClick={handleLogout} class="button button--small button--primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div class="auth-widget" style={{ position: 'relative' }} ref={wrapperRef}>
            <button
                onClick={() => setLoginModalOpen(!isLoginModalOpen)}
                class="button button--primary"
            >
                Login
            </button>

            {/* Login Modal/Popover */}
            {isLoginModalOpen && (
                <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    backgroundColor: 'var(--color-bg, #1a1a1a)',
                    color: 'var(--color-text, #fff)',
                    border: '1px solid var(--color-border, #333)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    minWidth: '260px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Welcome Back</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Sign in to continue learning</div>
                    </div>

                    <button onClick={() => handleLogin(googleProvider)} class="button button--outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '10px' }}>
                        <span>Google</span>
                    </button>
                    <button onClick={() => handleLogin(githubProvider)} class="button button--outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '10px' }}>
                        <span>GitHub</span>
                    </button>
                </div>
            )}
        </div>
    );
}
