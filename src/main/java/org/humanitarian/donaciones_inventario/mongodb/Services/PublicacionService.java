package org.humanitarian.donaciones_inventario.mongodb.Services;

import org.humanitarian.donaciones_inventario.mongodb.Entities.Publicacion;
import org.humanitarian.donaciones_inventario.mongodb.Entities.Comentario;
import org.humanitarian.donaciones_inventario.mongodb.Repositories.IPublicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class PublicacionService implements IPublicacionService {

    @Autowired
    private IPublicacionRepository publicacionRepository;

    @Override
    public Publicacion save(Publicacion publicacion) {
        // Establecer fecha de creación si no está establecida
        if (publicacion.getFechaCreacion() == null) {
            publicacion.setFechaCreacion(LocalDateTime.now());
        }
        return publicacionRepository.save(publicacion);
    }

    @Override
    public Publicacion findById(String id) {
        return publicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada: " + id));
    }

    @Override
    public void deleteById(String id) {
        publicacionRepository.deleteById(id);
    }

    @Override
    public List<Publicacion> findAll() {
        return publicacionRepository.findAll();
    }

    @Override
    public List<Publicacion> findByUsuarioCreadorId(String usuarioId) {
        return publicacionRepository.findByUsuarioCreadorId(usuarioId);
    }

    @Override
    public List<Publicacion> findByTituloContainingIgnoreCase(String titulo) {
        return publicacionRepository.findByTituloContainingIgnoreCase(titulo);
    }

    @Override
    public Publicacion addComentario(String publicacionId, Comentario comentario) {
        Publicacion publicacion = findById(publicacionId);
        if (publicacion.getComentarios() == null) {
            publicacion.setComentarios(new ArrayList<>());
        }
        
        // Generate sequential ID for the new comment
        long nextId = 1;
        if (!publicacion.getComentarios().isEmpty()) {
            // Find the maximum ID and increment by 1
            nextId = publicacion.getComentarios().stream()
                .mapToLong(c -> {
                    try {
                        return c.getId() != null ? Long.parseLong(c.getId()) : 0;
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .max()
                .orElse(0) + 1;
        }
        
        // Set the new ID and timestamp
        comentario.setId(String.valueOf(nextId));
        comentario.setFechaComentario(LocalDateTime.now());
        
        // Add the comment to the list
        publicacion.getComentarios().add(comentario);
        
        // Save and return the updated publication
        return publicacionRepository.save(publicacion);
    }

    @Override
    public Publicacion deleteComentario(String publicacionId, String comentarioId) {
        Publicacion publicacion = findById(publicacionId);
        publicacion.setComentarios(publicacion.getComentarios().stream()
                .filter(c -> !c.getId().equals(comentarioId))
                .collect(Collectors.toList()));
        return publicacionRepository.save(publicacion);
    }
}
