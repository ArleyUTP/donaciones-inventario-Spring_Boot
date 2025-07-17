package org.humanitarian.donaciones_inventario.mongodb.Entities;

import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "publicaciones")
public class Publicacion {
    @Id
    private String id;
    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private Usuario usuarioCreador;
    private List<Comentario> comentarios;
    private LocalDateTime fechaCreacion;
}
