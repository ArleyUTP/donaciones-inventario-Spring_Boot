package org.humanitarian.donaciones_inventario.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
@Getter
@Setter
public class Inventario implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Donacion
    @ManyToOne
    @JoinColumn(name = "donacion_id")
    private Donacion donacion;

    // Relación con CategoriaInventario
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private CategoriaInventario categoria;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "unidad_medida")
    private String unidadMedida;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "ubicacion_almacen")
    private String ubicacionAlmacen;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}