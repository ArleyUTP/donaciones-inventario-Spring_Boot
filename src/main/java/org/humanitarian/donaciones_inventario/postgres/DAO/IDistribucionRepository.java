package org.humanitarian.donaciones_inventario.postgres.DAO;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.Distribucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Repository
public interface IDistribucionRepository extends JpaRepository<Distribucion, Long> {
@Query("SELECT FUNCTION('to_char', d.fechaProgramada, 'YYYY') as anio, " +
       "INITCAP(TRIM(FUNCTION('to_char', d.fechaProgramada, 'TMMonth'))) as mes, " +
       "d.estado, COUNT(d) " +
       "FROM Distribucion d " +
       "GROUP BY anio, mes, d.estado " +
       "ORDER BY anio DESC, mes, d.estado")
List<Object[]> countDistribucionesPorEstadoPorMes();
    Page<Distribucion> findAll(Pageable pageable);
}