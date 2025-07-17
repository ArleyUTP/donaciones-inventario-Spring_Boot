package org.humanitarian.donaciones_inventario.postgres.DAO;

import org.humanitarian.donaciones_inventario.postgres.Entities.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IIncidenciaRepository extends JpaRepository<Incidencia, Long> {
}