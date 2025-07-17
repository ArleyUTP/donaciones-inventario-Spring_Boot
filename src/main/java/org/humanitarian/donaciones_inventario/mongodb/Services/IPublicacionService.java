package org.humanitarian.donaciones_inventario.mongodb.Services;

import org.humanitarian.donaciones_inventario.mongodb.Entities.Publicacion;
import org.humanitarian.donaciones_inventario.mongodb.Entities.Comentario;
import java.util.List;

public interface IPublicacionService {
    Publicacion save(Publicacion publicacion);
    Publicacion findById(String id);
    void deleteById(String id);
    List<Publicacion> findAll();
    List<Publicacion> findByUsuarioCreadorId(String usuarioId);
    List<Publicacion> findByTituloContainingIgnoreCase(String titulo);
    Publicacion addComentario(String publicacionId, Comentario comentario);
    Publicacion deleteComentario(String publicacionId, String comentarioId);
}
