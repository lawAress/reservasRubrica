import { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { getReservas, finalizarReserva } from '../firebase/reservasService';
import { getSalaById } from '../firebase/salasService';

function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [cargando, setCargando] = useState(true);
  const [reservasConSalas, setReservasConSalas] = useState([]);

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const reservasData = await getReservas();
        setReservas(reservasData);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        setCargando(false);
      }
    };

    cargarReservas();
  }, []);

  useEffect(() => {
    const obtenerDetallesSalas = async () => {
      if (reservas.length > 0) {
        const reservasDetalladas = await Promise.all(
          reservas.map(async (reserva) => {
            const sala = await getSalaById(reserva.idSala);
            return {
              ...reserva,
              sala
            };
          })
        );
        setReservasConSalas(reservasDetalladas);
      }
    };

    obtenerDetallesSalas();
  }, [reservas]);

  const handleFinalizar = async (id, idSala) => {
    try {
      await finalizarReserva(id, idSala);
      alert('Reserva finalizada con éxito');
      
      // Actualizar la lista de reservas
      const reservasActualizadas = await getReservas();
      setReservas(reservasActualizadas);
    } catch (error) {
      console.error("Error al finalizar reserva:", error);
      alert('Error al finalizar la reserva');
    }
  };

  const filtrarReservasPorUsuario = () => {
    if (!usuario.trim()) {
      return reservasConSalas;
    }
    return reservasConSalas.filter(reserva => 
      reserva.usuario.toLowerCase().includes(usuario.toLowerCase())
    );
  };

  const reservasFiltradas = filtrarReservasPorUsuario();

  return (
    <Container>
      <h1 className="mb-4">Mis Reservas</h1>
      
      <Form.Group className="mb-4">
        <Form.Label>Filtrar por usuario</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Ingresa tu nombre" 
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
      </Form.Group>

      {cargando ? (
        <p>Cargando reservas...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Sala</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.length > 0 ? (
              reservasFiltradas.map(reserva => (
                <tr key={reserva.id}>
                  <td>{reserva.sala?.nombre || 'Sala no disponible'}</td>
                  <td>{reserva.usuario}</td>
                  <td>{reserva.fechaReserva}</td>
                  <td>{reserva.horaInicio}</td>
                  <td>{reserva.estado}</td>
                  <td>
                    {reserva.estado === 'activa' && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleFinalizar(reserva.id, reserva.idSala)}
                      >
                        Finalizar
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay reservas disponibles</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default ReservasPage;