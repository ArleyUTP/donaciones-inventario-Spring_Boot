import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const notificacion = withReactContent(Swal);

function GestionUsuarios() {
  const [idUsuario, setIdUsuario] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [esDonador, setEsDonador] = useState(false);
  const [rolId, setRolId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [editar, setEditar] = useState(false);
  const [usuariosLista, setUsuariosLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Hacer ambas peticiones en paralelo
        const [rolesResponse, usuariosResponse] = await Promise.all([
          Axios.get("http://localhost:8080/user/roles"),
          Axios.get("http://localhost:8080/user/users"),
        ]);

        setRoles(rolesResponse.data);
        setUsuariosLista(usuariosResponse.data);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setError("Error al cargar datos iniciales");
        notificacion.fire({
          title: "Error",
          text: "No se pudieron cargar los datos iniciales",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para obtener usuarios - usando useCallback para evitar re-renderizados
  const getUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios.get("http://localhost:8080/user/users");
      setUsuariosLista(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error al cargar usuarios");
      notificacion.fire({
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);
  const addUsuario = async () => {
    try {
      setLoading(true);
      setError(null);

      await Axios.post("http://localhost:8080/user/create", {
        nombreUsuario: nombreUsuario,
        contrasena: contrasena,
        nombreCompleto: nombreCompleto,
        rol: { id: rolId },
        email: email,
        telefono: telefono
      });

      // Recargar usuarios después de crear
      await getUsuarios();
      limpiarCampos();

      notificacion.fire({
        title: "Guardado",
        text: "El usuario fue guardado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setError("Error al crear usuario");
      notificacion.fire({
        title: "Error",
        text: "No se pudo crear el usuario",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async () => {
    try {
      setLoading(true);
      setError(null);

      await Axios.put("http://localhost:8080/user/update", {
        id: idUsuario,
        nombreUsuario: nombreUsuario,
        contrasena: contrasena,
        nombreCompleto: nombreCompleto,
        rol: { id: rolId },
        email: email,
        telefono: telefono,
        es_donador: esDonador,
      });

      // Recargar usuarios después de actualizar
      await getUsuarios();
      limpiarCampos();

      notificacion.fire({
        title: "Actualizado",
        text: "El usuario fue actualizado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("Error al actualizar usuario");
      notificacion.fire({
        title: "Error",
        text: "No se pudo actualizar el usuario",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (idUsuario) => {
    // Validar que el ID sea válido
    if (!idUsuario) {
      notificacion.fire({
        title: "Error",
        text: "ID de usuario no válido",
        icon: "error"
      });
      return;
    }

    const result = await notificacion.fire({
      title: "¿Estás seguro?",
      text: "Esta acción marcará el usuario como eliminado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        setError(null);

        await Axios.post(`http://localhost:8080/user/delete/${idUsuario}`);
        console.log("Usuario eliminado con éxito es"+idUsuario);
        await getUsuarios();

        notificacion.fire({
          title: "Eliminado",
          text: "El usuario fue marcado como eliminado.",
          icon: "success",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setError("Error al eliminar usuario");
        notificacion.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  // Función para limpiar campos
  const limpiarCampos = useCallback(() => {
    setIdUsuario(0);
    setNombreUsuario("");
    setContrasena("");
    setNombreCompleto("");
    setEmail("");
    setTelefono("");
    setEsDonador(false);
    setRolId(null);
    setEditar(false);
    setError(null);
  }, []);
  const editarUsuario = (val) => {
    setEditar(true);
    setNombreUsuario(val.nombreUsuario);
    setContrasena(val.contrasena);
    setNombreCompleto(val.nombreCompleto);
    setRolId(val.rol?.id);
    setEmail(val.email);
    setIdUsuario(val.id);
  };
  return (
    <>
      {loading && <div>Cargando...</div>}
      {error && <div className="error">{error}</div>}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-center mb-8 text-3xl font-bold text-blue-600">
          Gestor de Usuarios
        </h1>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg mb-8">
              <div className="bg-blue-600 text-white rounded-t-lg px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  Registrar Usuario
                </h5>
              </div>
              <div className="px-6 py-4">
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Nombre de usuario:
                    </label>
                    <input
                      value={nombreUsuario}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(event) => setNombreUsuario(event.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Contraseña:
                    </label>
                    <input
                      value={contrasena}
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(event) => setContrasena(event.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Nombre completo:
                    </label>
                    <input
                      value={nombreCompleto}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(event) =>
                        setNombreCompleto(event.target.value)
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Rol:
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(event) => {
                        const selectedRolId = Number(event.target.value);
                        setRolId(selectedRolId);
                        // Verificar si el rol seleccionado es 'usuario'
                        const rolSeleccionado = roles.find(
                          (r) => r.id === selectedRolId
                        );
                        if (
                          rolSeleccionado &&
                          rolSeleccionado.nombre.trim().toLowerCase() ===
                          "usuario"
                        ) {
                          setEsDonador(true);
                        } else {
                          setEsDonador(false);
                          setTelefono(""); // Limpiar teléfono si no es usuario
                        }
                      }}
                      value={rolId || ""}
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.nombreRol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Email:
                    </label>
                    <input
                      value={email}
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  {roles.find((r) => r.id === rolId)?.nombre === "usuario" && (
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={esDonador}
                        onChange={(e) => setEsDonador(e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-gray-700">Usuario Donador</label>
                    </div>
                  )}

                  {esDonador &&
                    roles.find((r) => r.id === rolId)?.nombre === "usuario" && (
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">
                          Teléfono:
                        </label>
                        <input
                          type="text"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                    )}
                  <div>
                    {editar ? (
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          className="w-full bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition"
                          onClick={updateUsuario}
                        >
                          Actualizar
                        </button>
                        <button
                          type="button"
                          className="w-full bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
                          onClick={limpiarCampos}
                        >
                          Carcelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                        onClick={addUsuario}
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
        <div className="flex justify-center ">
          <div className="w-full max-w-[1080px]  ">
            <div className="bg-white rounded-xl shadow-2xl border border-blue-200">
              <div className="bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-t-xl flex justify-between items-center px-6 py-4">
                <h5 className="mb-0 text-lg font-semibold">
                  Lista de Usuarios
                </h5>
                <button
                  className="bg-white text-blue-700 border border-blue-300 rounded px-3 py-1 text-sm hover:bg-blue-100 transition"
                  onClick={getUsuarios}
                >
                  Actualizar
                </button>
              </div>
              <div className="px-6 py-4">
                {usuariosLista.filter((u) => u.rol !== "eliminado").length ===
                  0 ? (
                  <div className="text-center text-gray-400">
                    No hay usuarios registrados.
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full border border-blue-200 rounded-lg overflow-hidden shadow text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-blue-100">
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            #
                          </th>
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            Nombre de Usuario
                          </th>
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            Contraseña
                          </th>
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            Nombre Completo
                          </th>
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            Rol
                          </th>
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            Email
                          </th>
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            Ultimo Acceso
                          </th>
                          <th
                            className="px-2 py-2 border-b border-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                            scope="col"
                          >
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuariosLista
                          .filter((val) => val.rol !== "eliminado")
                          .map((val) => {
                            return (
                              <tr
                                key={val.id} // Cambiado de val.id a val.usuario_id para consistencia
                                className={
                                  val.id % 2 === 0 // Cambiado de val.id a val.usuario_id
                                    ? "bg-white hover:bg-blue-50"
                                    : "bg-blue-50 hover:bg-blue-100"
                                }
                              >
                                <td className="px-2 py-2 border-b border-blue-100 text-center">
                                  {val.id} {/* Cambiado de val.id a val.usuario_id */}
                                </td>
                                <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[120px] text-center">
                                  {val.nombreUsuario}
                                </td>
                                <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[100px] text-center">
                                  {val.contrasena}
                                </td>
                                <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[120px] text-center">
                                  {val.nombreCompleto}
                                </td>
                                <td className="px-2 py-2 border-b border-blue-100 text-center">
                                  {val.rol?.nombreRol}
                                </td>
                                <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[140px] text-center">
                                  {val.email}
                                </td>
                                <td className="px-2 py-2 border-b border-blue-100 truncate max-w-[120px] text-center">
                                  {val.ultimoAcceso}
                                </td>
                                <td className="px-2 py-2 border-b border-blue-100 flex flex-col gap-1 sm:flex-row text-center">
                                  <button
                                    className="bg-orange-400 rounded-xl px-2 py-1 hover:bg-orange-600 hover:text-white transition text-xs sm:text-sm"
                                    onClick={() => {
                                      editarUsuario(val);
                                    }}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="bg-red-600 rounded-xl px-2 py-1 hover:bg-red-800 hover:text-white transition text-xs sm:text-sm"
                                    onClick={() =>
                                      eliminarUsuario(val.id)
                                    }
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
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

export default GestionUsuarios;
