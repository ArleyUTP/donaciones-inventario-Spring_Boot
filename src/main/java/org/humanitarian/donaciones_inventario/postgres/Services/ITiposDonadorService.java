package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.TiposDonador;

public interface ITiposDonadorService {
    void deleteById(Long id);
    List<TiposDonador> findAll();
    TiposDonador findById(Long id);
    void save(TiposDonador tipoDonador);
}
