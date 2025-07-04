package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.Entities.DetalleDistribucion;
import java.util.List;

public interface IDetalleDistribucionService {
    DetalleDistribucion save(DetalleDistribucion detalle);
    DetalleDistribucion update(DetalleDistribucion detalle);
    void deleteById(Long id);
    DetalleDistribucion findById(Long id);
    List<DetalleDistribucion> findAll();
        List<DetalleDistribucion> findByDistribucionId(Long distribucionId);
}