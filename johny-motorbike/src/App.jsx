import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Layout from './components/Layout'
import Home from './pages/Home'
import Rutas from './pages/Rutas'
import NewRuta from './pages/NewRuta'
import ShowRuta from './pages/ShowRuta'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { AppProvider } from './context/AppContext'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rutas" element={<Rutas />} />
                <Route path="/rutas/:id" element={<ShowRuta />} />
                <Route path="/nueva-ruta" element={<NewRuta />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  )
}


