import { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function GestionDonadores() {
  const [donadorId, setDonadorId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [tipo_id, setTipo_id] = useState(null);
  const [documentoIdentidad,setDocumentoIdentidad] = useState("");
  const [email,setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editar, setEditar] = useState(false);
  const [donadoresLista, setDonadoresLista] = useState([]);
  const [tiposDonador, setTiposDonador] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paisOrigen,setPaisOrigen] = useState("");
  // Fetch inicial de datos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [tiposResponse, donadoresResponse] = await Promise.all([
          Axios.get("http://localhost:8080/donor/donor-types"),
          Axios.get("http://localhost:8080/donor/donors"),
        ]);

        setTiposDonador(tiposResponse.data);
        setDonadoresLista(donadoresResponse.data);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setError("Error al cargar datos iniciales");
        MySwal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos iniciales",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const getDonadores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get("http://localhost:8080/donor/donors");
      setDonadoresLista(response.data);
    } catch (error) {
      console.error("Error al obtener donadores:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudieron cargar los donadores",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addDonador = async () => {
    try {
      setLoading(true);
      await Axios.post("http://localhost:8080/donor/create", {
        nombreDonador: nombre,
        documentoIdentidad:documentoIdentidad,
        paisOrigen: paisOrigen,
        email: email,
        telefono: telefono,
        tipoDonador: { id: tipo_id }
      });

      await getDonadores();
      limpiarCampos();
      MySwal.fire({
        title: "Guardado",
        text: "El donador fue guardado correctamente",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al crear donador:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo crear el donador",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDonador = async () => {
    try {
      setLoading(true);
      
      const donadorData = {
        id: donadorId, // Asegúrate de enviar el ID
        nombreDonador: nombre,
        documentoIdentidad: documentoIdentidad,
        paisOrigen: paisOrigen,
        telefono: telefono,
        email: email,
        tipoDonador: { id: tipo_id },
      };

      // Si es tipo persona (ID 1), incluir datos de usuario
      if (tipo_id === 1) {
        donadorData.usuario = {
          nombreCompleto: nombre,
          email: email,
          telefono: telefono
        };
      }

      await Axios.put(`http://localhost:8080/donor/update`, donadorData);
      await getDonadores();
      limpiarCampos();
      MySwal.fire({
        title: "Actualizado",
        text: "El donador fue actualizado correctamente",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al actualizar donador:", error);
      MySwal.fire({
        title: "Error",
        text: error.response?.data?.error || "No se pudo actualizar el donador",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarDonador = async (id) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al donador",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await Axios.post(`http://localhost:8080/donor/delete/${id}`);
        await getDonadores();
        MySwal.fire({
          title: "Eliminado",
          text: "El donador fue eliminado correctamente",
          icon: "success",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error al eliminar donador:", error);
        MySwal.fire({
          title: "Error",
          text: "No se pudo eliminar el donador",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  const limpiarCampos = () => {
    setNombre("");
    setTelefono("");
    setEmail("");
    setTipo_id(0);
    setDonadorId(0);
    setDocumentoIdentidad("");
    setPaisOrigen("");
    setEditar(false);
  };

  const editarDonador = (val) => {
    setEditar(true);
    setDonadorId(val.id);
    
    // Si es tipo persona (ID 1), usar datos del usuario
    if (val.tipoDonador?.id === 1 && val.usuario) {
      setNombre(val.usuario.nombreCompleto);
      setEmail(val.usuario.email);
      setTelefono(val.usuario.telefono);
    } else {
      setNombre(val.nombreDonador);
      setEmail(val.email);
      setTelefono(val.telefono);
    }
    
    setDocumentoIdentidad(val.documentoIdentidad);
    setTipo_id(val.tipoDonador?.id);
    setPaisOrigen(val.paisOrigen);
};
  return (
    <>
      {loading && <div>Cargando...</div>}
      {error && <div className="error">{error}</div>}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-center mb-8 text-3xl font-bold text-blue-600">
          Gestión de Donadores
        </h1>
        {/* Formulario */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg mb-8">
              <div className="bg-blue-600 text-white rounded-t-lg px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  Registrar Donador
                </h5>
              </div>
              <div className="px-6 py-4">
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Nombre:
                    </label>
                    <input
                      value={nombre}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Documento de Identidad:
                    </label>
                    <input
                      value={documentoIdentidad}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setDocumentoIdentidad(e.target.value)}
                    />
                  </div>
                                    <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Pais Origen:
                    </label>
                    <input
                      value={paisOrigen}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setPaisOrigen(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Teléfono:
                    </label>
                    <input
                      value={telefono}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                                    <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Email:
                    </label>
                    <input
                      value={email}
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Tipo:
                    </label>
                    <select
                      value={tipo_id || ""}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => {
                        const selectedTipoDonadorId = Number(e.target.value);
                        setTipo_id(selectedTipoDonadorId);
                      }}
                    >
                      <option value="">Selecionar Tipo Donador</option>
                      {tiposDonador.map((tipoDonador) => (
                        <option key={tipoDonador.id} value={tipoDonador.id}>
                          {tipoDonador.nombreTipoDonador}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {editar ? (
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          className="w-full bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition"
                          onClick={updateDonador}
                        >
                          Actualizar
                        </button>
                        <button
                          type="button"
                          className="w-full bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
                          onClick={limpiarCampos}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                        onClick={addDonador}
                      >
                        Guardar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Donadores */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1080px]">
            <div className="bg-white rounded-xl shadow-2xl border border-blue-200">
              <div className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-t-xl flex justify-between items-center px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  Lista de Donadores
                </h5>
                <button
                  className="bg-white text-blue-700 border border-blue-300 rounded px-3 py-1 text-sm hover:bg-blue-100 transition"
                  onClick={getDonadores}
                >
                  Actualizar
                </button>
              </div>
              <div className="px-6 py-4">
                {donadoresLista.length === 0 ? (
                  <div className="text-center text-gray-400">
                    No hay donadores registrados.
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full border border-blue-200 rounded-lg overflow-hidden shadow text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap">
                            #
                          </th>
                          <th className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap">
                            Nombre
                          </th>
                          <th className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap">
                            Email
                          </th>
                          <th className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap">
                            Teléfono
                          </th>
                          <th className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap">
                            Tipo
                          </th>
                          <th className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap">
                            Fecha Registro
                          </th>
                          <th className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {donadoresLista.map((val) => (
                          <tr
                            key={val.id}
                            className={
                              val.id % 2 === 0
                                ? "bg-white hover:bg-blue-50"
                                : "bg-blue-50 hover:bg-blue-100"
                            }
                          >
                            <td className="px-2 py-2 border-b border-blue-100">
                              {val.id}
                            </td>
                            <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[120px]">
                              {val.tipoDonador?.id != 1? val.nombreDonador: val.usuario?.nombreCompleto}
                            </td>
                            <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[140px]">
                              {val.tipoDonador?.id != 1? val.email:val.usuario?.email}
                            </td>
                            <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[100px]">
                              {val.tipoDonador?.id != 1? val.telefono:val.usuario?.telefono}
                            </td>
                            <td className="px-2 py-2 border-b border-blue-100">
                              {val.tipoDonador?.nombreTipoDonador}
                            </td>
                            <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[120px]">
                              {val.fechaRegistro}
                            </td>
                            <td className="px-2 py-2 border-b border-blue-100 flex flex-col gap-1 sm:flex-row">
                              <button
                                className="bg-orange-400 rounded-xl px-2 py-1 hover:bg-orange-600 hover:text-white transition text-xs sm:text-sm"
                                onClick={() => editarDonador(val)}
                              >
                                Editar
                              </button>
                              <button
                                className="bg-red-600 rounded-xl px-2 py-1 hover:bg-red-800 hover:text-white transition text-xs sm:text-sm"
                                onClick={() => eliminarDonador(val.id)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GestionDonadores;
