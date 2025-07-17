package org.humanitarian.donaciones_inventario.postgres.Services;

import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;

public interface IUsuarioService {
    public void save(Usuario usuario);
    public Usuario findById(Long id);
    public void deleteById(Long id);
    public List<Usuario> findAll();
    public Usuario register(Usuario usuario);
    public Usuario update(Usuario usuario);
    public void softDelete(Long id);
    Usuario findByNombreUsuario(String nombreUsuario);
}
