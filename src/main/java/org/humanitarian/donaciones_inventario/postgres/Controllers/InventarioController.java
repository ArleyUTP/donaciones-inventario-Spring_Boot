package org.humanitarian.donaciones_inventario.postgres.Controllers;

import org.humanitarian.donaciones_inventario.postgres.Entities.Inventario;
import org.humanitarian.donaciones_inventario.postgres.Services.IInventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
@CrossOrigin(origins = "http://localhost:5173")
public class InventarioController {

    @Autowired
    private IInventarioService inventarioService;

    @GetMapping("/page")
    public Page<Inventario> getInventarioPage(@PageableDefault(size = 10) Pageable pageable) {
        return inventarioService.findAll(pageable);
    }

    @GetMapping("/all")
    public List<Inventario> getAllInventario() {
        return inventarioService.findAll();
    }

    @GetMapping("/{id}")
    public Inventario getInventarioById(@PathVariable Long id) {
        return inventarioService.findById(id);
    }

    @PostMapping("/create")
    public Inventario createInventario(@RequestBody Inventario inventario) {
        return inventarioService.save(inventario);
    }

    @PutMapping("/update/{id}")
    public Inventario updateInventario(@PathVariable Long id, @RequestBody Inventario inventario) {
        inventario.setId(id);
        return inventarioService.update(inventario);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteInventario(@PathVariable Long id) {
        inventarioService.deleteById(id);
    }
}