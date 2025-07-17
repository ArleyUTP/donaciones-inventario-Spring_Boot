package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.AsignacionRecojo;

public interface IAsignacionRecojoService {
    AsignacionRecojo save(AsignacionRecojo asignacionRecojo);
    AsignacionRecojo update(AsignacionRecojo asignacionRecojo);
    void delete(Long id);
    AsignacionRecojo getById(Long id);
    List<AsignacionRecojo> getAll();
}
