import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { getSalas, crearSala, actualizarSala, eliminarSala, escucharCambiosSalas } from '../firebase/salasService';

function AdminPage() {
  const [salas, setSalas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSala, setCurrentSala] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
    ubicacion: '',
    disponibilidad: true
  });
  const [editMode, setEditMode] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [salaToDelete, setSalaToDelete] = useState(null);

  const handleShowAlert = (message, variant = 'success') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
  };

  useEffect(() => {
    const unsubscribe = escucharCambiosSalas((salasData) => {
      setSalas(salasData);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSala({
      nombre: '',
      descripcion: '',
      capacidad: '',
      ubicacion: '',
      disponibilidad: true
    });
    setEditMode(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
    setEditMode(false);
  };

  const handleEditModal = (sala) => {
    setCurrentSala(sala);
    setEditMode(true);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSala({
      ...currentSala,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!currentSala.nombre.trim()) {
        handleShowAlert('El nombre de la sala es obligatorio', 'danger');
        return;
      }

      if (!currentSala.capacidad.toString().trim()) {
        handleShowAlert('La capacidad es obligatoria' , 'danger');
        return;
      }

      // Validación mejorada de capacidad
      const capacidad = parseInt(currentSala.capacidad);
      if (isNaN(capacidad) || capacidad <= 0) {
        handleShowAlert('La capacidad debe ser un número positivo' , 'danger');
        return;
      }

      const salaData = {
        ...currentSala,
        nombre: currentSala.nombre.trim(),
        descripcion: currentSala.descripcion.trim(),
        capacidad: capacidad,
        ubicacion: currentSala.ubicacion.trim(),
        disponibilidad: currentSala.disponibilidad
      };
      
      if (editMode) {
        await actualizarSala(currentSala.id, salaData);
        handleShowAlert('Sala actualizada con éxito');
        handleCloseModal();
      } else {
        await crearSala(salaData);
        setCurrentSala({
          nombre: '',
          descripcion: '',
          capacidad: '',
          ubicacion: '',
          disponibilidad: true
        });
        handleShowAlert('Sala creada con éxito');
      }
    
    } catch (error) {
      console.error("Error al guardar sala:", error);
      handleShowAlert(`Error al guardar la sala: ${error.message || 'Error desconocido'}`, 'danger');
    }
  };

  const handleDelete = (id) => {
    setSalaToDelete(id);
    setShowConfirmModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      await eliminarSala(salaToDelete);
      handleShowAlert('Sala eliminada con éxito');
      cargarSalas();
    } catch (error) {
      console.error("Error al eliminar sala:", error);
      handleShowAlert('Error al eliminar la sala', 'danger');
    }
    setShowConfirmModal(false);
    setSalaToDelete(null);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Administración de Salas</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleShowModal}>
            Nueva Sala
          </Button>
        </Col>
      </Row>

      {cargando ? (
        <p>Cargando salas...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Capacidad</th>
              <th>Ubicación</th>
              <th>Disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salas.length > 0 ? (
              salas.map(sala => (
                <tr key={sala.id}>
                  <td>{sala.nombre}</td>
                  <td>{sala.descripcion}</td>
                  <td>{sala.capacidad}</td>
                  <td>{sala.ubicacion}</td>
                  <td>{sala.disponibilidad ? 'Disponible' : 'No disponible'}</td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditModal(sala)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(sala.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay salas disponibles</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal para crear/editar sala */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Sala' : 'Nueva Sala'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {!editMode && salas.length > 0 && (
              <div className="mb-3">
                <h6>Salas existentes:</h6>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  <ul className="list-group">
                    {salas.map(sala => (
                      <li key={sala.id} className="list-group-item">
                        {sala.nombre} - {sala.ubicacion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre"
                value={currentSala.nombre}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre de la sala"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="descripcion"
                value={currentSala.descripcion}
                onChange={handleInputChange}
                required
                placeholder="Ingrese una descripción de la sala"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control 
                type="number" 
                name="capacidad"
                value={currentSala.capacidad}
                onChange={handleInputChange}
                required
                placeholder="Ingrese la capacidad de personas"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control 
                type="text" 
                name="ubicacion"
                value={currentSala.ubicacion}
                onChange={handleInputChange}
                required
                placeholder="Ingrese la ubicación de la sala"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Disponible" 
                name="disponibilidad"
                checked={currentSala.disponibilidad}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{alertVariant === 'success' ? 'Éxito' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlert(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta sala?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminPage;