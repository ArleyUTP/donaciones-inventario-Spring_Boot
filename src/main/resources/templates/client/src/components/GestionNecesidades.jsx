import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../AuthContext";

const MySwal = withReactContent(Swal);

function GestionNecesidades() {
  const { user } = useAuth(); // Obtener usuario autenticado
  const [necesidadId, setNecesidadId] = useState(0);
  const [nombreNecesidad, setNombreNecesidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadNecesaria, setCantidadNecesaria] = useState(0);
  const [unidadMedida, setUnidadMedida] = useState("");
  const [prioridad, setPrioridad] = useState(1);
  const [fechaLimite, setFechaLimite] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [beneficiariosObjetivo, setBeneficiariosObjetivo] = useState("");
  const [categoriaId, setCategoriaId] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [necesidades, setNecesidades] = useState([]);
  const [editar, setEditar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [necesidadesRes, categoriasRes] = await Promise.all([
          Axios.get("http://localhost:8080/needs/list"),
          Axios.get("http://localhost:8080/needs/categories"),
        ]);

        setNecesidades(necesidadesRes.data);
        setCategorias(categoriasRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
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

  const getNecesidades = useCallback(async () => {
    try {
      const response = await Axios.get("http://localhost:8080/needs/list");
      setNecesidades(response.data);
    } catch (error) {
      console.error("Error al obtener necesidades:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudieron cargar las necesidades",
        icon: "error",
      });
    }
  }, []);

  const addNecesidad = async () => {
    try {
      setLoading(true);
      await Axios.post("http://localhost:8080/needs/create", {
        nombreNecesidad,
        descripcion,
        cantidadNecesaria,
        unidadMedida,
        prioridad,
        fechaLimite,
        estado,
        beneficiariosObjetivo,
        categoriaInventario: { id: categoriaId },
        creadoPor: { id: user.id }, // Usuario que creó la necesidad
      });

      await getNecesidades();
      limpiarCampos();
      MySwal.fire({
        title: "Éxito",
        text: "Necesidad registrada correctamente",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al crear necesidad:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo registrar la necesidad",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNecesidad = async () => {
    try {
      setLoading(true);
      await Axios.put("http://localhost:8080/needs/update", {
        id: necesidadId,
        nombreNecesidad,
        descripcion,
        cantidadNecesaria,
        unidadMedida,
        prioridad,
        fechaLimite,
        estado,
        beneficiariosObjetivo,
        categoriaInventario: { id: categoriaId },
        creadoPor: { id: user.id },
      });

      await getNecesidades();
      limpiarCampos();
      MySwal.fire({
        title: "Actualizado",
        text: "Necesidad actualizada correctamente",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al actualizar necesidad:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo actualizar la necesidad",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarNecesidad = async (id) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la necesidad",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await Axios.post(`http://localhost:8080/needs/delete/${id}`);
        await getNecesidades();
        MySwal.fire({
          title: "Eliminado",
          text: "Necesidad eliminada correctamente",
          icon: "success",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error al eliminar necesidad:", error);
        MySwal.fire({
          title: "Error",
          text: "No se pudo eliminar la necesidad",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const limpiarCampos = () => {
    setNecesidadId(0);
    setNombreNecesidad("");
    setDescripcion("");
    setCantidadNecesaria(0);
    setUnidadMedida("");
    setPrioridad(1);
    setFechaLimite("");
    setEstado("Pendiente");
    setBeneficiariosObjetivo("");
    setCategoriaId(null);
    setEditar(false);
  };

  const editarNecesidad = (necesidad) => {
    setEditar(true);
    setNecesidadId(necesidad.id);
    setNombreNecesidad(necesidad.nombreNecesidad);
    setDescripcion(necesidad.descripcion);
    setCantidadNecesaria(necesidad.cantidadNecesaria);
    setUnidadMedida(necesidad.unidadMedida);
    setPrioridad(necesidad.prioridad);
    setFechaLimite(necesidad.fechaLimite);
    setEstado(necesidad.estado);
    setBeneficiariosObjetivo(necesidad.beneficiariosObjetivo);
    setCategoriaId(necesidad.categoriaInventario?.id);
  };

  return (
    <>
      {loading && <div>Cargando...</div>}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-center mb-8 text-3xl font-bold text-blue-600">
          Gestión de Necesidades Actuales
        </h1>

        {/* Formulario */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg mb-8">
              <div className="bg-blue-600 text-white rounded-t-lg px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  {editar ? "Editar Necesidad" : "Registrar Necesidad"}
                </h5>
              </div>
              <div className="px-6 py-4">
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Categoría:
                    </label>
                    <select
                      value={categoriaId || ""}
                      onChange={(e) => setCategoriaId(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Seleccionar Categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Nombre:
                    </label>
                    <input
                      value={nombreNecesidad}
                      onChange={(e) => setNombreNecesidad(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      type="text"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Descripción:
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Cantidad:
                      </label>
                      <input
                        value={cantidadNecesaria}
                        onChange={(e) =>
                          setCantidadNecesaria(Number(e.target.value))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        type="number"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Unidad:
                      </label>
                      <input
                        value={unidadMedida}
                        onChange={(e) => setUnidadMedida(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Prioridad:
                      </label>
                      <select
                        value={prioridad}
                        onChange={(e) => setPrioridad(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value={1}>Baja</option>
                        <option value={2}>Media</option>
                        <option value={3}>Alta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Fecha Límite:
                      </label>
                      <input
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        type="date"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Estado:
                    </label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Beneficiarios:
                    </label>
                    <input
                      value={beneficiariosObjetivo}
                      onChange={(e) => setBeneficiariosObjetivo(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      type="text"
                    />
                  </div>

                  <div>
                    {editar ? (
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={updateNecesidad}
                          className="w-full bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          Actualizar
                        </button>
                        <button
                          type="button"
                          onClick={limpiarCampos}
                          className="w-full bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={addNecesidad}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        Registrar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Necesidades */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1080px]">
            <div className="bg-white rounded-xl shadow-2xl border border-blue-200">
              <div className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-t-xl flex justify-between items-center px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  Lista de Necesidades
                </h5>
                <button
                  onClick={getNecesidades}
                  className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Actualizar
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Categoría</th>
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">Cantidad</th>
                      <th className="px-4 py-2">Prioridad</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {necesidades.map((necesidad) => (
                      <tr
                        key={necesidad.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">{necesidad.id}</td>
                        <td className="px-4 py-2">
                          {necesidad.categoriaInventario?.nombre}
                        </td>
                        <td className="px-4 py-2">
                          {necesidad.nombreNecesidad}
                        </td>
                        <td className="px-4 py-2">
                          {necesidad.cantidadNecesaria} {necesidad.unidadMedida}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              necesidad.prioridad === 3
                                ? "bg-red-100 text-red-800"
                                : necesidad.prioridad === 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {necesidad.prioridad === 3
                              ? "Alta"
                              : necesidad.prioridad === 2
                              ? "Media"
                              : "Baja"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              necesidad.estado === "Completada"
                                ? "bg-green-100 text-green-800"
                                : necesidad.estado === "En Proceso"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {necesidad.estado}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editarNecesidad(necesidad)}
                              className="bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarNecesidad(necesidad.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GestionNecesidades;
