import { useState, useEffect } from 'react';
import Axios from 'axios';

function GestionDistribuciones() {
    const [distribuciones, setDistribuciones] = useState([]);
    const [nuevaDistribucion, setNuevaDistribucion] = useState({
        beneficiario_id: '',
        fecha_programada: '',
        responsable: '',
        recursos: []
    });

    useEffect(() => {
        obtenerDistribuciones();
    }, []);

    const obtenerDistribuciones = async () => {
        // Aquí iría la llamada a la API para obtener distribuciones
        // setDistribuciones(response.data);
    };

    const planificarDistribucion = async () => {
        // Aquí iría la lógica para crear una nueva distribución
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-center mb-8 text-3xl font-bold text-blue-600">Gestión de Distribuciones</h1>
            {/* Formulario para planificar entrega */}
            <div className="bg-white rounded-lg shadow-lg mb-8 p-6">
                <h2 className="text-xl font-semibold mb-4">Planificar Nueva Entrega</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aquí irían los campos para seleccionar beneficiario, fecha, responsable y recursos */}
                    {/* Ejemplo de campo: */}
                    <div>
                        <label className="block text-gray-700 mb-1">Beneficiario</label>
                        <select className="w-full border rounded-lg px-3 py-2">
                            <option value="">Seleccionar</option>
                            {/* Mapear beneficiarios */}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Fecha Programada</label>
                        <input type="date" className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Responsable</label>
                        <input type="text" className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    {/* Selección de recursos */}
                </form>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Planificar Entrega
                </button>
            </div>
            {/* Listado de distribuciones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Distribuciones Programadas</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="px-4 py-2">Beneficiario</th>
                                <th className="px-4 py-2">Fecha Programada</th>
                                <th className="px-4 py-2">Estado</th>
                                <th className="px-4 py-2">Responsable</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapear distribuciones */}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Aquí podrías agregar el detalle y comentarios/evidencias */}
        </div>
    );
}

export default GestionDistribuciones;