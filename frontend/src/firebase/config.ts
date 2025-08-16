import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBgF-mh7nK3gt1by4FM6qcUIwPN5-jcoOY",
  authDomain: "artchain-55101.firebaseapp.com",
  projectId: "artchain-55101",
  storageBucket: "artchain-55101.firebasestorage.app",
  messagingSenderId: "544340982457",
  appId: "1:544340982457:web:dc9cecec1e488ee3343968",
  measurementId: "G-KZR52RX78E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken(); 
    
    return {
      token,
      email: result.user.email || '',
      name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
      uid: result.user.uid 
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export { auth, googleProvider };