import React, { Suspense } from 'react'
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
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Profile from './pages/user/Profile'
import ChangePassword from './pages/user/ChangePassword'
import PublicProfile from './pages/user/PublicProfile'
import FavoriteRoutes from './pages/FavoriteRoutes'
import MyRoutes from './pages/MyRoutes'
import { AppProvider } from './context/AppContext'
import MapConfigMessage from './components/MapConfigMessage'

export default function App() {
  return (
    <AppProvider>
      <Router>        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">            {/* El componente MapConfigMessage ahora verifica internamente si la API key es válida */}
            <MapConfigMessage />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rutas" element={<Rutas />} />
                <Route path="/rutas/:id" element={<ShowRuta />} />
                <Route path="/nueva-ruta" element={<NewRuta />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />                <Route path="/reset-password" element={<ResetPassword />} />                <Route path="/perfil" element={<Profile />} />
                <Route path="/cambiar-password" element={<ChangePassword />} />
                <Route path="/favoritos" element={<FavoriteRoutes />} />
                <Route path="/mis-rutas" element={<MyRoutes />} />
                <Route path="/usuarios/:userId" element={
                  <Suspense fallback={<div className="flex justify-center py-10"><div className="animate-spin h-8 w-8 text-blue-600">Cargando...</div></div>}>
                    <PublicProfile />
                  </Suspense>
                } />
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


