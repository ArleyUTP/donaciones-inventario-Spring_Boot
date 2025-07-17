package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.CategoriaInventario;

public interface ICategoriaInventario {
    public CategoriaInventario save(CategoriaInventario CategoriaInventario);

    public CategoriaInventario findById(Long id);

    public void deleteById(Long id);

    public List<CategoriaInventario> findAll();

    public CategoriaInventario update(CategoriaInventario CategoriaInventario);
}
