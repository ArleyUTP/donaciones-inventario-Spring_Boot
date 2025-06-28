package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.Entities.Distribucion;
import java.util.List;
import java.util.Map;

public interface IDistribucionService {
    Distribucion save(Distribucion distribucion);
    Distribucion update(Distribucion distribucion);
    void deleteById(Long id);
    Distribucion findById(Long id);
    List<Distribucion> findAll();
    public List<Map<String, Object>> countDistribucionesPorEstadoPorMes();

}