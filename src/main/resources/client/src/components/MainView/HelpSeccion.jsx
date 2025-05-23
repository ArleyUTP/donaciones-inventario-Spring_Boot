import React from "react";
export function HelpSeccion() {
  return (
    <section id="help" className="py-20 bg-[#DBEAFE]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-[#2563EB] mb-12 text-center">
          ¿Cómo puedes ayudar?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://img.icons8.com/color/96/000000/money-bag.png"
              alt="Donación económica"
              className="mb-4 w-20 h-20"
            />
            <h3 className="text-xl font-semibold text-[#2563EB] mb-2 text-center">Donación económica</h3>
            <p className="text-[#6B7280] text-center">Contribuciones monetarias para nuestros proyectos</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://img.icons8.com/color/96/000000/food-bank.png"
              alt="Donación en especie"
              className="mb-4 w-20 h-20"
            />
            <h3 className="text-xl font-semibold text-[#2563EB] mb-2 text-center">Donación en especie</h3>
            <p className="text-[#6B7280] text-center">Alimentos, medicinas, materiales educativos</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://img.icons8.com/color/96/000000/volunteer.png"
              alt="Voluntariado"
              className="mb-4 w-20 h-20"
            />
            <h3 className="text-xl font-semibold text-[#2563EB] mb-2 text-center">Voluntariado</h3>
            <p className="text-[#6B7280] text-center">Dona tu tiempo y habilidades</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://img.icons8.com/color/96/000000/share.png"
              alt="Difusión"
              className="mb-4 w-20 h-20"
            />
            <h3 className="text-xl font-semibold text-[#2563EB] mb-2 text-center">Difusión</h3>
            <p className="text-[#6B7280] text-center">Comparte nuestra causa en tus redes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
  