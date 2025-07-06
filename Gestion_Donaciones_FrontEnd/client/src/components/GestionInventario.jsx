import React, { useState, useEffect, useCallback } from "react";
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

const notificacion = withReactContent(Swal);

function GestionInventario() {
  const [inventarioId, setInventarioId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [unidadMedida, setUnidadMedida] = useState("");
  const [estado, setEstado] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [ubicacionAlmacen, setUbicacionAlmacen] = useState("");
  
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para paginación
  const [page, setPage] = useState(0); // Spring usa 0-based
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados disponibles
  const ESTADOS = ["DISPONIBLE", "RESERVADO", "ENTREGADO", "RECOGIDO"];
  const UNIDADES = ["Unidades", "KG", "Saco", "Litros", "Gramos", "Cajas"];

  useEffect(() => {
    getInventario();
  }, [page, pageSize]);

  const getInventario = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        `http://localhost:8080/inventario/page?page=${page}&size=${pageSize}`
      );
      // Filtrar elementos eliminados
      const inventarioFiltrado = response.data.content.filter((item) => item.estado !== "ELIMINADO");
      setInventario(inventarioFiltrado);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      notificacion.fire({
        title: "Error",
        text: "No se pudieron cargar el inventario",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const limpiarCampos = useCallback(() => {
    setInventarioId(0);
    setNombre("");
    setCantidad(0);
    setUnidadMedida("");
    setEstado("");
    setFechaVencimiento("");
    setUbicacionAlmacen("");
  }, []);

  const addInventario = async () => {
    try {
      setLoading(true);
      await Axios.post("http://localhost:8080/inventario/create", {
        nombre,
        cantidad,
        unidadMedida,
        estado,
        fechaVencimiento: fechaVencimiento || null,
        ubicacionAlmacen,
      });

      await getInventario();
      limpiarCampos();
      notificacion.fire({
        title: "Guardado",
        text: "El artículo fue guardado correctamente",
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error al crear artículo:", error);
      notificacion.fire({
        title: "Error",
        text: "No se pudo guardar el artículo",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInventario = async () => {
    try {
      setLoading(true);
      await Axios.put(`http://localhost:8080/inventario/update/${inventarioId}`, {
        id: inventarioId,
        nombre,
        cantidad,
        unidadMedida,
        estado,
        fechaVencimiento: fechaVencimiento || null,
        ubicacionAlmacen,
      });

      await getInventario();
      limpiarCampos();
      notificacion.fire({
        title: "Actualizado",
        text: "El artículo fue actualizado correctamente",
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error al actualizar artículo:", error);
      notificacion.fire({
        title: "Error",
        text: "No se pudo actualizar el artículo",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarInventario = async (id) => {
    const result = await notificacion.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el artículo del inventario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await Axios.delete(`http://localhost:8080/inventario/delete/${id}`);
        getInventario();
        notificacion.fire({
          title: "Eliminado",
          text: "El artículo fue eliminado correctamente.",
          icon: "success",
          timer: 2000,
        });
      } catch (error) {
        console.error("Error al eliminar artículo:", error);
        notificacion.fire({
          title: "Error",
          text: "No se pudo eliminar el artículo.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const editarInventario = (item) => {
    setInventarioId(item.id);
    setNombre(item.nombre);
    setCantidad(item.cantidad);
    setUnidadMedida(item.unidadMedida);
    setEstado(item.estado);
    setFechaVencimiento(item.fechaVencimiento ? item.fechaVencimiento.split('T')[0] : "");
    setUbicacionAlmacen(item.ubicacionAlmacen || "");
  };

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
            <CardTitle>Gestión de Inventario</CardTitle>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Agregar Artículo</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nuevo Artículo</DialogTitle>
                    <DialogDescription>
                      Ingrese los datos del artículo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombre" className="text-right">Nombre</Label>
                      <Input
                        id="nombre"
                        className="col-span-3"
                        placeholder="Ingrese el nombre del artículo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cantidad" className="text-right">Cantidad</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        className="col-span-3"
                        placeholder="Ingrese la cantidad"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unidadMedida" className="text-right">Unidad</Label>
                      <Select value={unidadMedida} onValueChange={setUnidadMedida}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIDADES.map((unidad) => (
                            <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="estado" className="text-right">Estado</Label>
                      <Select value={estado} onValueChange={setEstado}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADOS.map((e) => (
                            <SelectItem key={e} value={e}>{e}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fechaVencimiento" className="text-right">Vencimiento</Label>
                      <Input
                        id="fechaVencimiento"
                        type="date"
                        className="col-span-3"
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ubicacionAlmacen" className="text-right">Ubicación</Label>
                      <Input
                        id="ubicacionAlmacen"
                        className="col-span-3"
                        placeholder="Ubicación en almacén"
                        value={ubicacionAlmacen}
                        onChange={(e) => setUbicacionAlmacen(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogTrigger>
                    <Button onClick={addInventario} disabled={loading}>
                      {loading ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={getInventario}>
                Actualizar Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center">Cargando inventario...</p>
            ) : inventario.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No hay artículos en el inventario.
              </p>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Unidad</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventario.map((item, idx) => (
                        <TableRow key={item.id}>
                          <TableCell>{page * pageSize + idx + 1}</TableCell>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell>{item.cantidad}</TableCell>
                          <TableCell>{item.unidadMedida}</TableCell>
                          <TableCell>{item.estado}</TableCell>
                          <TableCell>
                            {item.fechaVencimiento ? 
                              new Date(item.fechaVencimiento).toLocaleDateString() : 
                              '-'
                            }
                          </TableCell>
                          <TableCell>{item.ubicacionAlmacen || '-'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editarInventario(item)}
                                  >
                                    Editar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Artículo</DialogTitle>
                                    <DialogDescription>
                                      Modifique los datos del artículo
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-nombre" className="text-right">Nombre</Label>
                                      <Input
                                        id="edit-nombre"
                                        className="col-span-3"
                                        placeholder="Ingrese el nombre del artículo"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-cantidad" className="text-right">Cantidad</Label>
                                      <Input
                                        id="edit-cantidad"
                                        type="number"
                                        className="col-span-3"
                                        placeholder="Ingrese la cantidad"
                                        value={cantidad}
                                        onChange={(e) => setCantidad(Number(e.target.value))}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-unidadMedida" className="text-right">Unidad</Label>
                                      <Select value={unidadMedida} onValueChange={setUnidadMedida}>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue placeholder="Seleccionar unidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {UNIDADES.map((unidad) => (
                                            <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-estado" className="text-right">Estado</Label>
                                      <Select value={estado} onValueChange={setEstado}>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {ESTADOS.map((e) => (
                                            <SelectItem key={e} value={e}>{e}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-fechaVencimiento" className="text-right">Vencimiento</Label>
                                      <Input
                                        id="edit-fechaVencimiento"
                                        type="date"
                                        className="col-span-3"
                                        value={fechaVencimiento}
                                        onChange={(e) => setFechaVencimiento(e.target.value)}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-ubicacionAlmacen" className="text-right">Ubicación</Label>
                                      <Input
                                        id="edit-ubicacionAlmacen"
                                        className="col-span-3"
                                        placeholder="Ubicación en almacén"
                                        value={ubicacionAlmacen}
                                        onChange={(e) => setUbicacionAlmacen(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <DialogTrigger asChild>
                                      <Button variant="outline">Cancelar</Button>
                                    </DialogTrigger>
                                    <Button onClick={updateInventario} disabled={loading}>
                                      {loading ? "Actualizando..." : "Actualizar"}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => eliminarInventario(item.id)}
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
                <div className="flex justify-center mt-4">
                  {renderPagination()}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default GestionInventario;