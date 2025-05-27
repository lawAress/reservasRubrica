import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { getSalas, buscarSalasPorNombre } from '../firebase/salasService';
import { crearReserva } from '../firebase/reservasService';

function SalasPage() {
  const [salas, setSalas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('todas');
  const [usuario, setUsuario] = useState('');
  const [cargando, setCargando] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const handleShowAlert = (message, variant = 'success') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    // Ocultar la alerta después de 3 segundos
    setTimeout(() => setShowAlert(false), 3000);
  };
  

  useEffect(() => {
    const cargarSalas = async () => {
      try {
        const salasData = await getSalas();
        setSalas(salasData);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar salas:", error);
        setCargando(false);
      }
    };

    cargarSalas();
  }, []);

  const handleBuscar = async () => {
    if (busqueda.trim() === '') {
      const salasData = await getSalas();
      setSalas(salasData);
    } else {
      const salasFiltradas = await buscarSalasPorNombre(busqueda);
      setSalas(salasFiltradas);
    }
  };

  const handleReservar = async (idSala) => {
    if (!usuario.trim()) {
      handleShowAlert('Por favor, ingresa tu nombre para realizar la reserva' , 'danger');
      return;
    }

    try {
      const nuevaReserva = {
        idSala,
        usuario,
        fechaReserva: new Date().toISOString().split('T')[0],
        horaInicio: new Date().toTimeString().split(' ')[0],
        horaFin: '',
      };

      await crearReserva(nuevaReserva);
      handleShowAlert('Reserva realizada con éxito');
      setUsuario('');
      
      // Actualizar la lista de salas
      const salasActualizadas = await getSalas();
      setSalas(salasActualizadas);
    } catch (error) {
      console.error("Error al crear reserva:", error);
      handleShowAlert('Error al crear la reserva' , 'danger');
    }
  };

  const salasFiltradas = salas.filter(sala => {
    if (filtroDisponibilidad === 'disponibles') {
      return sala.disponibilidad === true;
    } else if (filtroDisponibilidad === 'no-disponibles') {
      return sala.disponibilidad === false;
    }
    return true;
  });

  return (
    <Container>
      <h1 className="mb-4">Salas Deportivas</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Buscar por nombre</Form.Label>
            <div className="d-flex">
              <Form.Control 
                type="text" 
                placeholder="Nombre de la sala" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Button variant="primary" className="ms-2" onClick={handleBuscar}>
                Buscar
              </Button>
            </div>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Filtrar por disponibilidad</Form.Label>
            <Form.Select 
              value={filtroDisponibilidad}
              onChange={(e) => setFiltroDisponibilidad(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="disponibles">Disponibles</option>
              <option value="no-disponibles">No disponibles</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Tu nombre</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ingresa tu nombre" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {cargando ? (
        <p>Cargando salas...</p>
      ) : (
        <Row>
          {salasFiltradas.length > 0 ? (
            salasFiltradas.map(sala => (
              <Col md={4} key={sala.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{sala.nombre}</Card.Title>
                    <Badge 
                      bg={sala.disponibilidad ? "success" : "danger"}
                      className="mb-2"
                    >
                      {sala.disponibilidad ? "Disponible" : "No disponible"}
                    </Badge>
                    <Card.Text>{sala.descripcion}</Card.Text>
                    <Card.Text><strong>Capacidad:</strong> {sala.capacidad} personas</Card.Text>
                    <Card.Text><strong>Ubicación:</strong> {sala.ubicacion}</Card.Text>
                    {sala.disponibilidad && (
                      <Button 
                        variant="primary" 
                        onClick={() => handleReservar(sala.id)}
                      >
                        Reservar
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No se encontraron salas que coincidan con los criterios de búsqueda.</p>
            </Col>
          )}
        </Row>
      )}
      {showAlert && (
        <Alert 
          variant={alertVariant} 
          className="mt-3 position-fixed bottom-0 start-50 translate-middle-x"
          style={{ zIndex: 1000 }}
          onClose={() => setShowAlert(false)} 
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
    </Container>
  );
}

export default SalasPage;