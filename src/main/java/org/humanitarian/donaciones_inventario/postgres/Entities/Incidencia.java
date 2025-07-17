package org.humanitarian.donaciones_inventario.postgres.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidencias")
@Getter
@Setter
public class Incidencia implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "distribucion_id")
    private Distribucion distribucion;

    @ManyToOne
    @JoinColumn(name = "usuario_reporta_id")
    private Usuario usuarioReporta;

    private String tipoIncidencia;
    private String descripcion;
    private String gravedad;
    private String estado;
    private LocalDateTime fechaIncidencia;
    private LocalDateTime fechaResolucion;
    private String solucion;
}