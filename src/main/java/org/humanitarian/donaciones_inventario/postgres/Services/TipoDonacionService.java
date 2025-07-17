package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.DAO.ITipoDonacionRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.TipoDonacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoDonacionService implements ITipoDonacionService{

    @Autowired
    private ITipoDonacionRepository tipoDonacionRepository;
    @Override
    public void deleteById(Long id) {
        tipoDonacionRepository.deleteById(id);
    }

    @Override
    public List<TipoDonacion> findAll() {
        return (List<TipoDonacion>) tipoDonacionRepository.findAll();
    }

    @Override
    public TipoDonacion findById(Long id) {
        return tipoDonacionRepository.findById(id).orElse(null);
    }

    @Override
    public TipoDonacion save(TipoDonacion tipoDonacion) {
        return tipoDonacionRepository.save(tipoDonacion);
    }

    @Override
    public TipoDonacion update(TipoDonacion tipoDonacion) {
        return tipoDonacionRepository.save(tipoDonacion);
    }
    
}
