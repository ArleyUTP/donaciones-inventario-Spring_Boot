package org.humanitarian.donaciones_inventario.DAO;


import org.humanitarian.donaciones_inventario.Entities.Usuario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUsuarioRepository extends CrudRepository<Usuario, Long> {
}
