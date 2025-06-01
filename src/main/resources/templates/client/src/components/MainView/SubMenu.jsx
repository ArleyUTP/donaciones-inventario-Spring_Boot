import React from "react";
import { Link } from 'react-router-dom';

export function SubMenu() {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 w-[700px] mx-auto my-8">
            <div className="grid grid-cols-3 gap-12">
                <div className="p-6 hover:bg-gray-50 rounded-xl transition duration-300">
                    <h3 className="text-2xl font-bold text-blue-600 mb-6">Gestión</h3>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/gestion-usuarios" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Usuarios
                            </Link>
                        </li>
                        <li>
                            <Link to="/gestion-donadores" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Donadores
                            </Link>
                        </li>
                        <li>
                            <Link to="/gestion-donaciones" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Donaciones
                            </Link>
                        </li>
                        <li>
                            <Link to="/gestion-distribuciones" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Distribuciones
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="p-6 hover:bg-gray-50 rounded-xl transition duration-300">
                    <h3 className="text-2xl font-bold text-blue-600 mb-6">Reportes</h3>
                    <ul className="space-y-4">
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Generar reportes
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Estadísticas
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="p-6 hover:bg-gray-50 rounded-xl transition duration-300">
                    <h3 className="text-2xl font-bold text-blue-600 mb-6">Configuración</h3>
                    <ul className="space-y-4">
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Ajustes
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-lg flex items-center gap-2 hover:translate-x-2 transform">
                                Permisos
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
