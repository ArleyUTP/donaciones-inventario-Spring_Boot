package org.humanitarian.donaciones_inventario.postgres.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Getter
@Setter
public class Notificacion implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


    private String titulo;
    private String mensaje;
    private String tipo;
    private boolean leido;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}
