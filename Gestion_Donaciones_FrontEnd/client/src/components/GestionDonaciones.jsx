import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function GestionDonaciones() {
  const [donacionId, setDonacionId] = useState(0);
  const [monto, setMonto] = useState(0);
  const [estado, setEstado] = useState("");
  const [detallesEspecie, setDetallesEspecie] = useState("");
  const [tipoDonacionId, setTipoDonacionId] = useState(null);
  const [donadorId, setDonadorId] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  const [donaciones, setDonaciones] = useState([]);
  const [tiposDonacion, setTiposDonacion] = useState([]);
  const [donadores, setDonadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [editar, setEditar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [donacionesRes, tiposRes, donadoresRes, usuariosRes] =
          await Promise.all([
            Axios.get("http://localhost:8080/donation/donations"),
            Axios.get("http://localhost:8080/donation/types"),
            Axios.get("http://localhost:8080/donor/donors"),
            Axios.get("http://localhost:8080/user/users"),
          ]);

        setDonaciones(donacionesRes.data);
        setTiposDonacion(tiposRes.data);
        setDonadores(donadoresRes.data);
        setUsuarios(usuariosRes.data);
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

  const getDonaciones = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        "http://localhost:8080/donation/donations"
      );
      setDonaciones(response.data);
    } catch (error) {
      console.error("Error al obtener donaciones:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudieron cargar las donaciones",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addDonacion = async () => {
    try {
      setLoading(true);
      await Axios.post("http://localhost:8080/donation/create", {
        monto,
        estado,
        detallesEspecie,
        tipoDonacion: { id: tipoDonacionId },
        donador: { id: donadorId },
        usuario: { id: usuarioId },
      });

      await getDonaciones();
      limpiarCampos();
      MySwal.fire({
        title: "Éxito",
        text: "Donación registrada correctamente",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al crear donación:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo registrar la donación",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDonacion = async () => {
    try {
      setLoading(true);
      await Axios.put("http://localhost:8080/donation/update", {
        id: donacionId,
        monto,
        estado,
        detallesEspecie,
        tipoDonacion: { id: tipoDonacionId },
        donador: { id: donadorId },
        usuario: { id: usuarioId },
      });

      await getDonaciones();
      limpiarCampos();
      MySwal.fire({
        title: "Actualizado",
        text: "Donación actualizada correctamente",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al actualizar donación:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo actualizar la donación",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const confirmarDonacion = async (id) => {
    try {
      const result = await MySwal.fire({
        title: "¿Confirmar donación?",
        text: "Esta acción no se puede deshacer",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#10B981"
      });

      if (result.isConfirmed) {
        await Axios.post(`http://localhost:8080/donation/confirm/${id}`);
        await getDonaciones();
        MySwal.fire({
          title: "¡Confirmada!",
          text: "La donación ha sido confirmada exitosamente",
          icon: "success",
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Error al confirmar donación:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo confirmar la donación",
        icon: "error"
      });
    }
  };
  const eliminarDonacion = async (id) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la donación",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await Axios.post(`http://localhost:8080/donation/delete/${id}`);
        await getDonaciones();
        MySwal.fire({
          title: "Eliminado",
          text: "Donación eliminada correctamente",
          icon: "success",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error al eliminar donación:", error);
        MySwal.fire({
          title: "Error",
          text: "No se pudo eliminar la donación",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const limpiarCampos = () => {
    setDonacionId(0);
    setMonto(0);
    setEstado("");
    setDetallesEspecie("");
    setTipoDonacionId(null);
    setDonadorId(null);
    setUsuarioId(null);
    setEditar(false);
  };

  const editarDonacion = (donacion) => {
    setEditar(true);
    setDonacionId(donacion.id);
    setMonto(donacion.monto);
    setEstado(donacion.estado);
    setDetallesEspecie(donacion.detallesEspecie);
    setTipoDonacionId(donacion.tipoDonacion?.id);
    setDonadorId(donacion.donador?.id);
    setUsuarioId(donacion.usuario?.id);
  };

  return (
    <>
      {loading && <div>Cargando...</div>}
      {error && <div className="error">{error}</div>}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-center mb-8 text-3xl font-bold text-blue-600">
          Gestión de Donaciones
        </h1>

        {/* Formulario */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg mb-8">
              <div className="bg-blue-600 text-white rounded-t-lg px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  {editar ? "Editar Donación" : "Registrar Donación"}
                </h5>
              </div>
              <div className="px-6 py-4">
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Donador:
                    </label>
                    <select
                      value={donadorId || ""}
                      onChange={(e) => setDonadorId(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Seleccionar Donador</option>
                      {donadores.map((donador) => (
                        <option key={donador.id} value={donador.id}>
                          {donador.usuario?.id == null ? donador.nombreDonador : donador.usuario?.nombreUsuario}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Tipo de Donación:
                    </label>
                    <select
                      value={tipoDonacionId || ""}
                      onChange={(e) =>
                        setTipoDonacionId(Number(e.target.value))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Seleccionar Tipo</option>
                      {tiposDonacion.map((val) => (
                        <option key={val.id} value={val.id}>
                          {val.tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Monto:
                    </label>
                    <input
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
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
                      <option value="">Seleccionar Estado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Detalles (si es en especie):
                    </label>
                    <textarea
                      value={detallesEspecie}
                      onChange={(e) => setDetallesEspecie(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows="3"
                    />
                  </div>

                  <div>
                    {editar ? (
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={updateDonacion}
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
                        onClick={addDonacion}
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

        {/* Tabla de Donaciones */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1080px]">
            <div className="bg-white rounded-xl shadow-2xl border border-blue-200">
              <div className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-t-xl flex justify-between items-center px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  Lista de Donaciones
                </h5>
                <button
                  onClick={getDonaciones}
                  className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Actualizar
                </button>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Donador</th>
                        <th className="px-4 py-2">Tipo</th>
                        <th className="px-4 py-2">Monto/Detalles</th>
                        <th className="px-4 py-2">Estado</th>
                        <th className="px-4 py-2">Ubicación</th>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donaciones.map((donacion) => (
                        <tr key={donacion.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{donacion.id}</td>
                          <td className="px-4 py-2">
                            {donacion.donador?.usuario?.nombreUsuario || donacion.donador?.nombreDonador}
                          </td>
                          <td className="px-4 py-2">{donacion.tipoDonacion?.tipo}</td>
                          <td className="px-4 py-2">
                            {donacion.tipoDonacion?.tipo === 'Monetaria' ? (
                              `$${donacion.monto}`
                            ) : (
                              <div className="text-sm">
                                <p className="font-medium">{donacion.monto} {donacion.unidadMedida}</p>
                                <p className="text-gray-600">{donacion.detallesEspecie}</p>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${donacion.estado === "Confirmada"
                              ? "bg-green-100 text-green-800"
                              : donacion.estado === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                              }`}>
                              {donacion.estado}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {donacion.direccionRecojo && (
                              <div className="text-sm">
                                <p className="text-gray-600">{donacion.direccionRecojo}</p>
                                {donacion.referenciaRecojo && (
                                  <p className="text-xs text-gray-500">Ref: {donacion.referenciaRecojo}</p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {new Date(donacion.fechaDonacion).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              {donacion.estado === "Pendiente" && (
                                <button
                                  onClick={() => confirmarDonacion(donacion.id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                >
                                  Confirmar
                                </button>
                              )}
                              <button
                                onClick={() => editarDonacion(donacion)}
                                className="bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => eliminarDonacion(donacion.id)}
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
      </div>
    </>
  );
}

export default GestionDonaciones;
