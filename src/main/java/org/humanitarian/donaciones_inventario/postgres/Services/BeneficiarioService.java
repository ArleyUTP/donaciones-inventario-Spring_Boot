package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.DAO.IBeneficiarioRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.Beneficiario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiarioService implements IBeneficiarioService {

    @Autowired
    private IBeneficiarioRepository beneficiarioRepository;

    @Override
    public Beneficiario save(Beneficiario beneficiario) {
        return beneficiarioRepository.save(beneficiario);
    }

    @Override
    public Beneficiario update(Beneficiario beneficiario) {
        return beneficiarioRepository.save(beneficiario);
    }

    @Override
    public void deleteById(Long id) {
        beneficiarioRepository.deleteById(id);
    }

    @Override
    public Beneficiario findById(Long id) {
        return beneficiarioRepository.findById(id).orElse(null);
    }

    @Override
    public List<Beneficiario> findAll() {
        return beneficiarioRepository.findAll();
    }
    
}