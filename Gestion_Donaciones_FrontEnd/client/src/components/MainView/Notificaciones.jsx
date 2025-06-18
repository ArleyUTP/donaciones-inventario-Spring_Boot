import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function Notificaciones({ usuarioId, onClose }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarNotificaciones();
  }, [usuarioId]);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`http://localhost:8080/notificaciones/usuario/${usuarioId}`);
      setNotificaciones(response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (notificacionId) => {
    try {
      await Axios.post(`http://localhost:8080/notificaciones/marcar-leida/${notificacionId}`);
      cargarNotificaciones();
    } catch (error) {
      console.error('Error al marcar notificación:', error);
    }
  };

  return (
    <Card className="fixed right-0 top-16 w-80 shadow-xl rounded-l-lg overflow-hidden z-[1000]">
      <CardHeader className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notificaciones</h3>
        <Button onClick={onClose} variant="ghost" className="text-white hover:text-gray-200">
          ×
        </Button>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-8rem)] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Cargando...</div>
        ) : notificaciones.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay notificaciones
          </div>
        ) : (
          <div className="divide-y">
            {notificaciones.map((notificacion) => (
              <div
                key={notificacion.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  notificacion.leido ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <h4 className="text-lg font-semibold">{notificacion.titulo}</h4>
                <p className="text-gray-600">{notificacion.mensaje}</p>
                <Button
                  onClick={() => marcarComoLeida(notificacion.id)}
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Marcar como leída
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Notificaciones;