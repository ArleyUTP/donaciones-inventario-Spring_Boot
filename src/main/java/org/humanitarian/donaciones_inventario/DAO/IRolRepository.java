package org.humanitarian.donaciones_inventario.DAO;

import org.humanitarian.donaciones_inventario.Entities.Rol;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRolRepository extends CrudRepository<Rol,Long> {
    
}
