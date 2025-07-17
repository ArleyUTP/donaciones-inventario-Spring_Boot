package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;
import org.humanitarian.donaciones_inventario.postgres.Entities.Rol;

public interface IRolService {
    public List<Rol> findAll();
}
