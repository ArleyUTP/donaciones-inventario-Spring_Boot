import React from "react";
export function ImpactSeccion() {
  return (
    <section id="impact" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-[#2563EB] mb-12 text-center">
          Nuestro Impacto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-[#2563EB] flex flex-col items-center">
            <h3 className="text-3xl font-extrabold text-[#2563EB] mb-2">+5,000</h3>
            <p className="text-[#6B7280] text-lg font-medium text-center">Personas beneficiadas</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-[#F59E0B] flex flex-col items-center">
            <h3 className="text-3xl font-extrabold text-[#F59E0B] mb-2">15</h3>
            <p className="text-[#6B7280] text-lg font-medium text-center">Comunidades atendidas</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-[#10B981] flex flex-col items-center">
            <h3 className="text-3xl font-extrabold text-[#10B981] mb-2">3</h3>
            <p className="text-[#6B7280] text-lg font-medium text-center">Regiones del Perú</p>
          </div>
        </div>
      </div>
    </section>
  );
}