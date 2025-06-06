package org.humanitarian.donaciones_inventario.Controllers;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.Entities.Donacion;
import org.humanitarian.donaciones_inventario.Entities.TipoDonacion;
import org.humanitarian.donaciones_inventario.Services.IDonacionService;
import org.humanitarian.donaciones_inventario.Services.ITipoDonacionService;
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
@RequestMapping("/donation")
@CrossOrigin(origins = "http://localhost:5173")
public class DonacionController {

    private final IDonacionService donacionService;
    private final ITipoDonacionService tiposDonacionService;

    public DonacionController(IDonacionService donacionService,
            ITipoDonacionService tiposDonacionService) {
        this.donacionService = donacionService;
        this.tiposDonacionService = tiposDonacionService;
    }

    /**
     * Obtiene todas las donaciones registradas.
     */
    @GetMapping("/donations")
    @Transactional
    public ResponseEntity<List<Donacion>> getDonaciones() {
        try {
            List<Donacion> donaciones = donacionService.findAll();
            return ResponseEntity.ok(donaciones);
        } catch (Exception e) {
            System.err.println("Error al obtener donaciones: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    /**
     * Crea una nueva donación.
     */
    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createDonacion(@RequestBody Donacion donacion) {
        try {
            donacion.setFechaCreacion(LocalDateTime.now());
            Donacion nuevaDonacion = donacionService.save(donacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDonacion);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/types")
    @Transactional
    public ResponseEntity<List<TipoDonacion>> getTiposDonacion() {
        try {
            List<TipoDonacion> tipos = tiposDonacionService.findAll();
            return ResponseEntity.ok(tipos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    /**
     * Actualiza una donación existente.
     */
    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> updateDonacion(@RequestBody Donacion donacion) {
        try {
            Donacion donacionExistente = donacionService.findById(donacion.getId());
            if (donacionExistente == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Donación no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            // Mantener la fecha de registro original
            donacion.setFechaCreacion(donacionExistente.getFechaCreacion());
            Donacion donacionActualizada = donacionService.update(donacion);
            return ResponseEntity.ok(donacionActualizada);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    /**
     * Elimina una donación por ID.
     */
    @PostMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteDonacion(@PathVariable Long id) {
        try {
            donacionService.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Donación eliminada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    /**
     * Obtiene una donación por ID.
     */
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<?> getDonacionById(@PathVariable Long id) {
        try {
            Donacion donacion = donacionService.findById(id);
            if (donacion == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Donación no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            return ResponseEntity.ok(donacion);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
}
