package org.humanitarian.donaciones_inventario.Services;

import jakarta.transaction.Transactional;
import org.humanitarian.donaciones_inventario.DAO.INotificacionRepository;
import org.humanitarian.donaciones_inventario.Entities.AsignacionRecojo;
import org.humanitarian.donaciones_inventario.Entities.Donacion;
import org.humanitarian.donaciones_inventario.Entities.Notificacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService implements INotificacionService {

    @Autowired
    private INotificacionRepository notificacionRepository;

    @Override
    @Transactional
    public void crearNotificacionDonacionConfirmada(Donacion donacion) {
        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(donacion.getDonador().getUsuario());
        notificacion.setTitulo("Donación Confirmada");
        notificacion.setMensaje("Tu donación de " +
                (donacion.getTipoDonacion().getTipo().equals("Monetaria") ? "$" + donacion.getMonto()
                        : donacion.getMonto() + " unidades")
                +
                " ha sido confirmada.");
        notificacion.setTipo("DONACION_CONFIRMADA");
        notificacion.setLeido(false);
        notificacion.setFechaCreacion(LocalDateTime.now());

        notificacionRepository.save(notificacion);
    }

    @Override
    @Transactional
    public void crearNotificacionAsignacionTarea(AsignacionRecojo asignacion) {
        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(asignacion.getVoluntario().getUsuario());
        notificacion.setTitulo("Nueva Tarea Asignada");
        notificacion.setMensaje("Se te ha asignado una tarea de recojo para la donación #" +
                asignacion.getDonacion().getId() + " en " + asignacion.getDonacion().getDireccionRecojo());
        notificacion.setTipo("TAREA_ASIGNADA");
        notificacion.setLeido(false);
        notificacion.setFechaCreacion(LocalDateTime.now());

        notificacionRepository.save(notificacion);
    }

    @Override
    @Transactional
    public List<Notificacion> obtenerNotificacionesUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    @Override
    @Transactional
    public List<Notificacion> obtenerNotificacionesNoLeidas(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidoFalse(usuarioId);
    }

    @Override
    @Transactional
    public long contarNotificacionesNoLeidas(Long usuarioId) {
        return notificacionRepository.countByUsuarioIdAndLeidoFalse(usuarioId);
    }

    @Override
    @Transactional
    public void marcarComoLeida(Long notificacionId) {
        notificacionRepository.findById(notificacionId).ifPresent(notificacion -> {
            notificacion.setLeido(true);
            notificacionRepository.save(notificacion);
        });
    }

    @Override
    @Transactional
    public void marcarTodasComoLeidas(Long usuarioId) {
        List<Notificacion> noLeidas = notificacionRepository.findByUsuarioIdAndLeidoFalse(usuarioId);
        noLeidas.forEach(notificacion -> {
            notificacion.setLeido(true);
            notificacionRepository.save(notificacion);
        });
    }
}
