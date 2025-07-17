package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.Entities.Voluntario;

import java.util.List;

public interface IVoluntarioService {
    public Voluntario save(Voluntario voluntario);
    public Voluntario findById(Long id);
    public void deleteById(Long id);
    public List<Voluntario> findAll();
    public Voluntario update(Voluntario voluntario);
}

