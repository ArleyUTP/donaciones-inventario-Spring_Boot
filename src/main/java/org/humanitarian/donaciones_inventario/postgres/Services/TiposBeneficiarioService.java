package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.DAO.ITiposBeneficiarioRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.TiposBeneficiario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TiposBeneficiarioService implements ITiposBeneficiarioService {

    @Autowired
    private ITiposBeneficiarioRepository tiposBeneficiarioRepository;

    @Override
    public TiposBeneficiario save(TiposBeneficiario tipo) {
        return tiposBeneficiarioRepository.save(tipo);
    }

    @Override
    public TiposBeneficiario update(TiposBeneficiario tipo) {
        return tiposBeneficiarioRepository.save(tipo);
    }

    @Override
    public void deleteById(Long id) {
        tiposBeneficiarioRepository.deleteById(id);
    }

    @Override
    public TiposBeneficiario findById(Long id) {
        return tiposBeneficiarioRepository.findById(id).orElse(null);
    }

    @Override
    public List<TiposBeneficiario> findAll() {
        return tiposBeneficiarioRepository.findAll();
    }
}