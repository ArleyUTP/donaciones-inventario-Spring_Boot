package org.humanitarian.donaciones_inventario.DAO;

import org.humanitarian.donaciones_inventario.Entities.CategoriaInventario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICategoriaInventarioRepository extends CrudRepository<CategoriaInventario, Long> {
    
}
