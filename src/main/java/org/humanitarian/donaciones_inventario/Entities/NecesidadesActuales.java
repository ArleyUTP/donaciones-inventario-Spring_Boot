package org.humanitarian.donaciones_inventario.Entities;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "necesidades_actuales")
@Getter
@Setter
public class NecesidadesActuales implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con categoría
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaInventario categoriaInventario;

    // Datos de necesidad
    @Column(name = "nombre_necesidad")
    private String nombreNecesidad;

    private String descripcion;

    @Column(name = "cantidad_necesaria")
    private int cantidadNecesaria;

    @Column(name = "unidad_medida")
    private String unidadMedida;

    private int prioridad;

    @Column(name = "fecha_limite")
    private LocalDate fechaLimite;

    private String estado;

    @Column(name = "beneficiarios_objetivo")
    private String beneficiariosObjetivo;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // Usuario que creó la necesidad (relación también controlada)
    @ManyToOne
    @JoinColumn(name = "creado_por_id", referencedColumnName = "id", nullable = false)
    private Usuario creadoPor;
}

