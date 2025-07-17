package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.Entities.DetalleDistribucion;
import java.util.List;

public interface IDetalleDistribucionService {
    DetalleDistribucion save(DetalleDistribucion detalle);
    DetalleDistribucion update(DetalleDistribucion detalle);
    void deleteById(Long id);
    DetalleDistribucion findById(Long id);
    List<DetalleDistribucion> findAll();
        List<DetalleDistribucion> findByDistribucionId(Long distribucionId);
}