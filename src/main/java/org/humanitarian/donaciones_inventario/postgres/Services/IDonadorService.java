package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.Entities.Donador;

public interface IDonadorService {
    public Donador save(Donador donador);
    public Donador findById(Long id);
    public void deleteById(Long id);
    public List<Donador> findAll();
    public Donador update(Donador donador);
    public Donador findByUsuarioId(Long usuarioId);
}
