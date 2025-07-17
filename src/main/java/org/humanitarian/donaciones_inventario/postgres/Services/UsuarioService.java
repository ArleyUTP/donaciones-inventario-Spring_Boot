package org.humanitarian.donaciones_inventario.postgres.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.humanitarian.donaciones_inventario.postgres.DAO.IUsuarioRepository;
import org.humanitarian.donaciones_inventario.postgres.Entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService  implements IUsuarioService {
      @Autowired
    private IUsuarioRepository usuarioRepository;
    
    @Override
    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public List<Usuario> findAll() {
        return (List<Usuario>) usuarioRepository.findAll();
    }

    @Override
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Override
    public void save(Usuario usuario) {
        usuarioRepository.save(usuario);
    }
    
    
    @Override
    public Usuario register(Usuario usuario) {
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setUltimoAcceso(LocalDateTime.now());
        return usuarioRepository.save(usuario);
    }
    
    @Override
    public Usuario update(Usuario usuario) {
        Usuario existingUsuario = usuarioRepository.findById(usuario.getId()).orElse(null);
        if (existingUsuario != null) {
            return usuarioRepository.save(usuario);
        }
        return null;
    }
    
    @Override
    public void softDelete(Long id) {
        // Usuario usuario = usuarioRepository.findById(id).orElse(null);
        // if (usuario != null) {
        //     usuario.setRolId(id); // Asumiendo que 0 es el ID para "eliminado"
        //     usuarioRepository.save(usuario);
        // }
    }

    @Override
    public Usuario findByNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }
}
