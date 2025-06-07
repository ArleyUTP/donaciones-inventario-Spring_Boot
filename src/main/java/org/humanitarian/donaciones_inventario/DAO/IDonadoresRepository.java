package org.humanitarian.donaciones_inventario.DAO;

import org.humanitarian.donaciones_inventario.Entities.Donador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface IDonadoresRepository extends JpaRepository<Donador,Long>{
}
