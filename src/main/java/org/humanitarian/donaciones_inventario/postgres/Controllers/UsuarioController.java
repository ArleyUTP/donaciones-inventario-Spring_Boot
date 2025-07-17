package org.humanitarian.donaciones_inventario.postgres.Controllers;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.postgres.Entities.Donador;
import org.humanitarian.donaciones_inventario.postgres.Entities.Rol;
import org.humanitarian.donaciones_inventario.postgres.Entities.TiposDonador;
import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;
import org.humanitarian.donaciones_inventario.postgres.Services.IDonadorService;
import org.humanitarian.donaciones_inventario.postgres.Services.IRolService;
import org.humanitarian.donaciones_inventario.postgres.Services.IUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private final BCryptPasswordEncoder passwordEncoder;
    private final IDonadorService donadorService;
    public UsuarioController(IUsuarioService service, IRolService rolService,BCryptPasswordEncoder passwordEncoder,IDonadorService donadorService) {
        this.service = service;
        this.rolService = rolService;
        this.passwordEncoder = passwordEncoder;
        this.donadorService = donadorService;
    }

    /**
     * Obtiene la lista de todos los usuarios registrados.
     * <p>
     * Este método maneja solicitudes GET a la ruta "/users" y retorna una lista de
     * objetos {@link Usuario}.
     * Utiliza una transacción de solo lectura para mejorar el rendimiento.
     * En caso de error, retorna un código de estado HTTP 500 y una lista vacía.
     *
     * @return ResponseEntity con la lista de usuarios y el código de estado HTTP
     *         correspondiente.
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

    /**
     * Obtiene la lista de todos los roles disponibles en el sistema.
     *
     * @return ResponseEntity con la lista de objetos {@link Rol} si la operación es
     *         exitosa,
     *         o una lista vacía y un código de error HTTP 500 si ocurre una
     *         excepción.
     */
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

    /**
     * Crea un nuevo usuario en el sistema.
     *
     * Este método recibe un objeto Usuario en el cuerpo de la solicitud y lo
     * registra utilizando el servicio correspondiente.
     * Si la creación es exitosa, retorna una respuesta con el usuario creado y el
     * código de estado HTTP 201 (CREATED).
     * En caso de error, retorna un mensaje de error y el código de estado HTTP 500
     * (INTERNAL_SERVER_ERROR).
     *
     * @param usuario El objeto Usuario que se desea crear.
     * @return ResponseEntity con el usuario creado o un mensaje de error en caso de
     *         fallo.
     */
    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            // Encriptar la contraseña antes de guardar
            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
            usuario.setFechaRegistro(LocalDateTime.now());
            Usuario nuevoUsuario = service.register(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/registro/create")
        @Transactional
    public ResponseEntity<?> registreUsuario(@RequestBody Usuario usuario) {
        try {
            // Encriptar la contraseña antes de guardar
            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
            usuario.setFechaRegistro(LocalDateTime.now());
            Usuario nuevoUsuario = service.register(usuario);
            // Crear un donador asociado al usuario
            if (nuevoUsuario != null) {
                Donador donador = new Donador();
                donador.setUsuario(nuevoUsuario);
                donador.setFechaRegistro(LocalDateTime.now());
                donador.setEstadoActivo(true);
                TiposDonador tipoDonador = new TiposDonador();
                tipoDonador.setId(1L); // Asignar un tipo de donador por defecto
                donador.setTipoDonador(tipoDonador);
                donadorService.save(donador);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
    /**
     * Actualiza la información de un usuario existente.
     *
     * @param usuario El objeto Usuario con los datos actualizados.
     * @return ResponseEntity con el usuario actualizado si la operación es exitosa,
     *         un mensaje de error si el usuario no se encuentra,
     *         o un mensaje de error interno si ocurre una excepción.
     */
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

    /**
     * Elimina un usuario identificado por su ID.
     *
     * @param id El identificador único del usuario a eliminar.
     * @return ResponseEntity con un mensaje de éxito si el usuario fue eliminado
     *         correctamente,
     *         o un mensaje de error en caso de que ocurra una excepción durante el
     *         proceso.
     */
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
        @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("nombreUsuario");
            String password = credentials.get("contrasena");
            Usuario usuario = service.findByNombreUsuario(username);
            if (usuario != null && passwordEncoder.matches(password, usuario.getContrasena())) {
                usuario.setUltimoAcceso(LocalDateTime.now());
                service.update(usuario);
                return ResponseEntity.ok(usuario);
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Credenciales inválidas"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error en login: " + e.getMessage()));
        }
    }
}