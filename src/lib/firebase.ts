import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
    if (!_app) {
        _app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    return _app;
}

function getFirebaseAuth(): Auth {
    if (!_auth) {
        _auth = getAuth(getFirebaseApp());
    }
    return _auth;
}

export const app = typeof window !== 'undefined' ? getFirebaseApp() : (null as unknown as FirebaseApp);
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : (null as unknown as Auth);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
