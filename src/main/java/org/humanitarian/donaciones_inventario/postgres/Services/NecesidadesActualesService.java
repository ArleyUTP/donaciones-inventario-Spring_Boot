package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.DAO.INecesidadesActualesRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.NecesidadesActuales;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NecesidadesActualesService implements INecesidadesActualesService{

    @Autowired
    INecesidadesActualesRepository necesidadesActualesRepository;
    @Override
    public void deleteById(Long id) {
        necesidadesActualesRepository.deleteById(id);
    }

    @Override
    public List<NecesidadesActuales> findAll() {
        return (List<NecesidadesActuales>)necesidadesActualesRepository.findAll();
    }

    @Override
    public NecesidadesActuales findById(Long id) {
        return necesidadesActualesRepository.findById(id).orElse(null);
    }

    @Override
    public NecesidadesActuales save(NecesidadesActuales necesidadesActuales) {
        return necesidadesActualesRepository.save(necesidadesActuales);
    }

    @Override
    public NecesidadesActuales update(NecesidadesActuales necesidadesActuales) {
        return necesidadesActualesRepository.save(necesidadesActuales);
    }
    
}
