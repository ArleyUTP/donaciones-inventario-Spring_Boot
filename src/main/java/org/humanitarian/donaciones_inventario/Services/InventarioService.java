package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.DAO.IInventarioRepository;
import org.humanitarian.donaciones_inventario.Entities.Inventario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventarioService implements IInventarioService {

    @Autowired
    private IInventarioRepository inventarioRepository;

    @Override
    public Inventario save(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    @Override
    public Inventario update(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    @Override
    public void deleteById(Long id) {
        inventarioRepository.deleteById(id);
    }

    @Override
    public Inventario findById(Long id) {
        return inventarioRepository.findById(id).orElse(null);
    }

    @Override
    public List<Inventario> findAll() {
        return inventarioRepository.findAll();
    }
    @Override
public Page<Inventario> findAll(Pageable pageable) {
    return inventarioRepository.findAll(pageable);
}
}