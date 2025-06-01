import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function GestionDonaciones() {
    const [donaciones, setDonaciones] = useState([]);
    const [nuevaDonacion, setNuevaDonacion] = useState({
        donante: '',
        tipo: '',
        cantidad: 0,
        fecha: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        obtenerDonaciones();
    }, []);

    const obtenerDonaciones = async () => {
        try {
            const response = await Axios.get('http://localhost:3000/donaciones');
            setDonaciones(response.data);
        } catch (error) {
            MySwal.fire({
                title: 'Error',
                text: 'No se pudieron obtener las donaciones',
                icon: 'error'
            });
        }
    };

    const registrarDonacion = async () => {
        try {
            await Axios.post('http://localhost:3000/donaciones', nuevaDonacion);
            await MySwal.fire({
                title: 'Éxito',
                text: 'Donación registrada correctamente',
                icon: 'success'
            });
            obtenerDonaciones();
            setNuevaDonacion({
                donante: '',
                tipo: '',
                cantidad: 0,
                fecha: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            MySwal.fire({
                title: 'Error',
                text: 'No se pudo registrar la donación',
                icon: 'error'
            });
        }
    };

    const confirmarDonacion = async (id) => {
        try {
            await Axios.put(`http://localhost:3000/donaciones/${id}/confirmar`);
            await MySwal.fire({
                title: 'Éxito',
                text: 'Donación confirmada correctamente',
                icon: 'success'
            });
            obtenerDonaciones();
        } catch (error) {
            MySwal.fire({
                title: 'Error',
                text: 'No se pudo confirmar la donación',
                icon: 'error'
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-center mb-8 text-3xl font-bold text-blue-600">Gestión de Donaciones</h1>

            {/* Formulario para nueva donación */}
            <div className="bg-white rounded-lg shadow-lg mb-8 p-6">
                <h2 className="text-xl font-semibold mb-4">Registrar Nueva Donación</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Donante</label>
                        <input
                            type="text"
                            value={nuevaDonacion.donante}
                            onChange={(e) => setNuevaDonacion({ ...nuevaDonacion, donante: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Tipo de Donación</label>
                        <select
                            value={nuevaDonacion.tipo}
                            onChange={(e) => setNuevaDonacion({ ...nuevaDonacion, tipo: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Seleccionar</option>
                            <option value="dinero">Dinero</option>
                            <option value="alimentos">Alimentos</option>
                            <option value="medicinas">Medicinas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Cantidad</label>
                        <input
                            type="number"
                            value={nuevaDonacion.cantidad}
                            onChange={(e) => setNuevaDonacion({ ...nuevaDonacion, cantidad: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            value={nuevaDonacion.fecha}
                            onChange={(e) => setNuevaDonacion({ ...nuevaDonacion, fecha: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                </div>
                <button
                    onClick={registrarDonacion}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Registrar Donación
                </button>
            </div>

            {/* Listado de donaciones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Donaciones Recibidas</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="px-4 py-2">Donante</th>
                                <th className="px-4 py-2">Tipo</th>
                                <th className="px-4 py-2">Cantidad</th>
                                <th className="px-4 py-2">Fecha</th>
                                <th className="px-4 py-2">Estado</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donaciones.map((donacion) => (
                                <tr key={donacion.id} className="border-b">
                                    <td className="px-4 py-2">{donacion.donante}</td>
                                    <td className="px-4 py-2">{donacion.tipo}</td>
                                    <td className="px-4 py-2">{donacion.cantidad}</td>
                                    <td className="px-4 py-2">{donacion.fecha}</td>
                                    <td className="px-4 py-2">
                                        {donacion.confirmada ? (
                                            <span className="text-green-600">Confirmada</span>
                                        ) : (
                                            <span className="text-yellow-600">Pendiente</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {!donacion.confirmada && (
                                            <button
                                                onClick={() => confirmarDonacion(donacion.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            >
                                                Confirmar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GestionDonaciones;