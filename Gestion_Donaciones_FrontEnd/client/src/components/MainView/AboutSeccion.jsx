import React from "react";
export function AboutSeccion() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-xl border-l-8 border-[#2563EB]">
        <div className="flex-1 py-10 px-4 md:px-10">
          <h2 className="text-4xl font-bold text-[#2563EB] mb-6 text-left md:text-center">
            Nuestra Misión
          </h2>
          <p className="text-xl text-[#6B7280] leading-relaxed max-w-2xl md:mx-auto text-left md:text-center">
            Somos una organización comprometida con el desarrollo social en el Perú,
            canalizando donaciones hacia proyectos de educación, salud y desarrollo
            comunitario en las zonas más necesitadas del país.
          </p>
        </div>
      </div>
    </section>
  );
}