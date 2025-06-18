package org.humanitarian.donaciones_inventario.Controllers;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.Entities.AsignacionRecojo;
import org.humanitarian.donaciones_inventario.Services.IAsignacionRecojoService;
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
@RequestMapping("/task")
@CrossOrigin(origins = "http://localhost:5173")
public class AsignacionRecojoController {
    
    private final IAsignacionRecojoService
    asignacionRecojoService;

    public AsignacionRecojoController(IAsignacionRecojoService asignacionRecojoService) {
        this.asignacionRecojoService = asignacionRecojoService;
    }
    
     /**
     * Obtiene todas las asignaciones de recojo registradas.
     */
    @GetMapping("/assignments")
    @Transactional
    public ResponseEntity<List<AsignacionRecojo>> getAsignaciones() {
        try {
            List<AsignacionRecojo> asignaciones = asignacionRecojoService.getAll();
            return ResponseEntity.ok(asignaciones);
        } catch (Exception e) {
            System.err.println("Error al obtener asignaciones: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    /**
     * Crea una nueva asignación de recojo.
     */
    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createAsignacion(@RequestBody AsignacionRecojo asignacion) {
        try {
            // Validaciones
            if (asignacion.getVoluntario() == null || asignacion.getVoluntario().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Voluntario es requerido"));
            }
            if (asignacion.getDonacion() == null || asignacion.getDonacion().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Donación es requerida"));
            }

            asignacion.setFechaAsignacion(LocalDateTime.now());
            asignacion.setEstado("Pendiente");
            AsignacionRecojo nuevaAsignacion = asignacionRecojoService.save(asignacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsignacion);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear asignación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Actualiza una asignación existente.
     */
    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> updateAsignacion(@RequestBody AsignacionRecojo asignacion) {
        try {
            AsignacionRecojo asignacionExistente = asignacionRecojoService.getById(asignacion.getId());
            if (asignacionExistente == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Asignación no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            AsignacionRecojo asignacionActualizada = asignacionRecojoService.update(asignacion);
            return ResponseEntity.ok(asignacionActualizada);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar asignación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Elimina una asignación por ID.
     */
    @PostMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteAsignacion(@PathVariable Long id) {
        try {
            asignacionRecojoService.delete(id);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Asignación eliminada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar asignación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Obtiene una asignación por ID.
     */
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<?> getAsignacionById(@PathVariable Long id) {
        try {
            AsignacionRecojo asignacion = asignacionRecojoService.getById(id);
            if (asignacion == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Asignación no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            return ResponseEntity.ok(asignacion);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener asignación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
