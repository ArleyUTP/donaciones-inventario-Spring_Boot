package org.humanitarian.donaciones_inventario.mongodb.Services;

import org.humanitarian.donaciones_inventario.mongodb.Entities.Comentario;
import org.humanitarian.donaciones_inventario.mongodb.Entities.DistribucionPublicacion;

import java.time.LocalDateTime;
import java.util.List;

public interface IDistribucionPublicacionService {
    DistribucionPublicacion crearPublicacion(DistribucionPublicacion publicacion);
    DistribucionPublicacion actualizarPublicacion(String id, DistribucionPublicacion publicacion);
    DistribucionPublicacion obtenerPublicacion(String id);
    void eliminarPublicacion(String id);
    List<DistribucionPublicacion> obtenerPublicacionesPorUsuario(Long usuarioId);
    List<DistribucionPublicacion> obtenerPublicacionesPublicas();
    List<DistribucionPublicacion> buscarPorBeneficiario(String nombre);
    List<DistribucionPublicacion> buscarPorFecha(LocalDateTime start, LocalDateTime end);
    List<DistribucionPublicacion> buscarPorItem(String item);
    DistribucionPublicacion agregarComentario(String id, Comentario comentario);
    DistribucionPublicacion eliminarComentario(String id, String comentarioId);
    DistribucionPublicacion agregarLike(String id, Long usuarioId);
    DistribucionPublicacion quitarLike(String id, Long usuarioId);
}
