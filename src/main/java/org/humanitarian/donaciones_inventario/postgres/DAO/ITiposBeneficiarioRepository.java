package org.humanitarian.donaciones_inventario.DAO;

import org.humanitarian.donaciones_inventario.Entities.TiposBeneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITiposBeneficiarioRepository extends JpaRepository<TiposBeneficiario, Long> {
    // Puedes agregar métodos personalizados si lo necesitas
}