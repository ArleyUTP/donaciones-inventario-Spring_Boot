import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { IoNotificationsOutline } from "react-icons/io5";
import { Menu } from "lucide-react";
import { SubMenu } from './SubMenu';
import Notificaciones from './Notificaciones';
import Axios from 'axios';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header({
  isAuthenticated,
  user,
  logout,
  navigate
}) {
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      Axios.get(`http://localhost:8080/notificaciones/usuario/${user.id}`)
        .then(res => setNotificaciones(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <header className="fixed z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        <div className="flex items-center space-x-8">
          <div className="font-bold tracking-wide">
            {/* <img src=".." alt="Logo" /> */}
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-foreground hover:text-primary">Inicio</Link>
                <Link to="#" className="text-foreground hover:text-primary">Nosotros</Link>
                <Link to="#" className="text-foreground hover:text-primary">Proyectos</Link>
                <Link to="#" className="text-foreground hover:text-primary">Transparencia</Link>
                <Link to="#" className="text-foreground hover:text-primary">Contacto</Link>
                <Link to="/necesidades" className="text-foreground hover:text-primary">Necesidades</Link>
                {isAuthenticated && user.rol?.nombreRol === 'ADMINISTRADOR' && (
                  <Link to="#" className="text-foreground hover:text-warning">Administración</Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className="text-sm font-medium hover:text-primary">Inicio</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="#" className="text-sm font-medium hover:text-primary">Nosotros</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="#" className="text-sm font-medium hover:text-primary">Proyectos</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="#" className="text-sm font-medium hover:text-primary">Transparencia</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="#" className="text-sm font-medium hover:text-primary">Contacto</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/necesidades" className="text-sm font-medium hover:text-primary">Necesidades</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isAuthenticated && user.rol?.nombreRol === 'ADMINISTRADOR' && (
                <NavigationMenuItem className="relative group">
                  <NavigationMenuLink asChild>
                    <Link to="#" className="text-sm font-medium hover:text-warning">
                      Administración
                    </Link>
                  </NavigationMenuLink>
                  <div className="fixed left-1/2 transform -translate-x-1/2 mt-2 w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <SubMenu />
                  </div>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMostrarNotificaciones(true)}
            >
              <IoNotificationsOutline className="h-6 w-6" />
            </Button>
            {user && user.id !== null && (
              <Badge variant="warning" className="absolute -top-2 -right-3">
                {notificaciones.length > 9 ? '9+' : notificaciones.length}
              </Badge>
            )}
            {mostrarNotificaciones && user && user.id !== null && (
              <Notificaciones usuarioId={user.id} onClose={() => setMostrarNotificaciones(false)} />
            )}
          </div>

          {isAuthenticated && user ? (
            <>
              <div className="text-sm font-medium">
                ¡Hola! {user.nombreCompleto}
              </div>
              <div>
                <Button
                  variant="outline"
                  className=" bg-blue-600 text-white font-semibold rounded-full px-6 py-2 shadow-md hover:from-blue-800  transition-colors border-none"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <Button asChild variant="default">
              <Link to="/login">
                Iniciar Sesión
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}