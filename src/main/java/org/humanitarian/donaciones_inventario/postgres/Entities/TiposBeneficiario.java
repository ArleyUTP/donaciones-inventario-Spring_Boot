package org.humanitarian.donaciones_inventario.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "tipos_beneficiario")
@Getter
@Setter
public class TiposBeneficiario implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo", unique = true, length = 100)
    private String tipo;
}