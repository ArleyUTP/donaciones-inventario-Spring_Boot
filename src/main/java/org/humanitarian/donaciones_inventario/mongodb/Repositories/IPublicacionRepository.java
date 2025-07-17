package org.humanitarian.donaciones_inventario.mongodb.Repositories;

import org.humanitarian.donaciones_inventario.mongodb.Entities.Publicacion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface IPublicacionRepository extends MongoRepository<Publicacion, String> {
    List<Publicacion> findByUsuarioCreadorId(String usuarioId);
    List<Publicacion> findByTituloContainingIgnoreCase(String titulo);
}
