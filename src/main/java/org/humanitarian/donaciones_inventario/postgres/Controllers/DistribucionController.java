package org.humanitarian.donaciones_inventario.postgres.Controllers;

import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.postgres.Entities.Distribucion;
import org.humanitarian.donaciones_inventario.postgres.Services.IDistribucionService;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/distribucion")
@CrossOrigin(origins = "http://localhost:5173")
public class DistribucionController {

    private final IDistribucionService distribucionService;

    public DistribucionController(IDistribucionService distribucionService) {
        this.distribucionService = distribucionService;
    }

    @GetMapping("/distribuciones-por-estado-mes")
    public ResponseEntity<List<Map<String, Object>>> getDistribucionesPorEstadoPorMes() {
        return ResponseEntity.ok(distribucionService.countDistribucionesPorEstadoPorMes());
    }
        @GetMapping("/page")
    public Page<Distribucion> getDistribucionesPage(@PageableDefault(size = 10) Pageable pageable) {
        return distribucionService.findAll(pageable);
    }
}
