package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.TipoDonacion;

public interface ITipoDonacionService {
    public TipoDonacion save(TipoDonacion tipoDonacion);

    public TipoDonacion findById(Long id);

    public void deleteById(Long id);

    public List<TipoDonacion> findAll();

    public TipoDonacion update(TipoDonacion tipoDonacion);
}
