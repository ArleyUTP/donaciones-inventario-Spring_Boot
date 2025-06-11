import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";

// Componente Card de Comentario
function CommentCard({ comentario }) {
    return (
        <div className="max-w-sm border border-gray-300 rounded-lg shadow-lg bg-white p-6 space-y-4 mb-4">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center bg-[#2563EB] text-white text-lg font-semibold rounded-full">
                    {comentario.iniciales}
                </div>
                <div>
                    <div className="text-gray-900 font-medium">{comentario.autor}</div>
                    <div className="text-gray-600 text-sm">{comentario.rol}</div>
                </div>
            </div>
            <p className="text-gray-700">{comentario.texto}</p>
        </div>
    );
}

// Modal de Comentarios
function CommentsModal({ open, onClose, comentarios, onAddComment }) {
    const [nuevoComentario, setNuevoComentario] = useState("");
    if (!open) return null;
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
                    {comentarios.length === 0 && (
                        <div className="text-gray-500 text-center">No hay comentarios aún.</div>
                    )}
                    {comentarios.map((comentario, idx) => (
                        <CommentCard key={idx} comentario={comentario} />
                    ))}
                </div>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (nuevoComentario.trim()) {
                            onAddComment(nuevoComentario);
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
                    />
                    <button
                        type="submit"
                        className="self-end bg-[#2563EB] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1E3A8A] transition"
                    >
                        Comentar
                    </button>
                </form>
            </div>
        </div>
    );
}

export function PublicationsSeccion() {
    const publicaciones = [
        {
            id: 1,
            titulo: "Impacto de Nuestras Donaciones",
            descripcion: "Conoce cómo tus donaciones están cambiando vidas.",
            autor: "María López",
            fecha: "11 Enero 2025",
            etiquetas: ["Donaciones"],
            comentarios: [
                {
                    autor: "Donald Jackman",
                    iniciales: "DJ",
                    rol: "Beneficiario",
                    texto: "¡Gracias por el apoyo recibido! Realmente marcó la diferencia.",
                },
            ],
        },
        {
            id: 2,
            titulo: "Historias de Impacto",
            descripcion: "Historias inspiradoras gracias a la ayuda de donaciones.",
            autor: "María López",
            fecha: "11 Enero 2025",
            etiquetas: ["Donaciones"],
            comentarios: [],
        },
        {
            id: 3,
            titulo: "Unidos por la Esperanza",
            descripcion: "Familias unidas por la ayuda presentada.",
            autor: "María López",
            fecha: "11 Enero 2025",
            etiquetas: ["Donaciones"],
            comentarios: [],
        },
    ];

    const [modalOpen, setModalOpen] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [pubSeleccionada, setPubSeleccionada] = useState(null);

    const handleOpenModal = (pub) => {
        setPubSeleccionada(pub);
        setComentarios(pub.comentarios || []);
        setModalOpen(true);
    };

    const handleAddComment = (texto) => {
        // Aquí puedes obtener el usuario real si tienes auth
        const nuevo = {
            autor: "Usuario Actual",
            iniciales: "UA",
            rol: "Donante",
            texto,
        };
        setComentarios([...comentarios, nuevo]);
        // Aquí deberías actualizar los comentarios en la publicación real si es necesario
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
                    {publicaciones.map((pub) => (
                        <div key={pub.id} className="bg-[#F3F4F6] rounded-2xl shadow p-0 flex flex-col">
                            {/* Imagen placeholder */}
                            <div className="w-full h-56 bg-[#DBEAFE] flex items-center justify-center rounded-t-2xl">
                                <svg width="64" height="64" fill="none" viewBox="0 0 96 96">
                                    <rect width="96" height="96" rx="12" fill="#E5E7EB" />
                                    <path d="M28 68l16-20 12 16 8-10 12 14" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="36" cy="36" r="8" fill="#D1D5DB" />
                                </svg>
                            </div>
                            {/* Contenido */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="mb-2">
                                    {pub.etiquetas.map((tag, idx) => (
                                        <span key={idx} className="bg-white text-[#2563EB] px-3 py-1 rounded-full text-xs font-semibold mr-2">{tag}</span>
                                    ))}
                                </div>
                                <h3 className="text-lg font-bold text-[#111827] mb-1">{pub.titulo}</h3>
                                <p className="text-[#6B7280] text-sm mb-4">{pub.descripcion}</p>
                                <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-4">
                                    <span className="flex items-center gap-1">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#6B7280" />
                                        </svg>
                                        {pub.autor}
                                    </span>
                                    <span>•</span>
                                    <span>{pub.fecha}</span>
                                </div>
                                <button
                                    className="flex items-center gap-2 text-[#2563EB] font-semibold mt-auto hover:underline"
                                    onClick={() => handleOpenModal(pub)}
                                >
                                    <FaRegCommentDots className="text-lg" />
                                    Comentarios
                                </button>
                            </div>
                        </div>
                    ))}
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