import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../AuthContext";
const MySwal = withReactContent(Swal);
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
function Necesidades() {
    const { user } = useAuth(); // Obtener usuario autenticado
    const [necesidades, setNecesidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedNecesidad, setSelectedNecesidad] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);

    //Estado por default del formulario de donación
    const [donationForm, setDonationForm] = useState({
        cantidad: "",
        mensaje: "",
        ubicacion: {
            lat: -12.0464, // Coordenadas por defecto
            lng: -77.0428,
            direccion: "",
        },
    });

    // Componente para manejar la selección de ubicación
    function LocationMarker({ setLocation }) {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setLocation({ lat, lng });
                // Aquí puedes hacer una llamada a la API de OpenStreetMap para obtener la dirección
                fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                )
                    .then((res) => res.json())
                    .then((data) => {
                        setDonationForm((prev) => ({
                            ...prev,
                            ubicacion: {
                                lat,
                                lng,
                                direccion: data.display_name,
                            },
                        }));
                    });
            },
        });

        return donationForm.ubicacion.lat ? (
            <Marker
                position={[donationForm.ubicacion.lat, donationForm.ubicacion.lng]}
                icon={L.icon({
                    iconUrl:
                        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                })}
            />
        ) : null;
    }
    useEffect(() => {
        const fetchNecesidades = async () => {
            try {
                setLoading(true);
                const response = await Axios.get("http://localhost:8080/needs/list");
                setNecesidades(response.data);
            } catch (error) {
                console.error("Error al cargar necesidades:", error);
                MySwal.fire({
                    title: "Error",
                    text: "No se pudieron cargar las necesidades. Intente de nuevo más tarde.",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchNecesidades();
    }, []);

    const handleSelectNecesidad = (necesidad) => {
        setSelectedNecesidad(necesidad);
        setDonationForm((prevForm) => ({
            cantidad: "",
            mensaje: "",
            ubicacion: prevForm.ubicacion, // Mantener la ubicación actual
        }));
    };

    const handleDonationFormChange = (e) => {
        const { name, value } = e.target;
        setDonationForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSearchAddress = async (query) => {
        setSearchQuery(query);

        // Limpiar el timeout anterior
        if (searchTimeout) clearTimeout(searchTimeout);

        if (query.length > 3) {
            // Crear nuevo timeout
            const timeoutId = setTimeout(async () => {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            query
                        )}&countrycodes=pe&limit=5`
                    );
                    if (!response.ok) throw new Error("Error en la búsqueda");
                    const data = await response.json();
                    console.log("Sugerencias recibidas:", data); // Para depuración
                    setSuggestions(data);
                } catch (error) {
                    console.error("Error buscando direcciones:", error);
                    setSuggestions([]);
                }
            }, 500); // Esperar 500ms antes de hacer la búsqueda

            setSearchTimeout(timeoutId);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectAddress = (suggestion) => {
        const { lat, lon: lng, display_name } = suggestion;
        setDonationForm((prev) => ({
            ...prev,
            ubicacion: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                direccion: display_name,
            },
        }));
        setSearchQuery(display_name); // Actualizar el campo de búsqueda con la dirección seleccionada
        setSuggestions([]); // Limpiar las sugerencias
    };
    const handleSubmitDonation = async (e) => {
        e.preventDefault();
        // Primero obtener el id del donador
        const donadorResponse = await Axios.get(
            `http://localhost:8080/donor/by-user/${user.id}`
        );
        if (!donadorResponse.data) {
            throw new Error('No se encontró el donador asociado al usuario');
        }
        // Validación inicial
        if (!selectedNecesidad) {
            MySwal.fire({
                title: "Advertencia",
                text: "Por favor, seleccione una necesidad para donar.",
                icon: "warning",
            });
            return;
        }

        // Validar ubicación
        if (!donationForm.ubicacion?.direccion) {
            MySwal.fire({
                title: "Advertencia",
                text: "Por favor, seleccione una ubicación para recoger la donación.",
                icon: "warning",
            });
            return;
        }

        // Preparar datos de la donación
        const donationData = {
            donador: { id: donadorResponse.data.id }, // Usar el ID del donador
            usuario: { id: user.id },
            necesidadAsociada: { id: selectedNecesidad.id },
            monto: parseFloat(donationForm.cantidad), // Convertir a número
            tipoDonacion: { id: selectedNecesidad.tipoDonacion?.id },
            fechaDonacion: new Date().toISOString(),
            estado: "Pendiente",
            detallesEspecie: donationForm.mensaje || "",
            // Asegúrate de que estos campos coincidan con el modelo Donacion.java
            ubicacionRecojo: {
                x: parseFloat(donationForm.ubicacion.lng),
                y: parseFloat(donationForm.ubicacion.lat)
            },
            direccionRecojo: donationForm.ubicacion.direccion,
            referenciaRecojo: donationForm.ubicacion.referencia || ''
        };

        // Mostrar confirmación
        const confirmResult = await MySwal.fire({
            title: "Confirmar Donación",
            html: `
            <div class="space-y-3">
                <p class="font-medium">Detalles de la donación:</p>
                <p>Necesidad: <strong>${selectedNecesidad.nombreNecesidad
                }</strong></p>
                <p>Cantidad: <strong>${donationForm.cantidad} ${selectedNecesidad.unidadMedida
                }</strong></p>
                <p>Ubicación de recojo: <strong>${donationForm.ubicacion.direccion
                }</strong></p>
                ${donationForm.mensaje
                    ? `<p>Mensaje: <em>${donationForm.mensaje}</em></p>`
                    : ""
                }
            </div>
        `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar donación",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#10B981", // Color verde
            cancelButtonColor: "#EF4444", // Color rojo
        });

        if (confirmResult.isConfirmed) {
            try {
                setLoading(true);

                // Enviar donación al backend
                // Enviar la donación
                const response = await Axios.post(
                    "http://localhost:8080/donation/create",
                    donationData
                );
                console.log('Respuesta:', response.data);
                // Mostrar mensaje de éxito
                await MySwal.fire({
                    title: "¡Donación Registrada!",
                    html: `
                    <div class="space-y-2">
                        <p>Su donación ha sido registrada exitosamente.</p>
                        <p class="text-sm text-gray-600">ID de seguimiento: ${response.data.id}</p>
                        <p class="text-sm">Recibirá notificaciones sobre el estado de su donación.</p>
                    </div>
                `,
                    icon: "success",
                    timer: 5000,
                    timerProgressBar: true,
                });

                // Limpiar formulario
                setSelectedNecesidad(null);
                setDonationForm({
                    cantidad: "",
                    mensaje: "",
                    ubicacion: {
                        lat: -12.0464,
                        lng: -77.0428,
                        direccion: "",
                    },
                });
            } catch (error) {
                console.error("Error detallado:", {
                    message: error.message,
                    response: error.response?.data,
                    data: error.response?.data?.error
                });

                MySwal.fire({
                    title: "Error al Procesar Donación",
                    html: `
            <div class="space-y-2">
                <p>No se pudo procesar su donación.</p>
                <p class="text-sm text-red-600">
                    ${error.response?.data?.error || error.message || 'Error de conexión'}
                </p>
            </div>
        `,
                    icon: "error"
                });
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-center mb-8 text-3xl font-bold text-green-600">
                Necesidades Actuales - ¡Tu Ayuda Hace la Diferencia!
            </h1>

            {loading && (
                <div className="text-center text-lg">Cargando necesidades...</div>
            )}

            {!loading && necesidades.length === 0 && (
                <div className="text-center text-lg text-gray-500">
                    No hay necesidades activas en este momento. ¡Vuelve pronto!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {necesidades.map((necesidad) => {
                    // Formatear la fecha para mostrarla de manera legible
                    let fechaFormateada = "";
                    if (necesidad.fechaLimite) {
                        const fecha = new Date(necesidad.fechaLimite);
                        fechaFormateada = fecha.toLocaleDateString("es-PE", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    }
                    return (
                        <div
                            key={necesidad.id}
                            className={`bg-white rounded-lg shadow-md p-6 border-2 ${selectedNecesidad?.id === necesidad.id
                                ? "border-green-500"
                                : "border-gray-200"
                                }
            hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
                            onClick={() => handleSelectNecesidad(necesidad)}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {necesidad.nombreNecesidad}
                            </h2>
                            <p className="text-gray-600 mb-2">{necesidad.descripcion}</p>
                            <p className="text-gray-700 text-sm mb-1">
                                Cantidad Necesaria:{" "}
                                <span className="font-medium">
                                    {necesidad.cantidadNecesaria} {necesidad.unidadMedida}
                                </span>
                            </p>
                            <p className="text-gray-700 text-sm mb-1">
                                Prioridad:{" "}
                                {necesidad.prioridad === 1
                                    ? "Baja"
                                    : necesidad.prioridad === 2
                                        ? "Media"
                                        : "Alta"}
                            </p>
                            <p className="text-gray-700 text-sm mb-1">
                                Fecha Límite:{" "}
                                <span className="font-medium">{fechaFormateada}</span>
                            </p>
                            <p className="text-gray-700 text-sm mb-1">
                                Categoría:{" "}
                                <span className="font-medium">
                                    {necesidad.categoriaInventario?.categoria || "N/A"}
                                </span>
                            </p>
                            <p className="text-gray-700 text-sm">
                                Beneficiarios:{" "}
                                <span className="font-medium">
                                    {necesidad.beneficiariosObjetivo}
                                </span>
                            </p>
                            <p className="text-gray-700 text-sm">
                                Tipo Donación:{" "}
                                <span className="font-medium">
                                    {necesidad.tipoDonacion?.tipo}
                                </span>
                            </p>
                        </div>
                    );
                })}
            </div>

            {selectedNecesidad && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Formulario de Donación</h3>
                    <form onSubmit={handleSubmitDonation}>
                        <div className="mb-4">
                            <label
                                htmlFor="cantidad"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Cantidad a donar ({selectedNecesidad.unidadMedida}):
                            </label>
                            <input
                                type="number"
                                id="cantidad"
                                name="cantidad"
                                value={donationForm.cantidad}
                                onChange={handleDonationFormChange}
                                min="1"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="mensaje"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Mensaje (opcional):
                            </label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                value={donationForm.mensaje}
                                onChange={handleDonationFormChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                        </div>
                        {selectedNecesidad && donationForm.ubicacion && (
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Ubicación para recoger la donación:
                                </label>
                                <div className="relative mb-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearchAddress(e.target.value)}
                                        placeholder="Buscar dirección..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    {suggestions.length > 0 && (
                                        <div
                                            className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
                                            style={{
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                maxHeight: "200px",
                                            }}
                                        >
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                    onClick={() => handleSelectAddress(suggestion)}
                                                >
                                                    <div className="font-medium">
                                                        {suggestion.display_name}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        {suggestion.type} -{" "}
                                                        {suggestion.address?.city ||
                                                            suggestion.address?.town}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="h-[300px] w-full mb-2">
                                    <MapContainer
                                        center={[
                                            donationForm.ubicacion.lat,
                                            donationForm.ubicacion.lng,
                                        ]}
                                        zoom={13}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker
                                            setLocation={(pos) =>
                                                setDonationForm((prev) => ({
                                                    ...prev,
                                                    ubicacion: { ...prev.ubicacion, ...pos },
                                                }))
                                            }
                                        />
                                    </MapContainer>
                                </div>
                                <input
                                    type="text"
                                    value={donationForm.ubicacion.direccion}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="La dirección seleccionada aparecerá aquí"
                                    readOnly
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Confirmar Donación
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Necesidades;
