package org.humanitarian.donaciones_inventario.mongodb.Repositories;

import org.humanitarian.donaciones_inventario.mongodb.Entities.DistribucionPublicacion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface IDistribucionPublicacionRepository extends MongoRepository<DistribucionPublicacion, String> {
    List<DistribucionPublicacion> findByUsuarioCreador_UsuarioId(Long usuarioId);
    List<DistribucionPublicacion> findByEsPublicaTrue();
    List<DistribucionPublicacion> findByBeneficiarioNombreContainingIgnoreCase(String nombre);
    List<DistribucionPublicacion> findByFechaDistribucionBetween(LocalDateTime start, LocalDateTime end);
    List<DistribucionPublicacion> findByItemsDistribuidosContains(String item);
}
