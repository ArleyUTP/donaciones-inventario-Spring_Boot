package org.humanitarian.donaciones_inventario.postgres.Controllers;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.postgres.Entities.Donador;
import org.humanitarian.donaciones_inventario.postgres.Entities.TiposDonador;
import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;
import org.humanitarian.donaciones_inventario.postgres.Services.IDonadorService;
import org.humanitarian.donaciones_inventario.postgres.Services.ITiposDonadorService;
import org.humanitarian.donaciones_inventario.postgres.Services.IUsuarioService;
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
@RequestMapping("/donor")
@CrossOrigin(origins = "http://localhost:5173") // Permitir solicitudes desde este origen
public class DonadorController {
    private final IDonadorService service;
    private final ITiposDonadorService tiposDonadorService;
    private final IUsuarioService usuarioService;

    public DonadorController(IDonadorService service, ITiposDonadorService tiposDonadorService, IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
        this.service = service;
        this.tiposDonadorService = tiposDonadorService;
    }

    @GetMapping("/donors")
    @Transactional
    public ResponseEntity<List<Donador>> getDonadores() {
        try {
            List<Donador> donadores = service.findAll();
            return ResponseEntity.ok(donadores);
        } catch (Exception e) {
            // Log del error para debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/donor-types")
    @Transactional
    public ResponseEntity<List<TiposDonador>> getTiposDonador() {
        try {
            List<TiposDonador> tiposDonador = tiposDonadorService.findAll();
            return ResponseEntity.ok(tiposDonador);
        } catch (Exception e) {
            System.err.println("Error al obtener tipos donador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createDonador(@RequestBody Donador donador) {
        try {
            donador.setFechaRegistro(LocalDateTime.now());
            Donador createdDonador = service.save(donador);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDonador);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> updateDonador(@RequestBody Donador donador) {
        try {
            // Verificar si es un donador tipo persona (ID 1)
            if (donador.getTipoDonador().getId() == 1 && donador.getUsuario() != null) {
                // Actualizar el usuario asociado
                Usuario usuario = donador.getUsuario();
                usuario.setNombreCompleto(donador.getNombreDonador());
                usuario.setEmail(donador.getEmail());
                usuario.setTelefono(donador.getTelefono());
                // Aquí necesitarías el servicio de usuarios
                usuarioService.update(usuario);
            }

            Donador donadorExistente = service.findById(donador.getId());
            if (donadorExistente == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Donador no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Mantener la fecha de registro original
            donador.setFechaRegistro(donadorExistente.getFechaRegistro());

            Donador donadorActualizado = service.update(donador);
            return ResponseEntity.ok(donadorActualizado);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar donador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteDonador(@PathVariable Long id) {
        try {
            service.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Donador eliminado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar donador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/by-user/{usuarioId}")
    @Transactional
    public ResponseEntity<?> getDonadorByUsuarioId(@PathVariable Long usuarioId) {
        try {
            Donador donador = service.findByUsuarioId(usuarioId);
            if (donador == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "No se encontró donador para el usuario especificado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            return ResponseEntity.ok(donador);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al buscar donador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
}
