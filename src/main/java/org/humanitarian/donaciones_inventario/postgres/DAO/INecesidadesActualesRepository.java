package org.humanitarian.donaciones_inventario.postgres.DAO;

import org.humanitarian.donaciones_inventario.postgres.Entities.NecesidadesActuales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface INecesidadesActualesRepository extends JpaRepository<NecesidadesActuales,Long>{
}
