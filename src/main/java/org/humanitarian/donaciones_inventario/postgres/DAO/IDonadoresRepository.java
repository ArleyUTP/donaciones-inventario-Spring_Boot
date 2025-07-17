package org.humanitarian.donaciones_inventario.postgres.DAO;

import org.humanitarian.donaciones_inventario.postgres.Entities.Donador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface IDonadoresRepository extends JpaRepository<Donador,Long>{
    Donador findByUsuarioId(Long usuarioId);
}
