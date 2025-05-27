import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import NavBar from './components/NavBar';

// Páginas
import Home from './pages/Home.jsx';
import SalasPage from './pages/SalasPage.jsx';
import ReservasPage from './pages/ReservasPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

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
