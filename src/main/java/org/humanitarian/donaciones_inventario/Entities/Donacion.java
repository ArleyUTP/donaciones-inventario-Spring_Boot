package org.humanitarian.donaciones_inventario.Entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.humanitarian.donaciones_inventario.DTO.UbicacionDTO;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

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
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Setter
@Getter
public class Donacion implements Serializable {

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

    @ManyToOne
    @JoinColumn(name = "categoria_inventario_id")
    private CategoriaInventario categoria;
    @JsonIgnore
    @Column(columnDefinition = "geography(Point,4326)")
    private Point ubicacionRecojo;

    @JsonProperty("ubicacion")
    public UbicacionDTO getUbicacionDTO() {
        if (ubicacionRecojo != null) {
            UbicacionDTO dto = new UbicacionDTO();
            dto.setLat(ubicacionRecojo.getY());
            dto.setLng(ubicacionRecojo.getX());
            dto.setDireccion(direccionRecojo);
            dto.setReferencia(referenciaRecojo);
            return dto;
        }
        return null;
    }

    @Column(name = "direccion_recojo")
    private String direccionRecojo;

    @Column(name = "referencia_recojo")
    private String referenciaRecojo;

    @ManyToOne
    @JoinColumn(name = "necesidad_id")
    private NecesidadesActuales necesidadAsociada;

    public void setMonto(Object monto) {
        if (monto instanceof String) {
            this.monto = new BigDecimal((String) monto);
        } else if (monto instanceof Number) {
            this.monto = BigDecimal.valueOf(((Number) monto).doubleValue());
        } else if (monto != null) {
            this.monto = new BigDecimal(monto.toString());
        }
    }

    public void setUbicacionRecojo(Map<String, Double> location) {
        if (location != null) {
            try {
                GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
                this.ubicacionRecojo = geometryFactory.createPoint(
                        new Coordinate(location.get("x"), location.get("y")));
            } catch (Exception e) {
                throw new IllegalArgumentException("Error al crear el punto geográfico: " + e.getMessage());
            }
        }
    }

    public Map<String, Double> getCoordenadas() {
        if (ubicacionRecojo != null) {
            Map<String, Double> coords = new HashMap<>();
            coords.put("lat", ubicacionRecojo.getY());
            coords.put("lng", ubicacionRecojo.getX());
            return coords;
        }
        return null;
    }
}
