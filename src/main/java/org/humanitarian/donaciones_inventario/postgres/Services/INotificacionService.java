package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.Entities.AsignacionRecojo;
import org.humanitarian.donaciones_inventario.postgres.Entities.Donacion;
import org.humanitarian.donaciones_inventario.postgres.Entities.Notificacion;

import java.util.List;


public interface INotificacionService {
    void crearNotificacionDonacionConfirmada(Donacion donacion);
    public void crearNotificacionAsignacionTarea(AsignacionRecojo asignacion);
    List<Notificacion> obtenerNotificacionesUsuario(Long usuarioId);
    List<Notificacion> obtenerNotificacionesNoLeidas(Long usuarioId);
    long contarNotificacionesNoLeidas(Long usuarioId);
    void marcarComoLeida(Long notificacionId);
    void marcarTodasComoLeidas(Long usuarioId);
}
