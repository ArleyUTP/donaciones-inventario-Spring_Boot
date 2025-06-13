import { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const MySwal = withReactContent(Swal);

function Registro() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const navigate = useNavigate();

    const registrarUsuario = () => {
        Axios.post('http://localhost:8080/user/registro/create', {
            nombreUsuario,
            contrasena,
            nombreCompleto,
            email,
            telefono
        }).then(() => {
            MySwal.fire({
                title: 'Éxito',
                text: 'Usuario registrado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                timer: 3000
            });
            limpiarCampos();
            navigate('/login');
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
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center text-blue-600">
                    Registro de Usuario
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nombreUsuario">Nombre de Usuario</Label>
                    <Input
                        id="nombreUsuario"
                        type="text"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contrasena">Contraseña</Label>
                    <div className="relative">
                        <Input
                            id="contrasena"
                            type={mostrarContrasena ? "text" : "password"}
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        >
                            {mostrarContrasena ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nombreCompleto">Nombre Completo</Label>
                    <Input
                        id="nombreCompleto"
                        type="text"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                        id="telefono"
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                </div>

                <Button 
                    className="w-full" 
                    onClick={registrarUsuario}
                >
                    Registrar
                </Button>
            </CardContent>
        </Card>
    );
}

export default Registro;