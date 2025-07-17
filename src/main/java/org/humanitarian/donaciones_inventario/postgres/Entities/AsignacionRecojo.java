package org.humanitarian.donaciones_inventario.Entities;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "asignaciones_recojo")
@Getter
@Setter
public class AsignacionRecojo implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RELACIÓN CON DONACION
    @ManyToOne
    @JoinColumn(name = "donacion_id")
    private Donacion donacion;

    // RELACIÓN CON VOLUNTARIO
    @ManyToOne
    @JoinColumn(name = "voluntario_id")
    private Voluntario voluntario;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;

    @Column(name = "fecha_aceptacion")
    private LocalDateTime fechaAceptacion;

    @Column(name = "fecha_rechazo")
    private LocalDateTime fechaRechazo;

    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    private String estado;

    private String observaciones;
}
