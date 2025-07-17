package org.humanitarian.donaciones_inventario.postgres.DTO;

import lombok.Data;

@Data
public class UbicacionDTO {
    private Double lat;
    private Double lng;
    private String direccion;
    private String referencia;
}
