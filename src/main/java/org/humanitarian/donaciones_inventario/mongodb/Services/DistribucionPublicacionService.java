package org.humanitarian.donaciones_inventario.mongodb.Services;

import org.humanitarian.donaciones_inventario.mongodb.Entities.Comentario;
import org.humanitarian.donaciones_inventario.mongodb.Entities.DistribucionPublicacion;
import org.humanitarian.donaciones_inventario.mongodb.Repositories.IDistribucionPublicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class DistribucionPublicacionService implements IDistribucionPublicacionService {

    @Autowired
    private IDistribucionPublicacionRepository distribucionPublicacionRepository;

    @Override
    public DistribucionPublicacion crearPublicacion(DistribucionPublicacion publicacion) {
        // Establecer fecha de creación si no está seteada
        if (publicacion.getFechaPublicacion() == null) {
            publicacion.setFechaPublicacion(LocalDateTime.now());
        }
        return distribucionPublicacionRepository.save(publicacion);
    }

    @Override
    public DistribucionPublicacion actualizarPublicacion(String id, DistribucionPublicacion publicacion) {
        DistribucionPublicacion existing = distribucionPublicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
        
        // Actualizar campos
        existing.setTitulo(publicacion.getTitulo());
        existing.setDescripcion(publicacion.getDescripcion());
        existing.setImagenUrl(publicacion.getImagenUrl());
        existing.setEsPublica(publicacion.getEsPublica());
        existing.setEstado(publicacion.getEstado());
        
        return distribucionPublicacionRepository.save(existing);
    }

    @Override
    public DistribucionPublicacion obtenerPublicacion(String id) {
        return distribucionPublicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
    }

    @Override
    public void eliminarPublicacion(String id) {
        distribucionPublicacionRepository.deleteById(id);
    }

    @Override
    public List<DistribucionPublicacion> obtenerPublicacionesPorUsuario(Long usuarioId) {
        return distribucionPublicacionRepository.findByUsuarioCreador_UsuarioId(usuarioId);
    }

    @Override
    public List<DistribucionPublicacion> obtenerPublicacionesPublicas() {
        return distribucionPublicacionRepository.findByEsPublicaTrue();
    }

    @Override
    public List<DistribucionPublicacion> buscarPorBeneficiario(String nombre) {
        return distribucionPublicacionRepository.findByBeneficiarioNombreContainingIgnoreCase(nombre);
    }

    @Override
    public List<DistribucionPublicacion> buscarPorFecha(LocalDateTime start, LocalDateTime end) {
        return distribucionPublicacionRepository.findByFechaDistribucionBetween(start, end);
    }

    @Override
    public List<DistribucionPublicacion> buscarPorItem(String item) {
        return distribucionPublicacionRepository.findByItemsDistribuidosContains(item);
    }

    @Override
    public DistribucionPublicacion agregarComentario(String id, Comentario comentario) {
        DistribucionPublicacion publicacion = obtenerPublicacion(id);
        if (publicacion.getComentarios() == null) {
            publicacion.setComentarios(new ArrayList<>());
        }
        comentario.setFechaComentario(LocalDateTime.now());
        publicacion.getComentarios().add(comentario);
        return distribucionPublicacionRepository.save(publicacion);
    }

    @Override
    public DistribucionPublicacion eliminarComentario(String id, String comentarioId) {
        DistribucionPublicacion publicacion = obtenerPublicacion(id);
        publicacion.setComentarios(publicacion.getComentarios().stream()
                .filter(c -> !c.getId().equals(comentarioId))
                .collect(Collectors.toList()));
        return distribucionPublicacionRepository.save(publicacion);
    }

    @Override
    public DistribucionPublicacion agregarLike(String id, Long usuarioId) {
        DistribucionPublicacion publicacion = obtenerPublicacion(id);
        if (publicacion.getLikes() == null) {
            publicacion.setLikes(0);
        }
        publicacion.setLikes(publicacion.getLikes() + 1);
        return distribucionPublicacionRepository.save(publicacion);
    }

    @Override
    public DistribucionPublicacion quitarLike(String id, Long usuarioId) {
        DistribucionPublicacion publicacion = obtenerPublicacion(id);
        if (publicacion.getLikes() != null && publicacion.getLikes() > 0) {
            publicacion.setLikes(publicacion.getLikes() - 1);
        }
        return distribucionPublicacionRepository.save(publicacion);
    }
}
