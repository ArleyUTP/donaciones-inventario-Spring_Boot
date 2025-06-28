package org.humanitarian.donaciones_inventario.Services;

import org.humanitarian.donaciones_inventario.Entities.TiposBeneficiario;
import java.util.List;

public interface ITiposBeneficiarioService {
    TiposBeneficiario save(TiposBeneficiario tipo);
    TiposBeneficiario update(TiposBeneficiario tipo);
    void deleteById(Long id);
    TiposBeneficiario findById(Long id);
    List<TiposBeneficiario> findAll();
}