import React, { useEffect, useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const notificacion = withReactContent(Swal);

function GestionDistribuciones() {
  const [distribuciones, setDistribuciones] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Para DetalleDistribucion
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleDistribucion, setDetalleDistribucion] = useState([]);
  const [distribucionSeleccionada, setDistribucionSeleccionada] = useState(null);

  const getDistribuciones = async () => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `http://localhost:8080/distribucion/page?page=${page}&size=${pageSize}`
      );
      setDistribuciones(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      notificacion.fire({
        title: "Error",
        text: "No se pudo cargar las distribuciones",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDistribuciones();
    // eslint-disable-next-line
  }, [page, pageSize]);

  // Ver detalles de una distribución
  const verDetalle = async (distribucion) => {
    setDistribucionSeleccionada(distribucion);
    try {
      const res = await Axios.get(
        `http://localhost:8080/detalle-distribucion/by-distribucion/${distribucion.id}`
      );
      setDetalleDistribucion(res.data);
      setDetalleOpen(true);
    } catch (error) {
      notificacion.fire({
        title: "Error",
        text: "No se pudo cargar el detalle de la distribución",
        icon: "error",
      });
    }
  };

  // Paginación visual tipo Shadcn/UI (máx 5 links)
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
        <CardHeader>
          <CardTitle>Gestión de Distribuciones</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Cargando distribuciones...</p>
          ) : distribuciones.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No hay distribuciones registradas.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Beneficiario</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Fecha Programada</TableHead>
                    <TableHead>Fecha Entrega</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distribuciones.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell>{page * pageSize + idx + 1}</TableCell>
                      <TableCell>
                        {item.beneficiario?.nombre || "-"}
                      </TableCell>
                      <TableCell>
                        {item.usuario?.nombreCompleto || "-"}
                      </TableCell>
                      <TableCell>
                        {item.fechaProgramada
                          ? new Date(item.fechaProgramada).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {item.fechaEntrega
                          ? new Date(item.fechaEntrega).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>{item.estado}</TableCell>
                      <TableCell>
                        {item.responsable?.nombreCompleto || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => verDetalle(item)}
                        >
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center mt-4">{renderPagination()}</div>

      {/* Dialogo para DetalleDistribucion */}
      <Dialog open={detalleOpen} onOpenChange={setDetalleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Detalle de Distribución #{distribucionSeleccionada?.id}
            </DialogTitle>
            <DialogDescription>
              Recursos entregados en esta distribución.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Artículo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalleDistribucion.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No hay detalles registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  detalleDistribucion.map((detalle, idx) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {detalle.inventario?.nombre || "-"}
                      </TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{detalle.estado}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setDetalleOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GestionDistribuciones;