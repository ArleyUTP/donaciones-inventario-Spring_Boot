package org.humanitarian.donaciones_inventario.postgres.DAO;

import org.humanitarian.donaciones_inventario.postgres.Entities.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INotificacionRepository extends JpaRepository<Notificacion,Long> {
    // Buscar notificaciones por usuario ordenadas por fecha
    List<Notificacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);

    // Contar notificaciones no leídas por usuario
    long countByUsuarioIdAndLeidoFalse(Long usuarioId);

    // Buscar notificaciones no leídas
    List<Notificacion> findByUsuarioIdAndLeidoFalse(Long usuarioId);
}
