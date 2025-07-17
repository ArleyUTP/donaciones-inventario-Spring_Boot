package org.humanitarian.donaciones_inventario.postgres.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "distribuciones")
@Getter
@Setter
public class Distribucion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relaciones
    @ManyToOne
    @JoinColumn(name = "beneficiario_id")
    private Beneficiario beneficiario;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "fecha_programada")
    private LocalDateTime fechaProgramada;

    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    @Column(name = "estado")
    private String estado; // PROGRAMADA, ENTREGADA, CANCELADA

    @ManyToOne
    @JoinColumn(name = "responsable_id")
    private Usuario responsable;

    @Column(name = "calificacion")
    private Short calificacion;

    @Column(name = "observaciones")
    private String observaciones;
}