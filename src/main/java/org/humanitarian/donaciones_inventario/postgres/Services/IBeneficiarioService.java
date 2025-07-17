package org.humanitarian.donaciones_inventario.postgres.Services;

import org.humanitarian.donaciones_inventario.postgres.Entities.Beneficiario;
import java.util.List;
import java.util.Map;

public interface IBeneficiarioService {
    Beneficiario save(Beneficiario beneficiario);
    Beneficiario update(Beneficiario beneficiario);
    void deleteById(Long id);
    Beneficiario findById(Long id);
    List<Beneficiario> findAll();
}