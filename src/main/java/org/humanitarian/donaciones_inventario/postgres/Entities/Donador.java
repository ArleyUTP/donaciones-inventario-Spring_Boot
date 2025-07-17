package org.humanitarian.donaciones_inventario.Entities;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "donadores")
@Getter
@Setter
@NoArgsConstructor
public class Donador implements Serializable{
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "tipo_id")
    private TiposDonador tipoDonador;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(name = "nombre_donador")
    private String nombreDonador;

    @Column(name = "documento_identidad")
    private String documentoIdentidad;
    
    @Column(name = "pais_origen")
    private String paisOrigen;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "estado_activo")
    private Boolean estadoActivo;

    private String telefono;
    private String email;
}
