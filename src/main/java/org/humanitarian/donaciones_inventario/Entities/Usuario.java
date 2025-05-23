package org.humanitarian.donaciones_inventario.Entities;

import java.io.Serializable;
import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name = "usuarios")
public class Usuario implements Serializable{

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre_usuario")
    private String nombreUsuario;
    @NotEmpty(message = "La contraseña no puede estar vacía")
    private String contrasena;
    @Column(name = "nombre_completo")
    private String nombreCompleto;
    private String email;
    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;
    private String telefono;
    @Column(name = "es_donador")
    private boolean esDonador;
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    // @ManyToMany es para muchos a muchos
    // @ManyToOne es para muchos a uno
    @OneToOne
    @JoinColumn(name = "rol_id")
    //@JoinColumn permite especificar el nombre de la columna en la tabla de usuarios
    // que se relaciona con la tabla de roles
    //@ModelAttribute(name = "ids") String ids permitira traer un conjunto de id si es una relacion de muchos formato 1,2,3
    private Rol rol;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    public String getContrasena() {
        return contrasena;
    }
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public LocalDateTime getUltimoAcceso() {
        return ultimoAcceso;
    }
    public void setUltimoAcceso(LocalDateTime ultimoAcceso) {
        this.ultimoAcceso = ultimoAcceso;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public boolean isEsDonador() {
        return esDonador;
    }
    public void setEsDonador(boolean esDonador) {
        this.esDonador = esDonador;
    }
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
    }
    
}
