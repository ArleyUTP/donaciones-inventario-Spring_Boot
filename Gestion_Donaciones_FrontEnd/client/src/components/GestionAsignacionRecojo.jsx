import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MySwal = withReactContent(Swal);

function GestionAsignacionRecojo() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [donaciones, setDonaciones] = useState([]);
  const [selectedVoluntario, setSelectedVoluntario] = useState("");
  const [selectedDonacion, setSelectedDonacion] = useState("");
  const [openVoluntario, setOpenVoluntario] = useState(false);
  const [openDonacion, setOpenDonacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [asignacionesRes, voluntariosRes, donacionesRes] =
        await Promise.all([
          Axios.get("http://localhost:8080/task/assignments"),
          Axios.get("http://localhost:8080/volunteer/volunteers"),
          Axios.get("http://localhost:8080/donation/donations"),
        ]);

      setAsignaciones(asignacionesRes.data);
      setVoluntarios(voluntariosRes.data);
      setDonaciones(donacionesRes.data.filter((d) => d.estado === "Pendiente"));
    } catch (error) {
      console.error("Error al cargar datos:", error);
      MySwal.fire({
        title: "Error",
        text: "Error al cargar los datos",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const crearAsignacion = async () => {
    try {
      if (!selectedVoluntario || !selectedDonacion) {
        MySwal.fire({
          title: "Error",
          text: "Debes seleccionar un voluntario y una donación",
          icon: "warning",
        });
        return;
      }

      const nuevaAsignacion = {
        voluntario: { id: selectedVoluntario },
        donacion: { id: selectedDonacion },
        estado: "Pendiente",
      };

      await Axios.post("http://localhost:8080/task/create", nuevaAsignacion);
      await cargarDatos();
      setIsCreateDialogOpen(false);
      limpiarSeleccion();

      MySwal.fire({
        title: "¡Éxito!",
        text: "Asignación creada correctamente",
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error al crear asignación:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo crear la asignación",
        icon: "error",
      });
    }
  };

  const limpiarSeleccion = () => {
    setSelectedVoluntario("");
    setSelectedDonacion("");
  };

  const confirmarAsignacion = async (id) => {
    try {
      const result = await MySwal.fire({
        title: "¿Confirmar asignación?",
        text: "Esta acción marcará la tarea como completada",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await Axios.put(`http://localhost:8080/task/update`, {
          id,
          estado: "Completada",
        });
        await cargarDatos();

        MySwal.fire({
          title: "¡Confirmada!",
          text: "La asignación ha sido confirmada",
          icon: "success",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error al confirmar asignación:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo confirmar la asignación",
        icon: "error",
      });
    }
  };

  const eliminarAsignacion = async (id) => {
    try {
      const result = await MySwal.fire({
        title: "¿Eliminar asignación?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await Axios.post(`http://localhost:8080/task/delete/${id}`);
        await cargarDatos();

        MySwal.fire({
          title: "Eliminada",
          text: "La asignación ha sido eliminada",
          icon: "success",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
      MySwal.fire({
        title: "Error",
        text: "No se pudo eliminar la asignación",
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Asignaciones</CardTitle>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>Nueva Asignación</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Asignación</DialogTitle>
                <DialogDescription>
                  Asigna un voluntario a una donación pendiente
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label>Voluntario</label>
                  <Popover
                    open={openVoluntario}
                    onOpenChange={setOpenVoluntario}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openVoluntario}
                      >
                        {selectedVoluntario
                          ? voluntarios.find(
                              (v) => v.id.toString() === selectedVoluntario
                            )?.usuario?.nombreUsuario
                          : "Seleccionar voluntario..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Buscar voluntario..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            No se encontraron voluntarios.
                          </CommandEmpty>
                          <CommandGroup>
                            {voluntarios.map((voluntario) => (
                              <CommandItem
                                key={voluntario.id}
                                value={voluntario.id.toString()}
                                onSelect={(value) => {
                                  setSelectedVoluntario(
                                    value === selectedVoluntario ? "" : value
                                  );
                                  setOpenVoluntario(false);
                                }}
                              >
                                {voluntario.usuario?.nombreUsuario}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedVoluntario ===
                                      voluntario.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <label>Donación</label>
                  <Popover open={openDonacion} onOpenChange={setOpenDonacion}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDonacion}
                      >
                        {selectedDonacion
                          ? `Donación #${selectedDonacion}`
                          : "Seleccionar donación..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Buscar donación..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            No hay donaciones pendientes.
                          </CommandEmpty>
                          <CommandGroup>
                            {donaciones.map((donacion) => (
                              <CommandItem
                                key={donacion.id}
                                value={donacion.id.toString()}
                                onSelect={(value) => {
                                  setSelectedDonacion(
                                    value === selectedDonacion ? "" : value
                                  );
                                  setOpenDonacion(false);
                                }}
                              >
                                {`Donación #${donacion.id} - ${donacion.donador?.nombreDonador}`}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedDonacion === donacion.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={crearAsignacion}>Crear Asignación</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center">Cargando asignaciones...</p>
          ) : asignaciones.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No hay asignaciones registradas.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Voluntario</TableHead>
                    <TableHead>Donación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Asignación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asignaciones.map((asignacion) => (
                    <TableRow key={asignacion.id}>
                      <TableCell>{asignacion.id}</TableCell>
                      <TableCell>
                        {asignacion.voluntario?.usuario?.nombreUsuario}
                      </TableCell>
                      <TableCell>
                        {`Donación #${asignacion.donacion?.id} - ${asignacion.donacion?.donador?.nombreDonador}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            asignacion.estado === "Completada"
                              ? "bg-green-500"
                              : asignacion.estado === "Pendiente"
                              ? "bg-yellow-500"
                              : "bg-gray-500",
                            "text-white"
                          )}
                        >
                          {asignacion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          asignacion.fechaAsignacion
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {asignacion.estado === "Pendiente" && (
                            <Button
                              size="sm"
                              onClick={() => confirmarAsignacion(asignacion.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Completar
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => eliminarAsignacion(asignacion.id)}
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
    </div>
  );
}

export default GestionAsignacionRecojo;
