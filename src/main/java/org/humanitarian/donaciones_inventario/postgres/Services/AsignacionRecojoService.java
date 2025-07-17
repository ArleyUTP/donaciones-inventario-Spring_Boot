package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.DAO.IAsignacionRecojoRepository;
import org.humanitarian.donaciones_inventario.Entities.AsignacionRecojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AsignacionRecojoService implements IAsignacionRecojoService{

     @Autowired
    private IAsignacionRecojoRepository asignacionRecojoRepository;
    @Override
    public void delete(Long id) {
        asignacionRecojoRepository.deleteById(id);
    }

    @Override
    public List<AsignacionRecojo> getAll() {
       return (List<AsignacionRecojo>) asignacionRecojoRepository.findAll();
    }

    @Override
    public AsignacionRecojo getById(Long id) {
        return asignacionRecojoRepository.findById(id).orElse(null);
    }

    @Override
    public AsignacionRecojo save(AsignacionRecojo asignacionRecojo) {
        return asignacionRecojoRepository.save(asignacionRecojo);
    }

    @Override
    public AsignacionRecojo update(AsignacionRecojo asignacionRecojo) {
        return asignacionRecojoRepository.save(asignacionRecojo);
    }
    
}
