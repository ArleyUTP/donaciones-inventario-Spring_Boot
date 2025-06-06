package org.humanitarian.donaciones_inventario.Entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;


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
@Table(name = "donaciones")
@Setter
@Getter
public class Donacion implements Serializable{
     
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donador_id")
    private Donador donador;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "monto")
    private BigDecimal monto;

    @ManyToOne
    @JoinColumn(name = "tipo_donacion")
    private TipoDonacion tipoDonacion;

    @Column(name = "fecha_donacion")
    private LocalDateTime fechaDonacion;

    private String estado;

    @Column(name = "detalles_especie")
    private String detallesEspecie;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}
