package org.humanitarian.donaciones_inventario.Controllers;

import java.util.List;

import org.humanitarian.donaciones_inventario.Entities.DetalleDistribucion;
import org.humanitarian.donaciones_inventario.Services.IDetalleDistribucionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/detalle-distribucion")
@CrossOrigin(origins = "http://localhost:5173")
public class DetalleDistribucionController {

    @Autowired
    private IDetalleDistribucionService detalleDistribucionService;

    @GetMapping("/by-distribucion/{distribucionId}")
    public List<DetalleDistribucion> getByDistribucion(@PathVariable Long distribucionId) {
        return detalleDistribucionService.findByDistribucionId(distribucionId);
    }
}