package org.humanitarian.donaciones_inventario.DAO;

import org.humanitarian.donaciones_inventario.Entities.Distribucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IDistribucionRepository extends JpaRepository<Distribucion, Long> {
}