import { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const MySwal = withReactContent(Swal);

function GestionDonadores() {
  const [donadorId, setDonadorId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [tipo_id, setTipo_id] = useState(null);
  const [documentoIdentidad, setDocumentoIdentidad] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editar, setEditar] = useState(false);
  const [donadoresLista, setDonadoresLista] = useState([]);
  const [tiposDonador, setTiposDonador] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paisOrigen, setPaisOrigen] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const donadoresPorPagina = 8;
  const donadoresFiltrados = donadoresLista.filter((d) => d.estadoActivo !== false);
  const totalPaginas = Math.ceil(donadoresFiltrados.length / donadoresPorPagina);

  const donadoresPaginados = donadoresFiltrados
    .sort((a, b) => a.id - b.id)
    .slice((currentPage - 1) * donadoresPorPagina, currentPage * donadoresPorPagina);

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

  // Función para limpiar campos - usando useCallback para optimización
  const limpiarCampos = useCallback(() => {
    setDonadorId(0);
    setNombre("");
    setTelefono("");
    setEmail("");
    setTipo_id(null);
    setDocumentoIdentidad("");
    setPaisOrigen("");
    setEditar(false);
  }, []);

  const addDonador = async () => {
    try {
      setLoading(true);
      await Axios.post("http://localhost:8080/donor/create", {
        nombreDonador: nombre,
        documentoIdentidad: documentoIdentidad,
        paisOrigen: paisOrigen,
        email: email,
        telefono: telefono,
        tipoDonador: { id: tipo_id }
      });

      await getDonadores();
      limpiarCampos();
      setIsCreateDialogOpen(false);
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
        id: donadorId,
        nombreDonador: nombre,
        documentoIdentidad: documentoIdentidad,
        paisOrigen: paisOrigen,
        telefono: telefono,
        email: email,
        tipoDonador: { id: tipo_id },
      };

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
      setIsEditDialogOpen(false);
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

  const editarDonador = (val) => {
    setEditar(true);
    setDonadorId(val.id);

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
    setIsEditDialogOpen(true);
  };

  // SOLUCIÓN 1: Limpiar campos al abrir diálogo de creación
  const handleOpenCreateDialog = () => {
    limpiarCampos(); // Limpiar antes de abrir
    setIsCreateDialogOpen(true);
  };

  // SOLUCIÓN 2: Limpiar campos al cerrar cualquier diálogo
  const handleCreateDialogChange = (open) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      limpiarCampos(); // Limpiar al cerrar
    }
  };

  const handleEditDialogChange = (open) => {
    setIsEditDialogOpen(open);
    if (!open) {
      limpiarCampos(); // Limpiar al cerrar
    }
  };

  const handleCreateCancel = () => {
    limpiarCampos();
    setIsCreateDialogOpen(false);
  };

  const handleEditCancel = () => {
    limpiarCampos();
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestión de Donadores</CardTitle>
            <div className="flex space-x-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenCreateDialog}>Crear Donador</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Donador</DialogTitle>
                    <DialogDescription>
                      Ingrese los datos del nuevo donador
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombre" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="nombre"
                        className="col-span-3"
                        placeholder="Ingrese el nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="documentoIdentidad" className="text-right">
                        Documento
                      </Label>
                      <Input
                        id="documentoIdentidad"
                        className="col-span-3"
                        placeholder="Ingrese el documento de identidad"
                        value={documentoIdentidad}
                        onChange={(e) => setDocumentoIdentidad(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paisOrigen" className="text-right">
                        País
                      </Label>
                      <Input
                        id="paisOrigen"
                        className="col-span-3"
                        placeholder="Ingrese el país de origen"
                        value={paisOrigen}
                        onChange={(e) => setPaisOrigen(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="col-span-3"
                        placeholder="Ingrese el email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="telefono" className="text-right">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        className="col-span-3"
                        placeholder="Ingrese el teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipo" className="text-right">
                        Tipo
                      </Label>
                      <Select
                        value={tipo_id?.toString() || ""}
                        onValueChange={(value) => setTipo_id(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDonador.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                              {tipo.nombreTipoDonador}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCreateCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={addDonador} disabled={loading}>
                      {loading ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={getDonadores} disabled={loading}>
                Actualizar Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center">Cargando donadores...</p>
            ) : donadoresLista.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No hay donadores registrados.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donadoresPaginados.map((val) => (
                      <TableRow key={val.id}>
                        <TableCell>{val.id}</TableCell>
                        <TableCell>
                          {val.tipoDonador?.id !== 1
                            ? val.nombreDonador
                            : val.usuario?.nombreCompleto}
                        </TableCell>
                        <TableCell>
                          {val.tipoDonador?.id !== 1
                            ? val.email
                            : val.usuario?.email}
                        </TableCell>
                        <TableCell>
                          {val.tipoDonador?.id !== 1
                            ? val.telefono
                            : val.usuario?.telefono}
                        </TableCell>
                        <TableCell>{val.tipoDonador?.nombreTipoDonador}</TableCell>
                        <TableCell>{val.paisOrigen || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editarDonador(val)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => eliminarDonador(val.id)}
                              disabled={loading}
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
              )}
              {/* Paginación */}
              {donadoresFiltrados.length > 0 && (
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
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                          className={currentPage === totalPaginas ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>

        {/* Dialog de Edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Donador</DialogTitle>
              <DialogDescription>
                Modifique los datos del donador
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  className="col-span-3"
                  placeholder="Ingrese el nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-documentoIdentidad" className="text-right">
                  Documento
                </Label>
                <Input
                  id="edit-documentoIdentidad"
                  className="col-span-3"
                  placeholder="Ingrese el documento de identidad"
                  value={documentoIdentidad}
                  onChange={(e) => setDocumentoIdentidad(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-paisOrigen" className="text-right">
                  País
                </Label>
                <Input
                  id="edit-paisOrigen"
                  className="col-span-3"
                  placeholder="Ingrese el país de origen"
                  value={paisOrigen}
                  onChange={(e) => setPaisOrigen(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  placeholder="Ingrese el email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-telefono"
                  className="col-span-3"
                  placeholder="Ingrese el teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tipo" className="text-right">
                  Tipo
                </Label>
                <Select
                  value={tipo_id?.toString() || ""}
                  onValueChange={(value) => setTipo_id(Number(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDonador.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nombreTipoDonador}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleEditCancel}>
                Cancelar
              </Button>
              <Button onClick={updateDonador} disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default GestionDonadores;