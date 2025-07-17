package org.humanitarian.donaciones_inventario.postgres.Controllers;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.Notificacion;
import org.humanitarian.donaciones_inventario.postgres.Services.INotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notificaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificacionController {
    
    @Autowired
    private INotificacionService notificacionService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getNotificacionesUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesUsuario(usuarioId));
    }

    @GetMapping("/no-leidas/cantidad/{usuarioId}")
    public ResponseEntity<Long> getCantidadNoLeidas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.contarNotificacionesNoLeidas(usuarioId));
    }

    @PostMapping("/marcar-leida/{notificacionId}")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long notificacionId) {
        notificacionService.marcarComoLeida(notificacionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/marcar-todas-leidas/{usuarioId}")
    public ResponseEntity<?> marcarTodasComoLeidas(@PathVariable Long usuarioId) {
        notificacionService.marcarTodasComoLeidas(usuarioId);
        return ResponseEntity.ok().build();
    }
}