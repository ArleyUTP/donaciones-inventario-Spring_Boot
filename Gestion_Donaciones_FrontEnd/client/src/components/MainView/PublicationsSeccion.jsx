import React, { useState, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/AuthContext";

// Componente Card de Comentario
function CommentCard({ comentario }) {
    // Obtener iniciales del nombre del usuario
    const getIniciales = (nombre) => {
        if (!nombre) return 'U';
        return nombre
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="max-w-sm border border-gray-300 rounded-lg shadow-lg bg-white p-6 space-y-4 mb-4">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center bg-[#2563EB] text-white text-lg font-semibold rounded-full">
                    {comentario.usuario ? getIniciales(comentario.usuario.nombre) : 'U'}
                </div>
                <div>
                    <div className="text-gray-900 font-medium">{comentario.usuario?.nombre || 'Usuario'}</div>
                    <div className="text-gray-600 text-sm">{comentario.usuario?.rol?.nombre || 'Usuario'}</div>
                </div>
            </div>
            <p className="text-gray-700">{comentario.contenido}</p>
            <div className="text-xs text-gray-500">
                {new Date(comentario.fechaComentario).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
    );
}

// Modal de Comentarios
function CommentsModal({ open: isOpen, onClose, comentarios, onAddComment }) {
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const handleAddComment = async (contenido) => {
        if (!contenido.trim() || !user) return;

        try {
            setIsSubmitting(true);
            await onAddComment(contenido);
            setNuevoComentario("");
        } catch (error) {
            console.error('Error al agregar comentario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                >
                    ×
                </button>
                <h3 className="text-2xl font-bold mb-6 text-[#2563EB]">Comentarios</h3>
                <div className="max-h-80 overflow-y-auto mb-6">
                    {isSubmitting && (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#2563EB]"></div>
                        </div>
                    )}
                    {!isSubmitting && comentarios.length === 0 && (
                        <div className="text-gray-500 text-center">No hay comentarios aún.</div>
                    )}
                    {!isSubmitting && comentarios.map((comentario, idx) => (
                        <CommentCard key={idx} comentario={comentario} />
                    ))}
                </div>
                {user ? (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            if (nuevoComentario.trim()) {
                                handleAddComment(nuevoComentario);
                                setNuevoComentario("");
                            }
                        }}
                        className="flex flex-col gap-2"
                    >
                        <textarea
                            className="border rounded-lg p-2 resize-none"
                            rows={2}
                            placeholder="Escribe un comentario..."
                            value={nuevoComentario}
                            onChange={e => setNuevoComentario(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`self-end px-4 py-2 rounded-lg font-semibold transition ${
                                isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#2563EB] text-white hover:bg-[#1E3A8A]'
                            }`}
                        >
                            {isSubmitting ? 'Enviando...' : 'Comentar'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4 text-gray-600">
                        Inicia sesión para dejar un comentario
                    </div>
                )}
            </div>
        </div>
    );
}

export function PublicationsSeccion() {
    const { user } = useAuth();
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [pubSeleccionada, setPubSeleccionada] = useState(null);
    // State for comment input is now handled in the CommentsModal component

    // Obtener publicaciones del backend
    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/mongodb/publicaciones');
                setPublicaciones(response.data);
            } catch (error) {
                console.error('Error al cargar publicaciones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicaciones();
    }, []);

    const handleOpenModal = async (publicacion) => {
        try {
            setLoading(true);
            // Obtener la publicación con los comentarios actualizados
            const response = await axios.get(`http://localhost:8080/api/mongodb/publicaciones/${publicacion.id}`);
            setPubSeleccionada(response.data);
            setComentarios(response.data.comentarios || []);
            setModalOpen(true);
        } catch (error) {
            console.error('Error al cargar los comentarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (contenido) => {
        if (!contenido.trim() || !pubSeleccionada || !user) return;

        try {
            setLoading(true);
            const comentario = {
                contenido,
                usuario: user,
                fechaComentario: new Date().toISOString()
            };

            // Agregar el comentario al backend
            const response = await axios.post(
                `http://localhost:8080/api/mongodb/publicaciones/${pubSeleccionada.id}/comentarios`,
                comentario
            );

            // Actualizar la lista de comentarios
            setComentarios(response.data.comentarios || []);
            
            // Actualizar la lista de publicaciones
            const updatedPublicaciones = publicaciones.map(pub => 
                pub.id === pubSeleccionada.id ? response.data : pub
            );
            setPublicaciones(updatedPublicaciones);
        } catch (error) {
            console.error('Error al agregar comentario:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="publications" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-[#111827] mb-2">Distribuciones de Donaciones</h2>
                        <p className="text-[#6B7280] text-lg">Explora nuestras últimas distribuciones y comentarios.</p>
                    </div>
                    <button className="border border-[#111827] text-[#111827] px-4 py-2 rounded hover:bg-[#F3F4F6] transition font-medium">
                        Ver todo
                    </button>
                </div>
                {/* Publicaciones */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB]"></div>
                        </div>
                    ) : publicaciones.length === 0 ? (
                        <div className="col-span-3 text-center py-10 text-gray-500">
                            No hay publicaciones disponibles.
                        </div>
                    ) : (
                        publicaciones.map((pub) => (
                            <div key={pub.id} className="bg-[#F3F4F6] rounded-2xl shadow p-0 flex flex-col">
                                {/* Mostrar imagen de la publicación si existe */}
                                {pub.imagenUrl ? (
                                    <img 
                                        src={pub.imagenUrl} 
                                        alt={pub.titulo} 
                                        className="w-full h-56 object-cover rounded-t-2xl"
                                    />
                                ) : (
                                    <div className="w-full h-56 bg-[#DBEAFE] flex items-center justify-center rounded-t-2xl">
                                        <svg width="64" height="64" fill="none" viewBox="0 0 96 96">
                                            <rect width="96" height="96" rx="12" fill="#E5E7EB" />
                                            <path d="M28 68l16-20 12 16 8-10 12 14" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="36" cy="36" r="8" fill="#D1D5DB" />
                                        </svg>
                                    </div>
                                )}
                                {/* Contenido */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-2">
                                        <span className="bg-white text-[#2563EB] px-3 py-1 rounded-full text-xs font-semibold mr-2">
                                            Publicación
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#111827] mb-1">{pub.titulo}</h3>
                                    <p className="text-[#6B7280] text-sm mb-4 line-clamp-3">{pub.descripcion}</p>
                                    <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-4">
                                        <span className="flex items-center gap-1">
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#6B7280" />
                                            </svg>
                                            {pub.usuarioCreador?.nombre || 'Usuario'}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {new Date(pub.fechaCreacion).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="mt-auto flex justify-between items-center">
                                        <button
                                            className="flex items-center gap-2 text-[#2563EB] font-semibold hover:underline"
                                            onClick={() => handleOpenModal(pub)}
                                        >
                                            <FaRegCommentDots className="text-lg" />
                                            {pub.comentarios?.length || 0} Comentarios
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Modal de comentarios */}
                <CommentsModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    comentarios={comentarios}
                    onAddComment={handleAddComment}
                />
            </div>
        </section>
    );
}