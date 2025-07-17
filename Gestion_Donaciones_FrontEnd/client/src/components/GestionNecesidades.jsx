import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../AuthContext";
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

const MySwal = withReactContent(Swal);

function GestionNecesidades() {
  const { user } = useAuth();
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
  const [tipoDonacion, settipoDonacion] = useState(null);
  const [tipoDonaciones, setTipoDonaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [necesidades, setNecesidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const necesidadesPorPagina = 8;
  const necesidadesFiltradas = necesidades.filter((n) => n.estado !== "Eliminada");
  const totalPaginas = Math.ceil(necesidadesFiltradas.length / necesidadesPorPagina);

  const necesidadesPaginadas = necesidadesFiltradas
    .sort((a, b) => a.id - b.id)
    .slice((currentPage - 1) * necesidadesPorPagina, currentPage * necesidadesPorPagina);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [necesidadesRes, categoriasRes, tipoDonacionRes] = await Promise.all([
          Axios.get("http://localhost:8080/needs/list"),
          Axios.get("http://localhost:8080/needs/categories"),
          Axios.get("http://localhost:8080/needs/donation-types")
        ]);

        setNecesidades(necesidadesRes.data);
        setCategorias(categoriasRes.data);
        setTipoDonaciones(tipoDonacionRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("No se pudieron cargar los datos iniciales");
        MySwal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos iniciales: " + error,
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
        creadoPor: { id: user.id },
        tipoDonacion: { id: tipoDonacion.id }
      });

      await getNecesidades();
      limpiarCampos();
      setIsCreateDialogOpen(false);
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
        tipoDonacion: { id: tipoDonacion.id }
      });

      await getNecesidades();
      limpiarCampos();
      setIsEditDialogOpen(false);
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
  };

  const editarNecesidad = (necesidad) => {
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
    settipoDonacion(necesidad.tipoDonacion)
    setIsEditDialogOpen(true);
  };

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

  const getPrioridadBadgeVariant = (prioridad) => {
    switch (prioridad) {
      case 3:
        return "destructive"; // Rojo para alta
      case 2:
        return "secondary"; // Amarillo para media
      case 1:
        return "default"; // Verde para baja
      default:
        return "outline";
    }
  };

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case "Completada":
        return "default"; // Verde
      case "En Proceso":
        return "secondary"; // Amarillo
      case "Pendiente":
        return "destructive"; // Rojo
      default:
        return "outline";
    }
  };

  const getPrioridadText = (prioridad) => {
    switch (prioridad) {
      case 3: return "Alta";
      case 2: return "Media";
      case 1: return "Baja";
      default: return "Desconocida";
    }
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestión de Necesidades Actuales</CardTitle>
            <div className="flex space-x-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenCreateDialog}>Registrar Necesidad</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Registrar Nueva Necesidad</DialogTitle>
                    <DialogDescription>
                      Ingrese los datos de la nueva necesidad
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categoria" className="text-right">
                        Categoría
                      </Label>
                      <Select
                        value={categoriaId?.toString() || ""}
                        onValueChange={(value) => setCategoriaId(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                              {categoria.categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombre" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="nombre"
                        value={nombreNecesidad}
                        onChange={(e) => setNombreNecesidad(e.target.value)}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="descripcion" className="text-right">
                        Descripción
                      </Label>
                      <Textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cantidad" className="text-right">
                        Cantidad
                      </Label>
                      <Input
                        id="cantidad"
                        type="number"
                        min="0"
                        value={cantidadNecesaria}
                        onChange={(e) => setCantidadNecesaria(Number(e.target.value))}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unidad" className="text-right">
                        Unidad
                      </Label>
                      <Select
                        value={unidadMedida}
                        onValueChange={(value) => setUnidadMedida(value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Litros">Litros</SelectItem>
                          <SelectItem value="Kilogramos">Kilogramos</SelectItem>
                          <SelectItem value="Gramos">Gramos</SelectItem>
                          <SelectItem value="Mililitros">Mililitros</SelectItem>
                          <SelectItem value="Unidades">Unidades</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prioridad" className="text-right">
                        Prioridad
                      </Label>
                      <Select
                        value={prioridad.toString()}
                        onValueChange={(value) => setPrioridad(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Baja</SelectItem>
                          <SelectItem value="2">Media</SelectItem>
                          <SelectItem value="3">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipoDonacion" className="text-right">
                        Tipo de donación
                      </Label>
                      <Select
                        value={tipoDonacion?.id.toString() || ""}
                        onValueChange={(value) => settipoDonacion(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar tipo de donación" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipoDonaciones.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                              {tipo.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fechaLimite" className="text-right">
                        Fecha Límite
                      </Label>
                      <Input
                        id="fechaLimite"
                        type="date"
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                        className="col-span-3"
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
                          <SelectItem value="En Proceso">En Proceso</SelectItem>
                          <SelectItem value="Completada">Completada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="beneficiarios" className="text-right">
                        Beneficiarios
                      </Label>
                      <Input
                        id="beneficiarios"
                        value={beneficiariosObjetivo}
                        onChange={(e) => setBeneficiariosObjetivo(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCreateCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={addNecesidad} disabled={loading}>
                      {loading ? "Registrando..." : "Registrar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Editar Necesidad</DialogTitle>
                    <DialogDescription>
                      Modifique los datos de la necesidad
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categoria-edit" className="text-right">
                        Categoría
                      </Label>
                      <Select
                        value={categoriaId?.toString() || ""}
                        onValueChange={(value) => setCategoriaId(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                              {categoria.categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombre-edit" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="nombre-edit"
                        value={nombreNecesidad}
                        onChange={(e) => setNombreNecesidad(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipoDonacion" className="text-right">
                        Tipo de donación
                      </Label>
                      <Select
                        value={tipoDonacion?.id.toString() || ""}
                        onValueChange={(value) => settipoDonacion(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar tipo de donación" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipoDonaciones.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                              {tipo.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="descripcion-edit" className="text-right">
                        Descripción
                      </Label>
                      <Textarea
                        id="descripcion-edit"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cantidad-edit" className="text-right">
                        Cantidad
                      </Label>
                      <Input
                        id="cantidad-edit"
                        type="number"
                        min="0"
                        value={cantidadNecesaria}
                        onChange={(e) => setCantidadNecesaria(Number(e.target.value))}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unidad-edit" className="text-right">
                        Unidad
                      </Label>
                      <Select
                        value={unidadMedida}
                        onValueChange={(value) => setUnidadMedida(value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Litros">Litros</SelectItem>
                          <SelectItem value="Kilogramos">Kilogramos</SelectItem>
                          <SelectItem value="Gramos">Gramos</SelectItem>
                          <SelectItem value="Mililitros">Mililitros</SelectItem>
                          <SelectItem value="Unidades">Unidades</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prioridad-edit" className="text-right">
                        Prioridad
                      </Label>
                      <Select
                        value={prioridad.toString()}
                        onValueChange={(value) => setPrioridad(Number(value))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Baja</SelectItem>
                          <SelectItem value="2">Media</SelectItem>
                          <SelectItem value="3">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fechaLimite-edit" className="text-right">
                        Fecha Límite
                      </Label>
                      <Input
                        id="fechaLimite-edit"
                        type="date"
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="estado-edit" className="text-right">
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
                          <SelectItem value="En Proceso">En Proceso</SelectItem>
                          <SelectItem value="Completada">Completada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="beneficiarios-edit" className="text-right">
                        Beneficiarios
                      </Label>
                      <Input
                        id="beneficiarios-edit"
                        value={beneficiariosObjetivo}
                        onChange={(e) => setBeneficiariosObjetivo(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleEditCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={updateNecesidad} disabled={loading}>
                      {loading ? "Actualizando..." : "Actualizar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={getNecesidades} disabled={loading}>
                {loading ? "Cargando..." : "Actualizar Lista"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="text-lg">Cargando...</div>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {loading ? (
              <p className="text-center">Cargando necesidades...</p>
            ) : necesidades.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No hay necesidades registradas.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead>Beneficiarios</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {necesidadesPaginadas.map((necesidad) => (
                      <TableRow key={necesidad.id}>
                        <TableCell>{necesidad.id}</TableCell>
                        <TableCell>{necesidad.categoriaInventario?.categoria}</TableCell>
                        <TableCell className="font-medium">{necesidad.nombreNecesidad}</TableCell>
                        <TableCell className="max-w-xs truncate">{necesidad.descripcion}</TableCell>
                        <TableCell>
                          {necesidad.cantidadNecesaria} {necesidad.unidadMedida}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPrioridadBadgeVariant(necesidad.prioridad)}>
                            {getPrioridadText(necesidad.prioridad)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getEstadoBadgeVariant(necesidad.estado)}>
                            {necesidad.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>{necesidad.fechaLimite}</TableCell>
                        <TableCell className="max-w-xs truncate">{necesidad.beneficiariosObjetivo}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editarNecesidad(necesidad)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => eliminarNecesidad(necesidad.id)}
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
            {necesidadesFiltradas.length > 0 && (
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
      </div>
    </>
  );
}

export default GestionNecesidades;