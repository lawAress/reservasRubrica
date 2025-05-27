import { Container, Row, Col, Card } from 'react-bootstrap';

function Home() {
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1 className="text-center">Bienvenido al Centro Deportivo Universitario</h1>
          <p className="lead text-center">
            Reserva instalaciones deportivas de manera fácil y rápida.
          </p>
        </Col>
      </Row>
      
      <Row className="my-5">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Instalaciones de Calidad</Card.Title>
              <Card.Text>
                Contamos con las mejores instalaciones deportivas para la práctica de diversos deportes.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Reserva Online</Card.Title>
              <Card.Text>
                Realiza tus reservas de manera sencilla a través de nuestra plataforma web.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Disponibilidad en Tiempo Real</Card.Title>
              <Card.Text>
                Consulta la disponibilidad de nuestras instalaciones en tiempo real.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;