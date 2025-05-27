import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config';

// Colección de salas
const salasCollection = collection(db, 'salas');

// Obtener todas las salas
export const getSalas = async () => {
  const snapshot = await getDocs(salasCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Obtener salas disponibles
export const getSalasDisponibles = async () => {
  const q = query(salasCollection, where("disponibilidad", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Obtener una sala por ID
export const getSalaById = async (id) => {
  const docRef = doc(db, 'salas', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } else {
    return null;
  }
};

// Buscar salas por nombre
export const buscarSalasPorNombre = async (nombre) => {
  const snapshot = await getDocs(salasCollection);
  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .filter(sala => sala.nombre.toLowerCase().includes(nombre.toLowerCase()));
};

// Crear una nueva sala
export const crearSala = async (sala) => {
  return await addDoc(salasCollection, sala);
};

// Actualizar una sala
export const actualizarSala = async (id, sala) => {
  const docRef = doc(db, 'salas', id);
  return await updateDoc(docRef, sala);
};

// Eliminar una sala
export const eliminarSala = async (id) => {
  const docRef = doc(db, 'salas', id);
  return await deleteDoc(docRef);
};

// Cambiar disponibilidad de una sala
export const cambiarDisponibilidad = async (id, disponibilidad) => {
  const docRef = doc(db, 'salas', id);
  return await updateDoc(docRef, { disponibilidad });
};

export const escucharCambiosSalas = (callback) => {
  return onSnapshot(salasCollection, (snapshot) => {
    const salas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(salas);
  });
};