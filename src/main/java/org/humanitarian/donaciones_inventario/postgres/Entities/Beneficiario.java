package org.humanitarian.donaciones_inventario.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiarios")
@Getter
@Setter
public class Beneficiario implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con tipos_beneficiario
    @ManyToOne
    @JoinColumn(name = "tipo")
    private TiposBeneficiario tipo;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "ubicacion")
    private String ubicacion;

    @Column(name = "personas_afectadas")
    private Integer personasAfectadas;

    @Column(name = "prioridad")
    private Integer prioridad;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
}