import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { IoNotificationsOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { SubMenu } from './SubMenu';
export function Header({
  isAuthenticated,
  user,
  logout,
  navigate
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed z-50 w-full bg-white shadow-lg border-b border-[#DBEAFE]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        {/* Logo y menú hamburguesa */}
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-[#2563EB] tracking-wide">
            <img src=".." alt="Logo" />
          </div>
          {/* Menú hamburguesa solo en mobile */}
          <button
            className="md:hidden text-3xl text-[#2563EB] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
          {/* Navegación desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link to="/" className="text-[#111827] hover:text-[#2563EB] font-medium transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="#" className="text-[#111827] hover:text-[#2563EB] font-medium transition-colors">Nosotros</Link>
              </li>
              <li>
                <Link to="#" className="text-[#111827] hover:text-[#2563EB] font-medium transition-colors">Proyectos</Link>
              </li>
              <li>
                <Link to="#" className="text-[#111827] hover:text-[#2563EB] font-medium transition-colors">Transparencia</Link>
              </li>
              <li>
                <Link to="#" className="text-[#111827] hover:text-[#2563EB] font-medium transition-colors">Contacto</Link>
              </li>
              {isAuthenticated && user.rol_nombre === 'Administrador' ? (
                <li className="relative group">
                  <Link to="#" className="text-[#111827] hover:text-[#F59E0B] font-semibold transition-colors">Administración</Link>
                  <div className="fixed left-1/2 transform -translate-x-1/2 mt-2 w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <SubMenu />
                  </div>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
        {/* Notificaciones y usuario */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <IoNotificationsOutline className="text-[#2563EB] text-3xl" />
            <span className="absolute -top-2 -right-3 bg-[#F59E0B] text-[#111827] text-xs  rounded-full px-2 py-0.5">
              9+
            </span>
          </div>
          {isAuthenticated && user ? (
            <>
              <div className="flex flex-col w-full rounded px-3 py-1 bg-transparent">
                <p className="text-[#1E3A8A] font-medium">¡Hola! {user.nombre_completo}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2 rounded bg-[#F59E0B] text-[#111827] font-semibold hover:bg-[#FFD166] transition w-full"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-[#2563EB] text-white font-semibold hover:bg-[#1E3A8A] transition"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
      {/* Menú mobile */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-[#DBEAFE] shadow-lg">
          <ul className="flex flex-col space-y-2 px-8 py-4">
            <li>
              <Link to="/" className="block text-[#111827] hover:text-[#2563EB] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Inicio</Link>
            </li>
            <li>
              <Link to="#" className="block text-[#111827] hover:text-[#2563EB] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Nosotros</Link>
            </li>
            <li>
              <Link to="#" className="block text-[#111827] hover:text-[#2563EB] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Proyectos</Link>
            </li>
            <li>
              <Link to="#" className="block text-[#111827] hover:text-[#2563EB] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Transparencia</Link>
            </li>
            <li>
              <Link to="#" className="block text-[#111827] hover:text-[#2563EB] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Contacto</Link>
            </li>
            {isAuthenticated && user.rol === 'admin' ? (
              <li>
                <Link to="#" className="block text-[#111827] hover:text-[#F59E0B] font-semibold transition-colors" onClick={() => setMenuOpen(false)}>Administración</Link>
              </li>
            ) : null}
          </ul>
        </nav>
      )}
    </header>
  );
}