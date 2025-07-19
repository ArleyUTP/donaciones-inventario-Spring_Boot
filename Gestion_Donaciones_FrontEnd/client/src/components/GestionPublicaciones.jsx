import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from '@/AuthContext';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { uploadImage } from '../Cloudinary';

const notificacion = withReactContent(Swal);

const GestionPublicaciones = () => {
    const { user } = useAuth();
    const [publicaciones, setPublicaciones] = useState([]);
    const [idPublicacion, setIdPublicacion] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenUrl, setImagenUrl] = useState('');
    const [loading, setLoading] = useState(true);

    // Funciones auxiliares
    const limpiarCampos = useCallback(() => {
        setIdPublicacion('');
        setTitulo('');
        setDescripcion('');
        setImagen(null);
        setImagenUrl('');
    }, []);

    const fetchPublicaciones = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/mongodb/publicaciones');
            setPublicaciones(response.data);
        } catch (error) {
            console.error('Error al cargar publicaciones:', error);
            notificacion.fire({
                title: "Error",
                text: "No se pudieron cargar las publicaciones",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Efectos
    useEffect(() => {
        fetchPublicaciones();
    }, [fetchPublicaciones]);



    // Crear nueva publicación
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const url = await uploadImage(file);
                setImagenUrl(url);
                setImagen(file);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            }
        }
    };

    const crearPublicacion = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = {
                titulo,
                descripcion,
                usuarioCreador: user,
                imagenUrl: imagenUrl
            };

            await axios.post('http://localhost:8080/api/mongodb/publicaciones', formData);
            await fetchPublicaciones();
            limpiarCampos();

            notificacion.fire({
                title: "Guardado",
                text: "La publicación fue guardada correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                timer: 3000,
            });
        } catch (error) {
            console.error('Error al crear la publicación:', error);
            notificacion.fire({
                title: "Error",
                text: "No se pudo crear la publicación",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const editarPublicacion = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Primero obtenemos la publicación existente para mantener la estructura completa
            const response = await axios.get(`http://localhost:8080/api/mongodb/publicaciones/${idPublicacion}`);
            const publicacionActual = response.data;

            // Actualizamos solo los campos que queremos modificar
            const publicacionActualizada = {
                ...publicacionActual,
                titulo,
                descripcion,
                imagenUrl: imagenUrl || publicacionActual.imagenUrl
            };

            // Enviamos la publicación completa usando POST
            await axios.post(`http://localhost:8080/api/mongodb/publicaciones`, publicacionActualizada);
            await fetchPublicaciones();
            limpiarCampos();

            notificacion.fire({
                title: "Actualizado",
                text: "La publicación fue actualizada correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                timer: 3000,
            });
        } catch (error) {
            console.error('Error al actualizar la publicación:', error.response?.data || error.message);
            notificacion.fire({
                title: "Error",
                text: error.response?.data || "No se pudo actualizar la publicación",
                icon: "error",
            });
        } finally {
            setLoading(false);
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
                                    <div className="space-y-2">
                                        <Label htmlFor="imagen">Imagen</Label>
                                        <input
                                            type="file"
                                            id="imagen"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="file-input file-input-bordered w-full"
                                        />
                                        {imagenUrl && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagenUrl}
                                                    alt="Preview"
                                                    className="max-h-96 w-1/2 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {idPublicacion ? (
                                        <>
                                            <Button type="submit" className="w-full mb-2" onClick={editarPublicacion}>
                                                Actualizar Publicación
                                            </Button>
                                            <Button type="button" className="w-full" onClick={limpiarCampos}>
                                                Nueva Publicación
                                            </Button>
                                        </>
                                    ) : (
                                        <Button type="submit" className="w-full">
                                            Crear Publicación
                                        </Button>
                                    )}
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
                                                    <TableCell>
                                                        <div className="flex flex-col gap-2">
                                                            {publicacion.imagenUrl && (
                                                                <img
                                                                    src={publicacion.imagenUrl}
                                                                    alt={publicacion.titulo}
                                                                    className="w-20 h-20 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <div className="mt-2">
                                                                {publicacion.descripcion}
                                                            </div>
                                                            <div className="flex gap-2 mt-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setIdPublicacion(publicacion.id);
                                                                        setTitulo(publicacion.titulo);
                                                                        setDescripcion(publicacion.descripcion);
                                                                        setImagenUrl(publicacion.imagenUrl);
                                                                    }}
                                                                >
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        const result = await notificacion.fire({
                                                                            title: "¿Estás seguro?",
                                                                            text: "Esta acción eliminará la publicación.",
                                                                            icon: "warning",
                                                                            showCancelButton: true,
                                                                            confirmButtonText: "Sí, eliminar",
                                                                            cancelButtonText: "Cancelar",
                                                                        });

                                                                        if (result.isConfirmed) {
                                                                            try {
                                                                                setLoading(true);
                                                                                await axios.delete(`http://localhost:8080/api/mongodb/publicaciones/${publicacion.id}`);
                                                                                await fetchPublicaciones();
                                                                                notificacion.fire({
                                                                                    title: "Eliminado",
                                                                                    text: "La publicación fue eliminada correctamente",
                                                                                    icon: "success",
                                                                                    confirmButtonText: "Aceptar",
                                                                                    timer: 3000,
                                                                                });
                                                                            } catch (error) {
                                                                                console.error('Error al eliminar la publicación:', error);
                                                                                notificacion.fire({
                                                                                    title: "Error",
                                                                                    text: "No se pudo eliminar la publicación",
                                                                                    icon: "error",
                                                                                });
                                                                            } finally {
                                                                                setLoading(false);
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </TableCell>
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