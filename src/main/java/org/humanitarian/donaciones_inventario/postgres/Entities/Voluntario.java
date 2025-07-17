package org.humanitarian.donaciones_inventario.postgres.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "voluntarios")
@Getter
@Setter
public class Voluntario implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    private String especialidad;

    private Boolean disponibilidad;

    @Column(name = "estado_activo")
    private Boolean estadoActivo;
}
