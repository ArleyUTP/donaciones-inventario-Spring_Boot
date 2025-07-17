package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.postgres.Entities.Donacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IDonacionService {
    public Donacion save(Donacion donacion);
    public Donacion findById(Long id);
    public void deleteById(Long id);
    public List<Donacion> findAll();
    public Donacion update(Donacion donacion);
    public List<Map<String, Object>> getDonacionesPorMes();
    public List<Map<String, Object>> getDonacionesPorCategoria() ;
    public List<Map<String, Object>> countDonacionesPorEstado();
    public List<Map<String, Object>> countDonacionesPorTipo();
        Page<Donacion> findAll(Pageable pageable);
}
