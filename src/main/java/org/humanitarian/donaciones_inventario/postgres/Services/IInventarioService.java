package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.Entities.Inventario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IInventarioService {
    Inventario save(Inventario inventario);
    Inventario update(Inventario inventario);
    void deleteById(Long id);
    Inventario findById(Long id);
    List<Inventario> findAll();
        Page<Inventario> findAll(Pageable pageable);
}