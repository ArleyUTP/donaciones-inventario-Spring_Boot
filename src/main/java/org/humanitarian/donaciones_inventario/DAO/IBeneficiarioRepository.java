package org.humanitarian.donaciones_inventario.DAO;

import java.util.List;

import org.humanitarian.donaciones_inventario.Entities.Beneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IBeneficiarioRepository extends JpaRepository<Beneficiario, Long> {
    // Puedes agregar consultas personalizadas aquí si lo necesitas
    @Query("SELECT FUNCTION('to_char', d.fechaProgramada, 'YYYY-MM') as mes, d.estado, COUNT(d) " +
            "FROM Distribucion d GROUP BY mes, d.estado ORDER BY mes, d.estado")
    List<Object[]> countDistribucionesPorEstadoPorMes();
}