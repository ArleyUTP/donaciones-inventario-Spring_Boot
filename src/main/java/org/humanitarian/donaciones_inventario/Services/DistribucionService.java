package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.DAO.IDistribucionRepository;
import org.humanitarian.donaciones_inventario.Entities.Distribucion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DistribucionService implements IDistribucionService {

    @Autowired
    private IDistribucionRepository distribucionRepository;

    @Override
    public Distribucion save(Distribucion distribucion) {
        return distribucionRepository.save(distribucion);
    }

    @Override
    public Distribucion update(Distribucion distribucion) {
        return distribucionRepository.save(distribucion);
    }

    @Override
    public void deleteById(Long id) {
        distribucionRepository.deleteById(id);
    }

    @Override
    public Distribucion findById(Long id) {
        return distribucionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Distribucion> findAll() {
        return distribucionRepository.findAll();
    }
}