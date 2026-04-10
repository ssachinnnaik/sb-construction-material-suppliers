import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBs2gF0T4RK8QZn58Yg4SqNG_V_tNkKuk",
  authDomain: "sb-construction-b6646.firebaseapp.com",
  projectId: "sb-construction-b6646",
  storageBucket: "sb-construction-b6646.firebasestorage.app",
  messagingSenderId: "296686270377",
  appId: "1:296686270377:web:b83577169e90c2dcef76b8"
};

// Initialize Firebase only on the client side, and ensure single instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use device language for SMS, required for India
auth.useDeviceLanguage();

export { app, auth };
