package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.Entities.NecesidadesActuales;

public interface INecesidadesActualesService {
    public NecesidadesActuales save(NecesidadesActuales necesidadesActuales);

    public NecesidadesActuales findById(Long id);

    public void deleteById(Long id);

    public List<NecesidadesActuales> findAll();

    public NecesidadesActuales update(NecesidadesActuales necesidadesActuales);
}
