package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.DAO.IDistribucionRepository;
import org.humanitarian.donaciones_inventario.Entities.Distribucion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DistribucionService implements IDistribucionService {

    @Autowired
    private IDistribucionRepository distribucionRepository;

    @Override
    public Distribucion save(Distribucion distribucion) {
        return distribucionRepository.save(distribucion);
    }

    @Override
    public Distribucion update(Distribucion distribucion) {
        return distribucionRepository.save(distribucion);
    }

    @Override
    public void deleteById(Long id) {
        distribucionRepository.deleteById(id);
    }

    @Override
    public Distribucion findById(Long id) {
        return distribucionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Distribucion> findAll() {
        return distribucionRepository.findAll();
    }

    public List<Map<String, Object>> countDistribucionesPorEstadoPorMes() {
        List<Object[]> results = distribucionRepository.countDistribucionesPorEstadoPorMes();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("anio", row[0]);
            map.put("mes", row[1]);
            map.put("estado", row[2]);
            map.put("total", row[3]);
            response.add(map);
        }
        return response;
    }

}