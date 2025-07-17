package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.DAO.IVoluntarioRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.Voluntario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoluntarioService implements IVoluntarioService{

    @Autowired
    IVoluntarioRepository voluntarioRepository;
    @Override
    public Voluntario save(Voluntario voluntario) {
        return voluntarioRepository.save(voluntario);
    }

    @Override
    public Voluntario findById(Long id) {
        return voluntarioRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        voluntarioRepository.deleteById(id);
    }

    @Override
    public List<Voluntario> findAll() {
        return (List<Voluntario>) voluntarioRepository.findAll();
    }

    @Override
    public Voluntario update(Voluntario voluntario) {
        return voluntarioRepository.save(voluntario);
    }

}
