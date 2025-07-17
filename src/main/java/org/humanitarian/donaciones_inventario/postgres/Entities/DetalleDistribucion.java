package org.humanitarian.donaciones_inventario.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "detalle_distribucion")
@Getter
@Setter
public class DetalleDistribucion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "distribucion_id")
    private Distribucion distribucion;

    @ManyToOne
    @JoinColumn(name = "inventario_id")
    private Inventario inventario;

    private Integer cantidad;

    private String estado;
}