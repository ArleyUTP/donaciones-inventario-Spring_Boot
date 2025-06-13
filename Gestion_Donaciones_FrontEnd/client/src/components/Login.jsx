import { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MySwal = withReactContent(Swal);

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

        const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:8080/user/login', {
                nombreUsuario: nombreUsuario,
                contrasena: contrasena
            });

            if (response.status === 200) {
                await MySwal.fire({
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso',
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    timer: 2000,
                    timerProgressBar: true
                });
                login(response.data); // Guarda usuario en contexto
                navigate('/'); // Redirige al home o dashboard
            }
        } catch (error) {
            await MySwal.fire({
                title: 'Error',
                text: error.response?.data?.error || 'Error al intentar iniciar sesión',
                icon: 'error',
                confirmButtonText: 'Intentar nuevamente'
            });
        }
    };

    return (
         <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Iniciar Sesión
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombreUsuario">
                                Nombre de usuario
                            </Label>
                            <Input
                                id="nombreUsuario"
                                type="text"
                                value={nombreUsuario}
                                onChange={e => setNombreUsuario(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contrasena">
                                Contraseña
                            </Label>
                            <Input
                                id="contrasena"
                                type="password"
                                value={contrasena}
                                onChange={e => setContrasena(e.target.value)}
                                required
                            />
                        </div>

                        <div className="text-center text-sm">
                            <p className="text-muted-foreground">
                                ¿No tienes una cuenta?{" "}
                                <Link
                                    to="/registro"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Crear Cuenta
                                </Link>
                            </p>
                        </div>

                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;