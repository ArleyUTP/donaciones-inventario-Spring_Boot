package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.Entities.Incidencia;
import java.util.List;

public interface IIncidenciaService {
    Incidencia save(Incidencia incidencia);
    Incidencia update(Incidencia incidencia);
    void deleteById(Long id);
    Incidencia findById(Long id);
    List<Incidencia> findAll();
}