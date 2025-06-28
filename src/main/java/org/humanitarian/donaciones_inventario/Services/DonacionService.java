package org.humanitarian.donaciones_inventario.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.humanitarian.donaciones_inventario.DAO.IDonacionesRepository;
import org.humanitarian.donaciones_inventario.Entities.Donacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonacionService implements IDonacionService {

    @Autowired
    private IDonacionesRepository donacionesRepository;

    @Override
    public void deleteById(Long id) {
        donacionesRepository.deleteById(id);
    }

    @Override
    public List<Donacion> findAll() {
        return (List<Donacion>) donacionesRepository.findAll();
    }

    @Override
    public Donacion findById(Long id) {
        return donacionesRepository.findById(id).orElse(null);
    }

    @Override
    public Donacion save(Donacion donacion) {
        return donacionesRepository.save(donacion);
    }

    @Override
    public Donacion update(Donacion donacion) {
        return donacionesRepository.save(donacion);
    }

    @Override
    public List<Map<String, Object>> getDonacionesPorMes() {
        List<Object[]> results = donacionesRepository.countDonacionesPorMes();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("anio", row[0]);
            map.put("mes", row[1]);
            map.put("total", row[2]);
            response.add(map);
        }
        return response;
    }

    @Override
    public List<Map<String, Object>> getDonacionesPorCategoria() {
        List<Object[]> results = donacionesRepository.countDonacionesByCategoria();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("categoria", row[0]);
            map.put("total", row[1]);
            response.add(map);
        }
        return response;
    }

    @Override
    public List<Map<String, Object>> countDonacionesPorEstado() {
        List<Object[]> results = donacionesRepository.countDonacionesByEstado();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("estado", row[0]);
            map.put("total", row[1]);
            response.add(map);
        }
        return response;
    }

    @Override
    public List<Map<String, Object>> countDonacionesPorTipo() {
        List<Object[]> results = donacionesRepository.countDonacionesByTipo();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("tipo", row[0]);
            map.put("total", row[1]);
            response.add(map);
        }
        return response;
    }
}
