package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.DAO.IDetalleDistribucionRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.DetalleDistribucion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleDistribucionService implements IDetalleDistribucionService {

    @Autowired
    private IDetalleDistribucionRepository repository;

    @Override
    public DetalleDistribucion save(DetalleDistribucion detalle) {
        return repository.save(detalle);
    }

    @Override
    public DetalleDistribucion update(DetalleDistribucion detalle) {
        return repository.save(detalle);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public DetalleDistribucion findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<DetalleDistribucion> findAll() {
        return repository.findAll();
    }

    @Override
    public List<DetalleDistribucion> findByDistribucionId( Long distribucionId) {
        return repository.findByDistribucionId(distribucionId);
    }
}