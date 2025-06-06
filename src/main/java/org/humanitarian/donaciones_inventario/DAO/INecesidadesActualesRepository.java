package org.humanitarian.donaciones_inventario.DAO;

import org.humanitarian.donaciones_inventario.Entities.NecesidadesActuales;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface INecesidadesActualesRepository extends CrudRepository<NecesidadesActuales,Long>{
}
