package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.DAO.ITiposDonadorRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.TiposDonador;
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
