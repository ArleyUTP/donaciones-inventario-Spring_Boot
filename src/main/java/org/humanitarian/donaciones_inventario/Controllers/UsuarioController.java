package org.humanitarian.donaciones_inventario.Controllers;

import org.humanitarian.donaciones_inventario.Entities.Usuario;
import org.humanitarian.donaciones_inventario.Services.IRolService;
import org.humanitarian.donaciones_inventario.Services.IUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UsuarioController {

    private final IUsuarioService service;
    private final IRolService rolService;

    public UsuarioController(IUsuarioService service, IRolService rolService) {
        this.service = service;
        this.rolService = rolService;
    }

    @GetMapping("/GestionUsuarios")
    public String crear(Model model) {
        // Agrega logging para verificar los datos
        Usuario usuario = new Usuario();
        model.addAttribute("usuario", usuario);
        model.addAttribute("roles", rolService.findAll());
        model.addAttribute("usuarios", service.findAll());
        model.addAttribute("titulo", "Crear Usuario");
        return "GestionUsuarios";
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

    @GetMapping("/user/{id}")
    public String editar(@PathVariable(name = "id") Long id, Model model) {
        Usuario usuario = service.findById(id);
        model.addAttribute("usuario", usuario);
        model.addAttribute("roles", rolService.findAll());
        model.addAttribute("titulo", "Editar Usuario");
        return "GestionUsuarios";
    }

    @PostMapping("/create")
    public String guardar(Usuario usuario,BindingResult result) {
        if (result.hasErrors()) {
            return "GestionUsuarios";
        }
        service.save(usuario);
        return "redirect:index";
    }

    @GetMapping({ "/", "/home", "/index" })
    public String home() {
        return "index";
    }
}