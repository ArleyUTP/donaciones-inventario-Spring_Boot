import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const notificacion = withReactContent(Swal);

function GestionUsuarios() {
  const [idUsuario, setIdUsuario] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rolId, setRolId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [usuariosLista, setUsuariosLista] = useState([]);
  const [loading, setLoading] = useState(false);


  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPorPagina = 8;
  const usuariosFiltrados = usuariosLista.filter((u) => u.rol !== "eliminado");
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const usuariosPaginados = usuariosFiltrados
    .sort((a, b) => a.id - b.id)
    .slice((currentPage - 1) * usuariosPorPagina, currentPage * usuariosPorPagina);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [rolesResponse, usuariosResponse] = await Promise.all([
          Axios.get("http://localhost:8080/user/roles"),
          Axios.get("http://localhost:8080/user/users"),
        ]);

        setRoles(rolesResponse.data);
        setUsuariosLista(usuariosResponse.data);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
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
  }, []);

  const getUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get("http://localhost:8080/user/users");
      setUsuariosLista(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      notificacion.fire({
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarCampos = useCallback(() => {
    setIdUsuario(0);
    setNombreUsuario("");
    setContrasena("");
    setNombreCompleto("");
    setEmail("");
    setTelefono("");
    setRolId(null);
  }, []);
  // Modificar el uso de `limpiarCampos` en las funciones de creación y actualización
  const addUsuario = async () => {
    try {
      setLoading(true);
  
      await Axios.post("http://localhost:8080/user/create", {
        nombreUsuario: nombreUsuario,
        contrasena: contrasena,
        nombreCompleto: nombreCompleto,
        email: email,
        telefono: telefono,
        rol: { id: rolId }
      });
  
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
  
      await Axios.put("http://localhost:8080/user/update", {
        id: idUsuario,
        nombreUsuario: nombreUsuario,
        contrasena: contrasena,
        nombreCompleto: nombreCompleto,
        email: email,
        telefono: telefono,
        rol: { id: rolId }
      });
  
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

        await Axios.post(`http://localhost:8080/user/delete/${idUsuario}`);
        console.log("Usuario eliminado con éxito es" + idUsuario);
        await getUsuarios();

        notificacion.fire({
          title: "Eliminado",
          text: "El usuario fue marcado como eliminado.",
          icon: "success",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
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


  const editarUsuario = (val) => {
    setNombreUsuario(val.nombreUsuario);
    setContrasena(val.contrasena);
    setNombreCompleto(val.nombreCompleto);
    setRolId(val.rol?.id);
    setEmail(val.email);
    setIdUsuario(val.id);
    setTelefono(val.telefono);
  };

  // Generar los links de paginación
  const renderPaginationLinks = () => {
    const links = [];
    // Mostrar máximo 5 páginas en la paginación
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPaginas, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(5, totalPaginas);
    }
    if (currentPage >= totalPaginas - 2) {
      start = Math.max(1, totalPaginas - 4);
    }

    for (let i = start; i <= end; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={e => {
              e.preventDefault();
              setCurrentPage(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return links;
  };
  return (
  <>
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Usuarios</CardTitle>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Crear Usuario</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Ingrese los datos del nuevo usuario
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Nombre
                    </label>
                    <input
                      id="name"
                      className="col-span-3 px-3 py-2 border rounded-md"
                      placeholder="Ingrese el nombre"
                      value={nombreUsuario}
                      onChange={(e) => setNombreUsuario(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="password" className="text-right">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="col-span-3 px-3 py-2 border rounded-md"
                      placeholder="Ingrese la contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="fullName" className="text-right">
                      Nombre Completo
                    </label>
                    <input
                      id="fullName"
                      className="col-span-3 px-3 py-2 border rounded-md"
                      placeholder="Ingrese el nombre completo"
                      value={nombreCompleto}
                      onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="col-span-3 px-3 py-2 border rounded-md"
                      placeholder="Ingrese el email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="phone" className="text-right">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      className="col-span-3 px-3 py-2 border rounded-md"
                      placeholder="Ingrese el teléfono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="role" className="text-right">
                      Rol
                    </label>
                    <select
                      id="role"
                      className="col-span-3 px-3 py-2 border rounded-md"
                      value={rolId || ""}
                      onChange={(e) => setRolId(Number(e.target.value))}
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.nombreRol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogTrigger>
                  <Button onClick={addUsuario}>Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={getUsuarios}>
              Actualizar Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Cargando usuarios...</p>
          ) : usuariosFiltrados.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No hay usuarios registrados.
            </p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosPaginados.map((val) => (
                      <TableRow key={val.id}>
                        <TableCell>{val.id}</TableCell>
                        <TableCell>{val.nombreUsuario}</TableCell>
                        <TableCell>{val.nombreCompleto}</TableCell>
                        <TableCell>{val.rol?.nombreRol}</TableCell>
                        <TableCell>{val.email}</TableCell>
                        <TableCell>{val.telefono || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editarUsuario(val)}
                                >
                                  Editar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Usuario</DialogTitle>
                                  <DialogDescription>
                                    Modifique los datos del usuario
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className="text-right">
                                      Nombre
                                    </label>
                                    <input
                                      id="name"
                                      className="col-span-3 px-3 py-2 border rounded-md"
                                      placeholder="Ingrese el nombre"
                                      value={nombreUsuario}
                                      onChange={(e) => setNombreUsuario(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="password" className="text-right">
                                      Contraseña
                                    </label>
                                    <input
                                      id="password"
                                      type="password"
                                      className="col-span-3 px-3 py-2 border rounded-md"
                                      placeholder="Ingrese la contraseña"
                                      value={contrasena}
                                      onChange={(e) => setContrasena(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="fullName" className="text-right">
                                      Nombre Completo
                                    </label>
                                    <input
                                      id="fullName"
                                      className="col-span-3 px-3 py-2 border rounded-md"
                                      placeholder="Ingrese el nombre completo"
                                      value={nombreCompleto}
                                      onChange={(e) => setNombreCompleto(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="email" className="text-right">
                                      Email
                                    </label>
                                    <input
                                      id="email"
                                      type="email"
                                      className="col-span-3 px-3 py-2 border rounded-md"
                                      placeholder="Ingrese el email"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="phone" className="text-right">
                                      Teléfono
                                    </label>
                                    <input
                                      id="phone"
                                      className="col-span-3 px-3 py-2 border rounded-md"
                                      placeholder="Ingrese el teléfono"
                                      value={telefono}
                                      onChange={(e) => setTelefono(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="role" className="text-right">
                                      Rol
                                    </label>
                                    <select
                                      id="role"
                                      className="col-span-3 px-3 py-2 border rounded-md"
                                      value={rolId || ""}
                                      onChange={(e) => setRolId(Number(e.target.value))}
                                    >
                                      <option value="">Seleccionar rol</option>
                                      {roles.map((rol) => (
                                        <option key={rol.id} value={rol.id}>
                                          {rol.nombreRol}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <DialogTrigger asChild>
                                    <Button variant="outline">Cancelar</Button>
                                  </DialogTrigger>
                                  <Button onClick={updateUsuario}>Guardar</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => eliminarUsuario(val.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Paginación */}
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {/* Mostrar primer página y ellipsis si es necesario */}
                    {(() => {
                      let start = Math.max(1, currentPage - 2);
                      let end = Math.min(totalPaginas, currentPage + 2);
                      if (currentPage <= 3) end = Math.min(5, totalPaginas);
                      if (currentPage >= totalPaginas - 2) start = Math.max(1, totalPaginas - 4);

                      const items = [];
                      if (start > 1) {
                        items.push(
                          <PaginationItem key={1}>
                            <PaginationLink
                              href="#"
                              onClick={e => {
                                e.preventDefault();
                                setCurrentPage(1);
                              }}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        );
                        if (start > 2) items.push(<PaginationEllipsis key="start-ellipsis" />);
                      }
                      for (let i = start; i <= end; i++) {
                        items.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={i === currentPage}
                              onClick={e => {
                                e.preventDefault();
                                setCurrentPage(i);
                              }}
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (end < totalPaginas) {
                        if (end < totalPaginas - 1) items.push(<PaginationEllipsis key="end-ellipsis" />);
                        items.push(
                          <PaginationItem key={totalPaginas}>
                            <PaginationLink
                              href="#"
                              onClick={e => {
                                e.preventDefault();
                                setCurrentPage(totalPaginas);
                              }}
                            >
                              {totalPaginas}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return items;
                    })()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          if (currentPage < totalPaginas) setCurrentPage(currentPage + 1);
                        }}
                        aria-disabled={currentPage === totalPaginas}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  </>
);
}
export default GestionUsuarios;
