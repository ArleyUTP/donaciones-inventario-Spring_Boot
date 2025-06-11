package org.humanitarian.donaciones_inventario.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.DAO.IDonadoresRepository;
import org.humanitarian.donaciones_inventario.Entities.Donador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonadorService implements IDonadorService{

    @Autowired
    private IDonadoresRepository donadoresRepository;
    @Override
    public void deleteById(Long id) {
        donadoresRepository.deleteById(id);
    }

    @Override
    public List<Donador> findAll() {
        return (List<Donador>) donadoresRepository.findAll();
    }

    @Override
    public Donador findById(Long id) {
        return donadoresRepository.findById(id).orElse(null);
    }

    @Override
    public Donador save(Donador donador) {
        return (Donador) donadoresRepository.save(donador);
    }

    @Override
    public Donador update(Donador donador) {
    Donador existingDonador = donadoresRepository.findById(donador.getId()).orElse(null);
        if (existingDonador != null) {
            return donadoresRepository.save(donador);
        }
        return null;
    }
    @Override
    public Donador findByUsuarioId(Long usuarioId) {
        return donadoresRepository.findByUsuarioId(usuarioId);
    }
}
