import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function GestionVoluntarios() {
    const [voluntarios, setVoluntarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryUsuario, setSearchQueryUsuario] = useState("");
    // Cargar datos iniciales
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [voluntariosRes, usuariosRes] = await Promise.all([
                Axios.get("http://localhost:8080/volunteer/volunteers"),
                Axios.get("http://localhost:8080/user/users"),
            ]);
            setVoluntarios(voluntariosRes.data);
            setUsuarios(usuariosRes.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            MySwal.fire({
                title: "Error",
                text: "No se pudieron cargar los datos",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVoluntario = async () => {
    const usuariosFiltrados = usuarios.filter(
        (u) => !voluntarios.some((v) => v.usuario?.id === u.id)
    );

    const { value: formValues } = await MySwal.fire({
        title: "Crear Nuevo Voluntario",
        html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Buscar Usuario</label>
            <input 
              type="text" 
              id="searchUsuario" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
              placeholder="Buscar por nombre o usuario..."
              oninput="
                const search = this.value.toLowerCase();
                const select = document.getElementById('usuario');
                Array.from(select.options).forEach(option => {
                  const text = option.text.toLowerCase();
                  option.style.display = text.includes(search) ? '' : 'none';
                });
              "
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Usuario</label>
            <select id="usuario" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" size="5" style="max-height: 200px; overflow-y: auto;">
              ${usuariosFiltrados
                .map(
                    (u) => `
                <option value="${u.id}">${u.nombreUsuario} - ${u.nombreCompleto}</option>
              `
                )
                .join("")}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Especialidad</label>
            <input id="especialidad" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" type="text">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Disponibilidad</label>
            <select id="disponibilidad" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="true">Disponible</option>
              <option value="false">No Disponible</option>
            </select>
          </div>
        </div>
      `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
        didOpen: () => {
            // Enfocar el campo de búsqueda cuando se abre el modal
            document.getElementById('searchUsuario').focus();
        },
        preConfirm: () => {
            const usuarioId = document.getElementById("usuario").value;
            const especialidad = document.getElementById("especialidad").value;
            const disponibilidad =
                document.getElementById("disponibilidad").value === "true";

            if (!usuarioId) {
                Swal.showValidationMessage("Por favor seleccione un usuario");
                return false;
            }

            return {
                usuario: { id: usuarioId },
                especialidad,
                disponibilidad,
                estadoActivo: true,
            };
        },
    });

        if (formValues) {
            try {
                await Axios.post("http://localhost:8080/volunteer/create", formValues);
                await fetchInitialData();
                MySwal.fire({
                    title: "¡Éxito!",
                    text: "Voluntario creado correctamente",
                    icon: "success",
                });
            } catch (error) {
                console.error("Error al crear voluntario:", error);
                MySwal.fire({
                    title: "Error",
                    text: "No se pudo crear el voluntario",
                    icon: "error",
                });
            }
        }
    };

    const eliminarVoluntario = async (id) => {
        const result = await MySwal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await Axios.post(`http://localhost:8080/volunteer/delete/${id}`);
                await fetchInitialData();
                MySwal.fire({
                    title: "Eliminado",
                    text: "El voluntario ha sido eliminado",
                    icon: "success",
                });
            } catch (error) {
                console.error("Error al eliminar:", error);
                MySwal.fire({
                    title: "Error",
                    text: "No se pudo eliminar el voluntario",
                    icon: "error",
                });
            }
        }
    };

    const filteredVoluntarios = voluntarios.filter(
        (voluntario) =>
            voluntario.usuario?.nombreUsuario
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            voluntario.usuario?.nombreCompleto
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );
    
    return (
        <>
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-center mb-8 text-3xl font-bold text-blue-600">
                Gestión de Voluntarios
            </h1>

            <div className="bg-white rounded-xl shadow-2xl border border-blue-200 mb-8">
                <div className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-t-xl flex justify-between items-center px-6 py-4">
                    <div className="flex items-center space-x-4 flex-1">
                        <h5 className="text-lg font-semibold">Lista de Voluntarios</h5>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="px-3 py-1 rounded text-gray-800 flex-1 max-w-xs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleCreateVoluntario}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Nuevo Voluntario
                    </button>
                </div>

                <div className="px-6 py-4 overflow-x-auto">
                    <table className="min-w-full border border-blue-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="px-4 py-2 text-blue-800">ID</th>
                                <th className="px-4 py-2 text-blue-800">Usuario</th>
                                <th className="px-4 py-2 text-blue-800">Especialidad</th>
                                <th className="px-4 py-2 text-blue-800">Disponibilidad</th>
                                <th className="px-4 py-2 text-blue-800">Estado</th>
                                <th className="px-4 py-2 text-blue-800">Fecha Registro</th>
                                <th className="px-4 py-2 text-blue-800">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVoluntarios.map((voluntario) => (
                                <tr key={voluntario.id} className="hover:bg-blue-50">
                                    <td className="px-4 py-2 border-b">{voluntario.id}</td>
                                    <td className="px-4 py-2 border-b">
                                        {voluntario.usuario?.nombreUsuario} -{" "}
                                        {voluntario.usuario?.nombreCompleto}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {voluntario.especialidad}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${voluntario.disponiblidad
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {voluntario.disponiblidad
                                                ? "Disponible"
                                                : "No Disponible"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${voluntario.estadoActivo
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {voluntario.estadoActivo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {new Date(voluntario.fechaRegistro).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => eliminarVoluntario(voluntario.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    );
}

export default GestionVoluntarios;
