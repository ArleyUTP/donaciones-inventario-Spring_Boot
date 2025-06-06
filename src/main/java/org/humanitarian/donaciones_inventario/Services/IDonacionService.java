package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.Entities.Donacion;

public interface IDonacionService {
    public Donacion save(Donacion donacion);
    public Donacion findById(Long id);
    public void deleteById(Long id);
    public List<Donacion> findAll();
    public Donacion update(Donacion donacion);
}
