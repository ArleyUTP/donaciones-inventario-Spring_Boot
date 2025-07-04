package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.Entities.Inventario;
import java.util.List;

public interface IInventarioService {
    Inventario save(Inventario inventario);
    Inventario update(Inventario inventario);
    void deleteById(Long id);
    Inventario findById(Long id);
    List<Inventario> findAll();
}