import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import NavBar from './components/NavBar';

// Páginas
import Home from '/src/pages/Home.jsx';
import SalasPage from '/src/pages/SalasPage.jsx';
import ReservasPage from '/src/pages/ReservasPage.jsx';
import AdminPage from '/src/pages/AdminPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/salas" element={<SalasPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
