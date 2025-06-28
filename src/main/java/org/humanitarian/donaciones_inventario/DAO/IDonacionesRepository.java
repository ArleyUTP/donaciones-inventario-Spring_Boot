package org.humanitarian.donaciones_inventario.DAO;

import java.util.List;

import org.humanitarian.donaciones_inventario.Entities.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IDonacionesRepository extends JpaRepository<Donacion, Long> {
    @Query("SELECT FUNCTION('to_char', d.fechaDonacion, :pattern) as mes, COUNT(d) as total " +
            "FROM Donacion d " +
            "WHERE d.fechaDonacion IS NOT NULL " +
            "GROUP BY mes " +
            "ORDER BY mes")
    List<Object[]> countDonacionesByMonth(@Param("pattern") String pattern);

    @Query("SELECT c.categoria, COUNT(d) FROM Donacion d JOIN d.categoria c GROUP BY c.categoria ORDER BY c.categoria")
    List<Object[]> countDonacionesByCategoria();

    @Query("SELECT d.estado, COUNT(d) FROM Donacion d GROUP BY d.estado ORDER BY d.estado")
    List<Object[]> countDonacionesByEstado();

    @Query("SELECT d.tipoDonacion, COUNT(d) FROM Donacion d GROUP BY d.tipoDonacion ORDER BY d.tipoDonacion")
    List<Object[]> countDonacionesByTipo();

@Query("SELECT FUNCTION('to_char', d.fechaDonacion, 'YYYY') as anio, " +
       "INITCAP(TRIM(FUNCTION('to_char', d.fechaDonacion, 'TMMonth'))) as mes, " +
       "COUNT(d) " +
       "FROM Donacion d " +
       "GROUP BY anio, mes " +
       "ORDER BY anio DESC, mes")
List<Object[]> countDonacionesPorMes();
}
