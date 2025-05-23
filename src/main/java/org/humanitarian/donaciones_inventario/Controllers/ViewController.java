package org.humanitarian.donaciones_inventario.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class ViewController {
    
    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/registro")
    public String registro() {
        return "registro";
    }
    
    @GetMapping("/dashboard")
    public String dashboard() {
        // Aquí podrías agregar lógica para verificar si el usuario está autenticado
        return "dashboard";
    }
    
    @GetMapping("/donaciones")
    public String donaciones() {
        return "donaciones";
    }
    
    @GetMapping("/inventario")
    public String inventario() {
        return "inventario";
    }
    
}
