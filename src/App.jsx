import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import NavBar from './components/NavBar';

// Páginas
import Home from './pages/Home';
import SalasPage from './pages/SalasPage';
import ReservasPage from './pages/ReservasPage';
import AdminPage from './pages/AdminPage';

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
