import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SubMenu() {
    return (
        <Card className="w-[700px] mx-auto my-8">
            <CardContent className="grid grid-cols-3 gap-12 p-8">
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-primary">Gestión</h3>
                    <nav className="space-y-4">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/gestion-usuarios">Usuarios</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/gestion-donadores">Donadores</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/gestion-donaciones">Donaciones</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/gestion-voluntarios">Voluntarios</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/gestion-distribuciones">Distribuciones</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/gestion-necesidades">Necesidades</Link>
                        </Button>                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/asignacion-voluntarios">Tarea Recojo</Link>
                        </Button>
                    </nav>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-primary">Reportes</h3>
                    <nav className="space-y-4">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/dashboard">Vista reportes</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="#">Estadísticas</Link>
                        </Button>
                    </nav>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-primary">Configuración</h3>
                    <nav className="space-y-4">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="#">Ajustes</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="#">Permisos</Link>
                        </Button>
                    </nav>
                </div>
            </CardContent>
        </Card>
    );
}
