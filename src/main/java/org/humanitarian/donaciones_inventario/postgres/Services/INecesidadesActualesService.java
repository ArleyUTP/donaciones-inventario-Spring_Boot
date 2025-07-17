package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.NecesidadesActuales;

public interface INecesidadesActualesService {
    public NecesidadesActuales save(NecesidadesActuales necesidadesActuales);

    public NecesidadesActuales findById(Long id);

    public void deleteById(Long id);

    public List<NecesidadesActuales> findAll();

    public NecesidadesActuales update(NecesidadesActuales necesidadesActuales);
}
