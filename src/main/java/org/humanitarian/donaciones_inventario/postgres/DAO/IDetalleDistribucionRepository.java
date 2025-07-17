package org.humanitarian.donaciones_inventario.postgres.DAO;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.DetalleDistribucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IDetalleDistribucionRepository extends JpaRepository<DetalleDistribucion, Long> {
    List<DetalleDistribucion> findByDistribucionId(Long distribucionId);
}