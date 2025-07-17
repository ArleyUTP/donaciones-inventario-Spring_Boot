package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.DAO.ICategoriaInventarioRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.CategoriaInventario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoriaInventarioService implements ICategoriaInventario{

    @Autowired
    private ICategoriaInventarioRepository categoriaInventarioRepository;
    @Override
    public void deleteById(Long id) {
        categoriaInventarioRepository.deleteById(id);
    }

    @Override
    public List<CategoriaInventario> findAll() {
        return (List<CategoriaInventario>) categoriaInventarioRepository.findAll();
    }

    @Override
    public CategoriaInventario findById(Long id) {
        return categoriaInventarioRepository.findById(id).orElse(null);
    }

    @Override
    public CategoriaInventario save(CategoriaInventario CategoriaInventario) {
        return categoriaInventarioRepository.save(CategoriaInventario);
    }

    @Override
    public CategoriaInventario update(CategoriaInventario CategoriaInventario) {
        return categoriaInventarioRepository.save(CategoriaInventario);
    }
}
