import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [selectedDonacion, setSelectedDonacion] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Estados para paginación
  const [page, setPage] = useState(0); // Spring usa 0-based
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [tiposRes, donadoresRes, usuariosRes] =
          await Promise.all([
            Axios.get("http://localhost:8080/donation/types"),
            Axios.get("http://localhost:8080/donor/donors"),
            Axios.get("http://localhost:8080/user/users"),
          ]);

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
        `http://localhost:8080/donation/page?page=${page}&size=${pageSize}`
      );
      setDonaciones(response.data.content);
      setTotalPages(response.data.totalPages);
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
  }, [page, pageSize]);

  // Efecto para cargar donaciones cuando cambie la página
  useEffect(() => {
    getDonaciones();
  }, [getDonaciones]);

  // Función para limpiar campos
  const limpiarCampos = useCallback(() => {
    setDonacionId(0);
    setMonto(0);
    setEstado("");
    setDetallesEspecie("");
    setTipoDonacionId(null);
    setDonadorId(null);
    setUsuarioId(null);
    setEditar(false);
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
      setIsCreateDialogOpen(false);
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
      setIsEditDialogOpen(false);
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
      const donacionToConfirm = donaciones.find(d => d.id === id);
      setSelectedDonacion(donacionToConfirm);

      const result = await MySwal.fire({
        title: "¿Confirmar donación?",
        html: `
          <div class="text-left">
            <p><strong>Tipo:</strong> ${donacionToConfirm.tipoDonacion?.tipo}</p>
            <p><strong>Cantidad:</strong> ${donacionToConfirm.monto} ${donacionToConfirm.tipoDonacion?.tipo === 'Monetaria' ? 'USD' : 'unidades'}</p>
            ${donacionToConfirm.detallesEspecie ? `<p><strong>Detalles:</strong> ${donacionToConfirm.detallesEspecie}</p>` : ''}
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#10B981"
      });

      if (result.isConfirmed) {
        await Axios.post(`http://localhost:8080/donation/confirm/${id}`);

        if (donacionToConfirm.tipoDonacion?.tipo === 'En especie') {
          await Axios.post(
            `http://localhost:8080/donation/updateQuantity/${id}`,
            { monto: donacionToConfirm.monto }
          );
        }

        await getDonaciones();
        setSelectedDonacion(null);

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

  const editarDonacion = (donacion) => {
    setEditar(true);
    setDonacionId(donacion.id);
    setMonto(donacion.monto);
    setEstado(donacion.estado);
    setDetallesEspecie(donacion.detallesEspecie);
    setTipoDonacionId(donacion.tipoDonacion?.id);
    setDonadorId(donacion.donador?.id);
    setUsuarioId(donacion.usuario?.id);
    setIsEditDialogOpen(true);
  };

  // Manejo de diálogos
  const handleOpenCreateDialog = () => {
    limpiarCampos();
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogChange = (open) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      limpiarCampos();
    }
  };

  const handleEditDialogChange = (open) => {
    setIsEditDialogOpen(open);
    if (!open) {
      limpiarCampos();
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

  // Variables utilizadas en el código pero marcadas como no usadas por el linter
  // usuarios, editar, selectedDonacion se usan en funciones específicas

  // Paginación visual tipo demo Shadcn/UI (máx 5 links)
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const maxLinks = 5;
    let start = Math.max(0, page - Math.floor(maxLinks / 2));
    let end = start + maxLinks;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxLinks);
    }
    const pageLinks = [];
    for (let i = start; i < end; i++) {
      pageLinks.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={page === i}
            onClick={e => {
              e.preventDefault();
              setPage(i);
            }}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={e => {
                e.preventDefault();
                if (page > 0) setPage(page - 1);
              }}
              aria-disabled={page === 0}
              className={page === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {start > 0 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setPage(0);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {start > 1 && <PaginationEllipsis />}
            </>
          )}
          {pageLinks}
          {end < totalPages && (
            <>
              {end < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setPage(totalPages - 1);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={e => {
                e.preventDefault();
                if (page + 1 < totalPages) setPage(page + 1);
              }}
              aria-disabled={page + 1 >= totalPages}
              className={page + 1 >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestión de Donaciones</CardTitle>
            <div className="flex space-x-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenCreateDialog}>Registrar Donación</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Registrar Nueva Donación</DialogTitle>
                    <DialogDescription>
                      Ingrese los datos de la nueva donación
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="donador" className="text-right">
                        Donador
                      </Label>
                      <Select
                        value={donadorId?.toString() || ""}
                        onValueChange={(value) => setDonadorId(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar donador" />
                        </SelectTrigger>
                        <SelectContent>
                          {donadores.map((donador) => (
                            <SelectItem key={donador.id} value={donador.id.toString()}>
                              {donador.usuario?.id == null ? donador.nombreDonador : donador.usuario?.nombreUsuario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipoDonacion" className="text-right">
                        Tipo
                      </Label>
                      <Select
                        value={tipoDonacionId?.toString() || ""}
                        onValueChange={(value) => setTipoDonacionId(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDonacion.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                              {tipo.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="monto" className="text-right">
                        Monto
                      </Label>
                      <Input
                        id="monto"
                        type="number"
                        className="col-span-3"
                        placeholder="Ingrese el monto"
                        value={monto}
                        onChange={(e) => setMonto(Number(e.target.value))}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="estado" className="text-right">
                        Estado
                      </Label>
                      <Select
                        value={estado}
                        onValueChange={(value) => setEstado(value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="Confirmada">Confirmada</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="detalles" className="text-right">
                        Detalles
                      </Label>
                      <Textarea
                        id="detalles"
                        className="col-span-3"
                        placeholder="Detalles (si es en especie)"
                        value={detallesEspecie}
                        onChange={(e) => setDetallesEspecie(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCreateCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={addDonacion} disabled={loading}>
                      {loading ? "Registrando..." : "Registrar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={getDonaciones} disabled={loading}>
                Actualizar Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center">Cargando donaciones...</p>
            ) : donaciones.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No hay donaciones registradas.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Donador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Monto/Detalles</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donaciones.map((donacion, idx) => (
                      <TableRow key={donacion.id}>
                        <TableCell>{page * pageSize + idx + 1}</TableCell>
                        <TableCell>
                          {donacion.donador?.usuario?.nombreUsuario || donacion.donador?.nombreDonador}
                        </TableCell>
                        <TableCell>{donacion.tipoDonacion?.tipo}</TableCell>
                        <TableCell>
                          {donacion.tipoDonacion?.tipo === 'Monetaria' ? (
                            `$${donacion.monto}`
                          ) : (
                            <div className="text-sm">
                              <p className="font-medium">{donacion.monto} {donacion.unidadMedida}</p>
                              <p className="text-muted-foreground">{donacion.detallesEspecie}</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`
    ${donacion.estado === 'Confirmada' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
    ${donacion.estado === 'Pendiente' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}
    ${donacion.estado === 'Cancelada' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
    ${!['Confirmada', 'Pendiente', 'Cancelada'].includes(donacion.estado) ? 'bg-gray-500 text-white' : ''}
    font-medium px-2 py-1 rounded-full text-xs
  `}
                          >
                            {donacion.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {donacion.direccionRecojo && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-sm cursor-pointer">
                                    <p className="text-muted-foreground truncate">
                                      {donacion.direccionRecojo}
                                    </p>
                                    {donacion.referenciaRecojo && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        Ref: {donacion.referenciaRecojo}
                                      </p>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px]">
                                  <div className="text-sm">
                                    <p className="font-medium">Dirección:</p>
                                    <p className="text-muted-foreground">{donacion.direccionRecojo}</p>
                                    {donacion.referenciaRecojo && (
                                      <>
                                        <p className="font-medium mt-2">Referencia:</p>
                                        <p className="text-muted-foreground">{donacion.referenciaRecojo}</p>
                                      </>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(donacion.fechaDonacion).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {donacion.estado === "Pendiente" && (
                              <Button
                                size="sm"
                                onClick={() => confirmarDonacion(donacion.id)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Confirmar
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editarDonacion(donacion)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => eliminarDonacion(donacion.id)}
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
          </CardContent>
        </Card>
        <div className="flex justify-center mt-4">
          {renderPagination()}
        </div>

        {/* Dialog de Edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Donación</DialogTitle>
              <DialogDescription>
                Modifique los datos de la donación
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-donador" className="text-right">
                  Donador
                </Label>
                <Select
                  value={donadorId?.toString() || ""}
                  onValueChange={(value) => setDonadorId(Number(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar donador" />
                  </SelectTrigger>
                  <SelectContent>
                    {donadores.map((donador) => (
                      <SelectItem key={donador.id} value={donador.id.toString()}>
                        {donador.usuario?.id == null ? donador.nombreDonador : donador.usuario?.nombreUsuario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tipoDonacion" className="text-right">
                  Tipo
                </Label>
                <Select
                  value={tipoDonacionId?.toString() || ""}
                  onValueChange={(value) => setTipoDonacionId(Number(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDonacion.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-monto" className="text-right">
                  Monto
                </Label>
                <Input
                  id="edit-monto"
                  type="number"
                  className="col-span-3"
                  placeholder="Ingrese el monto"
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-estado" className="text-right">
                  Estado
                </Label>
                <Select
                  value={estado}
                  onValueChange={(value) => setEstado(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Confirmada">Confirmada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-detalles" className="text-right">
                  Detalles
                </Label>
                <Textarea
                  id="edit-detalles"
                  className="col-span-3"
                  placeholder="Detalles (si es en especie)"
                  value={detallesEspecie}
                  onChange={(e) => setDetallesEspecie(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleEditCancel}>
                Cancelar
              </Button>
              <Button onClick={updateDonacion} disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default GestionDonaciones;