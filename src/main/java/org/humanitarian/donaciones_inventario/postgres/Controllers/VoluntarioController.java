package org.humanitarian.donaciones_inventario.postgres.Controllers;

import jakarta.transaction.Transactional;
import org.humanitarian.donaciones_inventario.postgres.Entities.Rol;
import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;
import org.humanitarian.donaciones_inventario.postgres.Entities.Voluntario;
import org.humanitarian.donaciones_inventario.postgres.Services.IUsuarioService;
import org.humanitarian.donaciones_inventario.postgres.Services.IVoluntarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/volunteer")
@CrossOrigin(origins = "http://localhost:5173")
public class VoluntarioController {
    private final IVoluntarioService voluntarioService;
    private final IUsuarioService usuarioService;
    Logger logger = Logger.getLogger(NecesidadesActualesController.class.getName());

    public VoluntarioController(IVoluntarioService voluntarioService, IUsuarioService usuarioService) {
        this.voluntarioService = voluntarioService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/volunteers")
    @Transactional
    public ResponseEntity<List<Voluntario>> getVoluntarios(){
        try {
            List<Voluntario> voluntarios = voluntarioService.findAll();
            return ResponseEntity.ok(voluntarios);
        }catch (Exception e){
            logger.info("Error al recuperar lista de voluntarios");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createVoluntario(@RequestBody Voluntario voluntario){
        try {
            Usuario usuarioBuscado = usuarioService.findById(voluntario.getUsuario().getId());
            Usuario usuarioModificado = usuarioBuscado;
            Rol rolVolunario = new Rol();
            rolVolunario.setId(3L); //asignar rol de voluntario
            usuarioModificado.setRol(rolVolunario);
            usuarioService.update(usuarioModificado);
            voluntario.setFechaRegistro(LocalDateTime.now());
            Voluntario createdVoluntario = voluntarioService.save(voluntario);
            return ResponseEntity.status(HttpStatus.CREATED).body(voluntario);
        }catch (Exception e){
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear voluntario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> updateVoluntario(@RequestBody Voluntario voluntario){
        try {
            Voluntario voluntarioExistente = voluntarioService.findById(voluntario.getId());
            if (voluntarioExistente == null){
                Map<String, String> response = new HashMap<>();
                response.put("error", "Voluntario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            voluntario.setFechaRegistro(voluntarioExistente.getFechaRegistro());
            Voluntario voluntarioActualizado = voluntarioService.update(voluntario);
            return ResponseEntity.ok(voluntarioActualizado);
        }catch (Exception e){
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar voluntario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
    @PostMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteVoluntario(@PathVariable Long id ){
        try {
            voluntarioService.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Voluntario eliminado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar Voluntario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
}
