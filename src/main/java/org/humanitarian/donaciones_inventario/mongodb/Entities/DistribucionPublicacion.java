package org.humanitarian.donaciones_inventario.mongodb.Entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "distribuciones_publicaciones")
public class DistribucionPublicacion {
    @Id
    private String id;
    
    // Información de la distribución
    private Long distribucionId;
    private String beneficiarioNombre;
    private String beneficiarioTipo;
    private String ubicacion;
    private LocalDateTime fechaDistribucion;
    private List<String> itemsDistribuidos;
    
    // Información de la publicación
    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private UsuarioPublicacion usuarioCreador;
    private List<Comentario> comentarios;
    private LocalDateTime fechaPublicacion;
    private Integer likes;
    private Integer vistas;
    
    // Estado de la publicación
    private Boolean esPublica;
    private String estado;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class UsuarioPublicacion {
    private Long usuarioId;
    private String nombre;
    private String rol;
    private String fotoPerfil;
}
