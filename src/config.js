import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBL9KyTLcyKplLYKTLkE7Ryn1v24cgURR4",
  authDomain: "reservas-6c8f0.firebaseapp.com",
  projectId: "reservas-6c8f0",
  storageBucket: "reservas-6c8f0.firebasestorage.app",
  messagingSenderId: "992719444062",
  appId: "1:992719444062:web:d2c1f37b5edbc8f6f0bccf"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };