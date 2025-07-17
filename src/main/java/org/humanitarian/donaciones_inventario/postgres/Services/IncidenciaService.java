package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.DAO.IIncidenciaRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.Incidencia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidenciaService implements IIncidenciaService {

    @Autowired
    private IIncidenciaRepository repository;

    @Override
    public Incidencia save(Incidencia incidencia) {
        return repository.save(incidencia);
    }

    @Override
    public Incidencia update(Incidencia incidencia) {
        return repository.save(incidencia);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Incidencia findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Incidencia> findAll() {
        return repository.findAll();
    }
}