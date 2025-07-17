package org.humanitarian.donaciones_inventario.mongodb.Controllers;

import org.humanitarian.donaciones_inventario.mongodb.Entities.Publicacion;
import org.humanitarian.donaciones_inventario.mongodb.Entities.Comentario;
import org.humanitarian.donaciones_inventario.mongodb.Services.IPublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController("mongoPublicacionController")
@RequestMapping("/api/mongodb/publicaciones")
public class PublicacionController {

    @Autowired
    private IPublicacionService publicacionService;

    @PostMapping
    public ResponseEntity<Publicacion> createPublicacion(@RequestBody Publicacion publicacion) {
        return ResponseEntity.ok(publicacionService.save(publicacion));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publicacion> getPublicacion(@PathVariable String id) {
        return ResponseEntity.ok(publicacionService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Publicacion>> getAllPublicaciones() {
        return ResponseEntity.ok(publicacionService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublicacion(@PathVariable String id) {
        publicacionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Publicacion>> findByUsuarioCreadorId(@PathVariable String usuarioId) {
        return ResponseEntity.ok(publicacionService.findByUsuarioCreadorId(usuarioId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Publicacion>> findByTituloContaining(@RequestParam String titulo) {
        return ResponseEntity.ok(publicacionService.findByTituloContainingIgnoreCase(titulo));
    }

    @PostMapping("/{publicacionId}/comentarios")
    public ResponseEntity<Publicacion> addComentario(
            @PathVariable String publicacionId,
            @RequestBody Comentario comentario) {
        return ResponseEntity.ok(publicacionService.addComentario(publicacionId, comentario));
    }

    @DeleteMapping("/{publicacionId}/comentarios/{comentarioId}")
    public ResponseEntity<Publicacion> deleteComentario(
            @PathVariable String publicacionId,
            @PathVariable String comentarioId) {
        return ResponseEntity.ok(publicacionService.deleteComentario(publicacionId, comentarioId));
    }
}
