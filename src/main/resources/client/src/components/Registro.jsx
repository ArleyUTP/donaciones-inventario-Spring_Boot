import { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Registro() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [esDonador, setEsDonador] = useState(false);

    const registrarUsuario = () => {
        Axios.post('http://localhost:3000/registro/create', {
            nombre_usuario: nombreUsuario,
            contrasena: contrasena,
            nombre_completo: nombreCompleto,
            email: email,
            telefono: telefono,
            es_donador: esDonador
        }).then(() => {
            MySwal.fire({
                title: 'Éxito',
                text: 'Usuario registrado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                timer: 3000
            });
            limpiarCampos();
        }).catch(err => {
            MySwal.fire({
                title: 'Error',
                text: 'Error al registrar usuario: ' + err.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        });
    };

    const limpiarCampos = () => {
        setNombreUsuario("");
        setContrasena("");
        setNombreCompleto("");
        setEmail("");
        setTelefono("");
        setEsDonador(false);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Registro de Usuario</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Nombre de Usuario:</label>
                    <input
                        type="text"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Contraseña:</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Nombre Completo:</label>
                    <input
                        type="text"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={esDonador}
                        onChange={(e) => setEsDonador(e.target.checked)}
                        className="mr-2"
                    />
                    <label className="text-gray-700">Usuario Donador</label>
                </div>
                {esDonador && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Teléfono:</label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                )}
                <button
                    onClick={registrarUsuario}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Registrar
                </button>
            </div>
        </div>
    );
}

export default Registro;