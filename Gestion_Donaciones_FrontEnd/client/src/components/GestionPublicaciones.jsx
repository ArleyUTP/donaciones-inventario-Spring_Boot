import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GestionPublicaciones = () => {
    const { user } = useAuth();
    const [publicaciones, setPublicaciones] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(true);

    // Obtener publicaciones al cargar el componente
    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/mongodb/publicaciones');
                setPublicaciones(response.data);
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };
        fetchPublicaciones();
    }, []);

    // Crear nueva publicación
    const crearPublicacion = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/mongodb/publicaciones', {
                titulo,
                descripcion,
                usuarioCreador: user, // Usar el usuario del contexto de autenticación
            });
            setPublicaciones([...publicaciones, response.data]);
            setTitulo('');
            setDescripcion('');
        } catch {
            // Error handling can be improved here
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gestión de Publicaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Formulario para crear publicación */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Nueva Publicación</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={crearPublicacion} className="space-y-4">
                                    <div>
                                        <Label htmlFor="titulo">Título</Label>
                                        <Input
                                            id="titulo"
                                            value={titulo}
                                            onChange={(e) => setTitulo(e.target.value)}
                                            required
                                            placeholder="Ingrese el título de la publicación"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="descripcion">Descripción</Label>
                                        <Textarea
                                            id="descripcion"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            required
                                            placeholder="Ingrese la descripción de la publicación"
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Crear Publicación
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Lista de publicaciones */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Publicaciones</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Título</TableHead>
                                                <TableHead>Descripción</TableHead>
                                                <TableHead>Usuario</TableHead>
                                                <TableHead>Fecha de Creación</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {publicaciones.map((publicacion) => (
                                                <TableRow key={publicacion.id}>
                                                    <TableCell>{publicacion.titulo}</TableCell>
                                                    <TableCell>{publicacion.descripcion}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{publicacion.usuarioCreador?.nombreUsuario}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(publicacion.fechaCreacion).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GestionPublicaciones;