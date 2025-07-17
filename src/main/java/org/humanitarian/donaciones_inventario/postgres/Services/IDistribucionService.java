package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.Entities.Distribucion;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface IDistribucionService {
    Distribucion save(Distribucion distribucion);
    Distribucion update(Distribucion distribucion);
    void deleteById(Long id);
    Distribucion findById(Long id);
    List<Distribucion> findAll();
    public List<Map<String, Object>> countDistribucionesPorEstadoPorMes();
        Page<Distribucion> findAll(Pageable pageable);
}