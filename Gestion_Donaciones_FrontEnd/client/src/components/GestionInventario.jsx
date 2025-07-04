import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
  const [inventario, setInventario] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [unidadMedida, setUnidadMedida] = useState("");
  const [estado, setEstado] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const ESTADOS = ["DISPONIBLE", "RESERVADO", "ENTREGADO", "RECOGIDO"];
  const UNIDADES = ["Unidades", "KG", "Saco", "Litros", "Gramos", "Cajas"];

  const [page, setPage] = useState(0); // Spring usa 0-based
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const getInventario = async () => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `http://localhost:8080/inventario/page?page=${page}&size=${pageSize}`
      );
      setInventario(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      notificacion.fire({
        title: "Error",
        text: "No se pudo cargar el inventario",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventario();
    // eslint-disable-next-line
  }, [page, pageSize]);

  const limpiarFormulario = () => {
    setNombre("");
    setCantidad(0);
    setUnidadMedida("");
    setEstado("");
    setEditId(null);
  };

  const handleOpenDialog = () => {
    limpiarFormulario();
    setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNombre(item.nombre);
    setCantidad(item.cantidad);
    setUnidadMedida(item.unidadMedida);
    setEstado(item.estado);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) limpiarFormulario();
  };

  const addOrUpdateInventario = async () => {
    try {
      setLoading(true);
      if (editId) {
        await Axios.put(`http://localhost:8080/inventario/update/${editId}`, {
          nombre,
          cantidad,
          unidadMedida,
          estado,
        });
        notificacion.fire({
          title: "Actualizado",
          text: "El artículo fue actualizado correctamente",
          icon: "success",
          timer: 2000,
        });
      } else {
        await Axios.post("http://localhost:8080/inventario/create", {
          nombre,
          cantidad,
          unidadMedida,
          estado,
        });
        notificacion.fire({
          title: "Guardado",
          text: "El artículo fue guardado correctamente",
          icon: "success",
          timer: 2000,
        });
      }
      setIsDialogOpen(false);
      getInventario();
      limpiarFormulario();
    } catch (error) {
      notificacion.fire({
        title: "Error",
        text: "No se pudo guardar el artículo",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteInventario = async (id) => {
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
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Inventario</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>Agregar Artículo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
                <DialogDescription>
                  {editId
                    ? "Modifique los datos del artículo de inventario"
                    : "Ingrese los datos del artículo de inventario"}
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
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    id="cantidad"
                    type="number"
                    className="col-span-3"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unidad" className="text-right">Unidad de Medida</Label>
                  <Select value={unidadMedida} onValueChange={setUnidadMedida}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIDADES.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addOrUpdateInventario} disabled={loading}>
                  {editId ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Cargando inventario...</p>
          ) : inventario.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No hay artículos registrados.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Estado</TableHead>
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
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteInventario(item.id)}
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
    </div>
  );
}

export default GestionInventario;