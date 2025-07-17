package org.humanitarian.donaciones_inventario.postgres.DAO;

import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
        Usuario findByNombreUsuario(String nombreUsuario);
}
