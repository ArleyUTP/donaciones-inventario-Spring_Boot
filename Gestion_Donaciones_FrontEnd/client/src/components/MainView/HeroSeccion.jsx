import React from "react";
import { Link } from 'react-router-dom';

export function HeroSeccion() {
    return (
        <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden bg-white">
                {/* Columna de texto */}
                <div className="flex-1 flex flex-col justify-center px-12 py-16 space-y-8">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
                        Transformamos vidas
                        <br />
                        <span className="text-blue-600">a través de la ayuda</span>
                    </h1>
                    <p className="text-gray-700 text-xl leading-relaxed max-w-xl">
                        Nuestra organización se dedica a proporcionar apoyo y recursos a
                        quienes más lo necesitan. Con tu ayuda, podemos hacer una diferencia
                        significativa en la vida de muchas personas.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            to="/registro"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                        >
                            Unirse ahora
                        </Link>
                        <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold text-lg">
                            Conocer más
                        </button>
                    </div>
                </div>
                {/* Columna de imagen */}
                <div className="flex-1 relative overflow-hidden">
                    <img
                        src="/images/donando.jpg"
                        alt="Personas ayudando"
                        className="object-cover w-full h-full min-h-[500px] transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                </div>
            </div>
        </section>
    );
}