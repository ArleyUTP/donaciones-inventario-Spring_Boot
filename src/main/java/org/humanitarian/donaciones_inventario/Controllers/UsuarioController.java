package org.humanitarian.donaciones_inventario.Controllers;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.Entities.Rol;
import org.humanitarian.donaciones_inventario.Entities.Usuario;
import org.humanitarian.donaciones_inventario.Services.IRolService;
import org.humanitarian.donaciones_inventario.Services.IUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173") // Permitir solicitudes desde este origen
public class UsuarioController {

    private final IUsuarioService service;
    private final IRolService rolService;

    public UsuarioController(IUsuarioService service, IRolService rolService) {
        this.service = service;
        this.rolService = rolService;
    }

    
    /**
     * Obtiene la lista de todos los usuarios registrados.
     * <p>
     * Este método maneja solicitudes GET a la ruta "/users" y retorna una lista de objetos {@link Usuario}.
     * Utiliza una transacción de solo lectura para mejorar el rendimiento.
     * En caso de error, retorna un código de estado HTTP 500 y una lista vacía.
     *
     * @return ResponseEntity con la lista de usuarios y el código de estado HTTP correspondiente.
     */
    @GetMapping("/users")
    @Transactional // Solo lectura para mejorar rendimiento
    public ResponseEntity<List<Usuario>> getUsuarios() {
        try {
            List<Usuario> usuarios = service.findAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            // Log del error para debugging
            System.err.println("Error al obtener usuarios: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

   @GetMapping("/roles")
    @Transactional
    public ResponseEntity<List<Rol>> getRoles() {
        try {
            List<Rol> roles = rolService.findAll();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            System.err.println("Error al obtener roles: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("/test-db")
    public ResponseEntity<String> testDb() {
        try {
            service.findAll();
            return ResponseEntity.ok("Conexión Exitosa");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al conectar a la BD: " + e.getMessage());
        }
    }
  @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = service.register(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> updateUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario usuarioActualizado = service.update(usuario);
            if (usuarioActualizado == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
     @PostMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        try {
            service.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Usuario eliminado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
}