import { HelpSeccion } from './components/MainView/HelpSeccion';
import { ImpactSeccion } from './components/MainView/ImpactSeccion';
import { AboutSeccion } from './components/MainView/AboutSeccion';
import { Header } from './components/MainView/Header';
import { HeroSeccion } from './components/MainView/HeroSeccion';
import { CampaignsSeccion } from './components/MainView/CampaignsSeccion';
import { PublicationsSeccion } from './components/MainView/PublicationsSeccion'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function App() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 app">
      {/*Header */}
      <Header isAuthenticated={isAuthenticated} user={user} logout={logout} navigate={navigate} />
      {/* Main */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <HeroSeccion />
        {/* About Section */}
        <AboutSeccion />
        {/* Impact Section */}
        <ImpactSeccion />
        <CampaignsSeccion />
        <PublicationsSeccion />
        {/* How to Help Section */}
        <HelpSeccion />
        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
              Testimonios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-700 italic mb-4">
                  "Gracias a las donaciones recibidas, nuestra escuela en la sierra de Ayacucho pudo construir nuevas aulas"
                </p>
                <p className="font-semibold">- Prof. Juan Pérez, Ayacucho</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-700 italic mb-4">
                  "Los medicamentos donados salvaron la vida de mi hija en nuestra comunidad amazónica"
                </p>
                <p className="font-semibold">- Rosa Quispe, Loreto</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
              Contáctanos
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-1">Mensaje</label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="¿Cómo podemos ayudarte?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>
              <div className="md:w-1/2">
                <div className="h-full w-full rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.965939828659!2d-77.0280729241646!3d-12.046690940787022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5f619ee3ec7%3A0x14206cb9cc452e4a!2sLima!5e0!3m2!1ses!2spe!4v1710000000000!5m2!1ses!2spe"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 mt-12 w-full">
      </footer>
    </div>
  );
}

export default App