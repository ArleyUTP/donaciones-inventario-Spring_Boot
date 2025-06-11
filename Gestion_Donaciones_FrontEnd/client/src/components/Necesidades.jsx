import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../AuthContext";
const MySwal = withReactContent(Swal);

function Necesidades() {
    const { user } = useAuth(); // Obtener usuario autenticado
    const [necesidades, setNecesidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedNecesidad, setSelectedNecesidad] = useState(null);

    const [donationForm, setDonationForm] = useState({
        cantidad: "",
        mensaje: "",
    });

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
        setDonationForm({ cantidad: "", mensaje: "" }); 
    };

    const handleDonationFormChange = (e) => {
        const { name, value } = e.target;
        setDonationForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmitDonation = async (e) => {
        e.preventDefault();
        if (!selectedNecesidad) {
            MySwal.fire({
                title: "Advertencia",
                text: "Por favor, seleccione una necesidad para donar.",
                icon: "warning",
            });
            return;
        }

        // Aquí se enviaría la donación al backend
        // Por ahora, solo mostramos un mensaje de confirmación
        MySwal.fire({
            title: "Confirmar Donación",
            html: `
        <p>¿Desea confirmar su donación para la necesidad: <strong>${selectedNecesidad.nombreNecesidad
                }</strong>?</p>
        <p>Cantidad a donar: <strong>${donationForm.cantidad} ${selectedNecesidad.unidadMedida
                }</strong></p>
        <p>Mensaje: <em>${donationForm.mensaje || "Ninguno"}</em></n>
      `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    // Simulación de envío de datos al backend
                    // En un caso real, aquí harías un Axios.post a un endpoint de donaciones
                    Axios.post(
                        `http://localhost:8080/donation/confirm/${donationForm.cantidad}`
                    );
                    Axios.post("http://localhost:8080/donation/create",{
                        donador: {id: user.id},
                        usuario: {id: user.id},
                        monto: donationForm.cantidad,
                        tipoDonacion:{id : selectedNecesidad.tipoDonacion?.id},
                        fechaDonacion: new Date().toISOString(),
                        estado: "Pendiente",
                        detallesEspecie: donationForm.mensaje,
                        fechaCreacion: new Date().toISOString(),
                        categoriaInventario: {id: selectedNecesidad.categoriaInventario?.id}
                    });
                    console.log("Donación enviada:", {
                        necesidadId: selectedNecesidad.id,
                        cantidadDonada: donationForm.cantidad,
                        mensajeDonacion: donationForm.mensaje,
                        // Aquí podrías añadir el ID del donador si tuvieras autenticación
                    });

                    // Simular una llamada exitosa al backend
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    MySwal.fire({
                        title: "¡Gracias!",
                        text: "Su donación ha sido registrada con éxito. Recibirá notificaciones de seguimiento.",
                        icon: "success",
                        timer: 5000,
                    });
                    setSelectedNecesidad(null); // Clear selected need after donation
                    setDonationForm({ cantidad: "", mensaje: "" }); // Clear form
                } catch (error) {
                    console.error("Error al procesar donación:", error);
                    MySwal.fire({
                        title: "Error",
                        text: "No se pudo procesar su donación. Intente de nuevo.",
                        icon: "error",
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
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
                {necesidades.map((necesidad) => (
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
                            <span className="font-medium">{necesidad.fechaLimite}</span>
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
                            Tipo Donación: <span className="font-medium">{necesidad.tipoDonacion?.tipo}</span>
                        </p>
                    </div>
                ))}
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
