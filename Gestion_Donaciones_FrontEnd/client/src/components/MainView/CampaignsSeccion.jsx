import React from "react";

export function CampaignsSeccion() {
    // Ejemplo de campañas, puedes reemplazarlo por props o datos dinámicos
    const campañas = [
        {
            id: 1,
            titulo: "Ayuda Humanitaria",
            descripcion: "Nuestras campañas están diseñadas para abordar las necesidades más urgentes de las comunidades. Trabajamos en diversas áreas para garantizar un impacto positivo y sostenible.",
            etiquetas: ["Emergencia Sanitaria", "Apoyo Alimenticio", "Educación Infantil"],
        },
        {
            id: 2,
            titulo: "Campaña de Invierno",
            descripcion: "Brindamos abrigo y alimentos a comunidades vulnerables durante la temporada de frío.",
            etiquetas: ["Abrigo", "Alimentos", "Comunidades Andinas"],
        },
        {
            id: 3,
            titulo: "Salud para Todos",
            descripcion: "Jornadas médicas y entrega de medicamentos en zonas rurales.",
            etiquetas: ["Salud", "Medicinas", "Voluntariado"],
        },
    ];

    return (
        <section id="campaigns" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Encabezado */}
                <div className="mb-12 text-center">
                    <span className="block text-sm font-semibold text-[#2563EB] mb-2">Campañas</span>
                    <h2 className="text-4xl font-bold text-[#111827] mb-2">Iniciativas de Ayuda</h2>
                    <p className="text-[#6B7280] text-lg">Conoce nuestras campañas activas y futuras</p>
                </div>
                {/* Campañas dinámicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {campañas.map((campaña) => (
                        <div key={campaña.id} className="bg-[#F3F4F6] rounded-2xl shadow flex flex-col">
                            {/* Imagen placeholder */}
                            <div className="w-full h-56 bg-[#DBEAFE] flex items-center justify-center rounded-t-2xl">
                                <svg width="64" height="64" fill="none" viewBox="0 0 96 96">
                                    <rect width="96" height="96" rx="12" fill="#E5E7EB"/>
                                    <path d="M28 68l16-20 12 16 8-10 12 14" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="36" cy="36" r="8" fill="#D1D5DB"/>
                                </svg>
                            </div>
                            {/* Contenido */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="mb-2">
                                    {campaña.etiquetas.map((tag, idx) => (
                                        <span key={idx} className="bg-white text-[#2563EB] px-3 py-1 rounded-full text-xs font-semibold mr-2">{tag}</span>
                                    ))}
                                </div>
                                <h3 className="text-lg font-bold text-[#111827] mb-1">{campaña.titulo}</h3>
                                <p className="text-[#6B7280] text-sm mb-4">{campaña.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                        Ver Todas
                    </button>
                </div>
            </div>
        </section>
    );
}