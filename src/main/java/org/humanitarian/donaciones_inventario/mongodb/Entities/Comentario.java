package org.humanitarian.donaciones_inventario.mongodb.Entities;

import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "comentarios")
public class Comentario {
    @Id
    private String id;
    private String contenido;
    private Usuario usuario;
    private LocalDateTime fechaComentario;
}
