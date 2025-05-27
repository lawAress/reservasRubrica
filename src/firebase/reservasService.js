import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config';
import { cambiarDisponibilidad } from './salasService';

// Colección de reservas
const reservasCollection = collection(db, 'reservas');

// Obtener todas las reservas
export const getReservas = async () => {
  const snapshot = await getDocs(reservasCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Obtener reservas activas
export const getReservasActivas = async () => {
  const q = query(reservasCollection, where("estado", "==", "activa"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Obtener una reserva por ID
export const getReservaById = async (id) => {
  const docRef = doc(db, 'reservas', id);
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

// Crear una nueva reserva
export const crearReserva = async (reserva) => {
  // Cambiar disponibilidad de la sala a false
  await cambiarDisponibilidad(reserva.idSala, false);
  
  // Crear la reserva
  return await addDoc(reservasCollection, {
    ...reserva,
    estado: "activa",
    fechaCreacion: new Date()
  });
};

// Finalizar una reserva
export const finalizarReserva = async (id, idSala) => {
  // Cambiar disponibilidad de la sala a true
  await cambiarDisponibilidad(idSala, true);
  
  // Actualizar estado de la reserva
  const docRef = doc(db, 'reservas', id);
  return await updateDoc(docRef, { 
    estado: "finalizada",
    fechaFinalizacion: new Date()
  });
};

// Eliminar una reserva
export const eliminarReserva = async (id) => {
  const docRef = doc(db, 'reservas', id);
  return await deleteDoc(docRef);
};