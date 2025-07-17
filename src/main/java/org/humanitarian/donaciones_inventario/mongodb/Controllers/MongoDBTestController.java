package org.humanitarian.donaciones_inventario.mongodb.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mongodb")
public class MongoDBTestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/test-connection")
    public ResponseEntity<String> testConnection() {
        try {
            // Intenta listar las colecciones para verificar la conexión
            mongoTemplate.getCollectionNames().forEach(System.out::println);
            return ResponseEntity.ok("Conexión exitosa con MongoDB!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al conectar con MongoDB: " + e.getMessage());
        }
    }

    @GetMapping("/database-info")
    public ResponseEntity<String> getDatabaseInfo() {
        try {
            String databaseName = mongoTemplate.getDb().getName();
            return ResponseEntity.ok("Conectado a la base de datos: " + databaseName);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener información de la base de datos: " + e.getMessage());
        }
    }
}
