package org.humanitarian.donaciones_inventario.postgres.Controllers;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.postgres.Entities.NecesidadesActuales;
import org.humanitarian.donaciones_inventario.postgres.Entities.CategoriaInventario;
import org.humanitarian.donaciones_inventario.postgres.Entities.TipoDonacion;
import org.humanitarian.donaciones_inventario.postgres.Services.INecesidadesActualesService;
import org.humanitarian.donaciones_inventario.postgres.Services.ICategoriaInventario;
import org.humanitarian.donaciones_inventario.postgres.Services.ITipoDonacionService;
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
import java.util.logging.Logger;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/needs")
@CrossOrigin(origins = "http://localhost:5173")
public class NecesidadesActualesController {

    private final INecesidadesActualesService necesidadesService;
    private final ICategoriaInventario categoriaService;
    private final ITipoDonacionService tipoDonacionService;
    Logger logger = Logger.getLogger(NecesidadesActualesController.class.getName());

    public NecesidadesActualesController(INecesidadesActualesService necesidadesService, ICategoriaInventario categoriaService, ITipoDonacionService tipoDonacionService) {
        this.necesidadesService = necesidadesService;
        this.categoriaService = categoriaService;
        this.tipoDonacionService = tipoDonacionService;
    }

    @GetMapping("/list")
    @Transactional
    public ResponseEntity<List<NecesidadesActuales>> getNecesidades() {
        try {
            List<NecesidadesActuales> necesidades = necesidadesService.findAll();
            return ResponseEntity.ok(necesidades);
        } catch (Exception e) {
            System.out.println("Error al obtener necesidades: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/donation-types")
    @Transactional
    public ResponseEntity<List<TipoDonacion>> getTipoDonacion(){
        try {
            List<TipoDonacion> tipoDonaciones = tipoDonacionService.findAll();
            return ResponseEntity.ok(tipoDonaciones);
        }catch (Exception e){
            logger.info("Error al obtener tipos de donaciones");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("/categories")
    @Transactional
    public ResponseEntity<List<CategoriaInventario>> getCategorias() {
        try {
            List<CategoriaInventario> categorias = categoriaService.findAll();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.info("Error al obtener categorías: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createNecesidad(@RequestBody NecesidadesActuales necesidad) {
        try {
            necesidad.setFechaCreacion(LocalDateTime.now());
            NecesidadesActuales nuevaNecesidad = necesidadesService.save(necesidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaNecesidad);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear necesidad: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> updateNecesidad(@RequestBody NecesidadesActuales necesidad) {
        try {
            NecesidadesActuales necesidadExistente = necesidadesService.findById(necesidad.getId());
            if (necesidadExistente == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Necesidad no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            necesidad.setFechaCreacion(necesidadExistente.getFechaCreacion());

            NecesidadesActuales necesidadActualizada = necesidadesService.update(necesidad);
            return ResponseEntity.ok(necesidadActualizada);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar necesidad: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteNecesidad(@PathVariable Long id) {
        try {
            necesidadesService.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Necesidad eliminada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar necesidad: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // TODO: Metodo para confirmar una donación que se ha recibido por parte de usuario donador
    @PostMapping("/confirm/{amount}")
    @Transactional
    public ResponseEntity<?> confirmDonation(@PathVariable Long amount) {
        try {
            NecesidadesActuales necesidad = necesidadesService.findById(amount);
            if (necesidad == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Necesidad no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            necesidad.setEstado("Confirmada");

            NecesidadesActuales actualizada = necesidadesService.update(necesidad);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al confirmar donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);}
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<?> getNecesidadById(@PathVariable Long id) {
        try {
            NecesidadesActuales necesidad = necesidadesService.findById(id);
            if (necesidad == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Necesidad no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            return ResponseEntity.ok(necesidad);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener necesidad: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
}