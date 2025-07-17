package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.Entities.Incidencia;
import java.util.List;

public interface IIncidenciaService {
    Incidencia save(Incidencia incidencia);
    Incidencia update(Incidencia incidencia);
    void deleteById(Long id);
    Incidencia findById(Long id);
    List<Incidencia> findAll();
}