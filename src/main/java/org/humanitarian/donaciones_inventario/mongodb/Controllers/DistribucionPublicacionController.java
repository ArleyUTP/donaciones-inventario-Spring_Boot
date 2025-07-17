package org.humanitarian.donaciones_inventario.mongodb.Controllers;

import org.humanitarian.donaciones_inventario.mongodb.Entities.Comentario;
import org.humanitarian.donaciones_inventario.mongodb.Entities.DistribucionPublicacion;
import org.humanitarian.donaciones_inventario.mongodb.Services.IDistribucionPublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestController("mongoDistribucionPublicacionController")
@RequestMapping("/api/mongodb/distribuciones-publicaciones")
public class DistribucionPublicacionController {

    @Autowired
    private IDistribucionPublicacionService distribucionPublicacionService;

    @PostMapping
    public ResponseEntity<DistribucionPublicacion> crearPublicacion(@RequestBody DistribucionPublicacion publicacion) {
        return ResponseEntity.ok(distribucionPublicacionService.crearPublicacion(publicacion));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DistribucionPublicacion> obtenerPublicacion(@PathVariable String id) {
        return ResponseEntity.ok(distribucionPublicacionService.obtenerPublicacion(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<DistribucionPublicacion>> obtenerPublicacionesPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(distribucionPublicacionService.obtenerPublicacionesPorUsuario(usuarioId));
    }

    @GetMapping("/publicas")
    public ResponseEntity<List<DistribucionPublicacion>> obtenerPublicacionesPublicas() {
        return ResponseEntity.ok(distribucionPublicacionService.obtenerPublicacionesPublicas());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<DistribucionPublicacion>> buscarPublicaciones(
            @RequestParam(required = false) String beneficiario,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @RequestParam(required = false) String item) {
        
        if (beneficiario != null) {
            return ResponseEntity.ok(distribucionPublicacionService.buscarPorBeneficiario(beneficiario));
        } else if (start != null && end != null) {
            return ResponseEntity.ok(distribucionPublicacionService.buscarPorFecha(start, end));
        } else if (item != null) {
            return ResponseEntity.ok(distribucionPublicacionService.buscarPorItem(item));
        }
        
        return ResponseEntity.ok(distribucionPublicacionService.obtenerPublicacionesPublicas());
    }

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<DistribucionPublicacion> agregarComentario(
            @PathVariable String id,
            @RequestBody Comentario comentario) {
        return ResponseEntity.ok(distribucionPublicacionService.agregarComentario(id, comentario));
    }

    @DeleteMapping("/{id}/comentarios/{comentarioId}")
    public ResponseEntity<DistribucionPublicacion> eliminarComentario(
            @PathVariable String id,
            @PathVariable String comentarioId) {
        return ResponseEntity.ok(distribucionPublicacionService.eliminarComentario(id, comentarioId));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<DistribucionPublicacion> agregarLike(
            @PathVariable String id,
            @RequestParam Long usuarioId) {
        return ResponseEntity.ok(distribucionPublicacionService.agregarLike(id, usuarioId));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<DistribucionPublicacion> quitarLike(
            @PathVariable String id,
            @RequestParam Long usuarioId) {
        return ResponseEntity.ok(distribucionPublicacionService.quitarLike(id, usuarioId));
    }
}
