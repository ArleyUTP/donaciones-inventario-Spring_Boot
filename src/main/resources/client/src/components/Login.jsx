import { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
const MySwal = withReactContent(Swal);

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('https://nodejs-api-nq31.onrender.com/auth/login', {
                nombre_usuario: nombreUsuario,
                contrasena: contrasena
            });

            if (response.data.success) {
                await MySwal.fire({
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso',
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    timer: 2000,
                    timerProgressBar: true
                });
                login(response.data.usuario); // Guarda usuario en contexto
                navigate('/'); // Redirige al home o dashboard
            } else {
                await MySwal.fire({
                    title: 'Error',
                    text: 'Credenciales incorrectas',
                    icon: 'error',
                    confirmButtonText: 'Intentar nuevamente'
                });
            }
        } catch (error) {
            await MySwal.fire({
                title: 'Error',
                text: `No se pudo conectar al servidor: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 rounded-lg shadow-xl w-full max-w-md bg-white">
                <h2 className="text-2xl font-bold mb-6 text-blue-600">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-1 text-black">Nombre de usuario</label>
                        <input
                            type="text"
                            value={nombreUsuario}
                            onChange={e => setNombreUsuario(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-1 text-black">Contraseña</label>
                        <input
                            type="password"
                            value={contrasena}
                            onChange={e => setContrasena(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <p className="text-center mt-4 mb-6 text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                to="/registro"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
                            >
                                Crear Cuenta
                            </Link>
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;