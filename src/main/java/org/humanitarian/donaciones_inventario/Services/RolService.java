package org.humanitarian.donaciones_inventario.Services;

import java.util.ArrayList;
import java.util.List;

import org.humanitarian.donaciones_inventario.DAO.IRolRepository;
import org.humanitarian.donaciones_inventario.Entities.Rol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RolService implements IRolService{


    @Autowired
    private IRolRepository rolRepository;
    @Override
    public List<Rol> findAll() {
    try {
        return (List<Rol>)rolRepository.findAll();
    } catch (Exception e) {
        e.printStackTrace();
        // Retornar una lista vacía en caso de error
        return new ArrayList<>();
    }
    }
}
