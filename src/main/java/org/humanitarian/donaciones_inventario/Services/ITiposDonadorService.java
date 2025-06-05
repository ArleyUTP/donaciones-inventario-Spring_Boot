package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.Entities.TiposDonador;

public interface ITiposDonadorService {
    void deleteById(Long id);
    List<TiposDonador> findAll();
    TiposDonador findById(Long id);
    void save(TiposDonador tipoDonador);
}
