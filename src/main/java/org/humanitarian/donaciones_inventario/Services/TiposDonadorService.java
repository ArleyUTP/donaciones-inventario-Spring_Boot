package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.DAO.ITiposDonadorRepository;
import org.humanitarian.donaciones_inventario.Entities.TiposDonador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TiposDonadorService implements ITiposDonadorService{

    @Autowired
    private ITiposDonadorRepository tiposDonadorRepository;
    @Override
    public void deleteById(Long id) {
        tiposDonadorRepository.deleteById(id);
    }

    @Override
    public List<TiposDonador> findAll() {
        return (List<TiposDonador>) tiposDonadorRepository.findAll();
    }

    @Override
    public TiposDonador findById(Long id) {
        return tiposDonadorRepository.findById(id).orElse(null);
    }

    @Override
    public void save(TiposDonador tipoDonador) {
        tiposDonadorRepository.save(tipoDonador);
    }
}
