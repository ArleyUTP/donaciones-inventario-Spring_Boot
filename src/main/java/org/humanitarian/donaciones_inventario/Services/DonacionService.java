package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.DAO.IDonacionesRepository;
import org.humanitarian.donaciones_inventario.Entities.Donacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonacionService implements IDonacionService{

    @Autowired
    private IDonacionesRepository donacionesRepository;
    @Override
    public void deleteById(Long id) {
        donacionesRepository.deleteById(id);
    }

    @Override
    public List<Donacion> findAll() {
        return (List<Donacion>) donacionesRepository.findAll();
    }

    @Override
    public Donacion findById(Long id) {
        return donacionesRepository.findById(id).orElse(null);
    }

    @Override
    public Donacion save(Donacion donacion) {
        return donacionesRepository.save(donacion);
    }

    @Override
    public Donacion update(Donacion donacion) {
        return donacionesRepository.save(donacion);
    }
    
}
