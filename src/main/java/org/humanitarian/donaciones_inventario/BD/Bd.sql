-- Crear tabla de roles
CREATE TABLE public.roles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL UNIQUE
);

-- Crear tabla de usuarios
CREATE TABLE public.usuarios (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre_usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    nombre_completo TEXT,
    email TEXT UNIQUE,
    ultimo_acceso TIMESTAMP,
    telefono TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol_id BIGINT REFERENCES public.roles(id) ON DELETE SET NULL
);

-- Crear tabla de donadores
CREATE TABLE public.donadores (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES public.usuarios(id) ON DELETE SET NULL,
    tipo_id BIGINT REFERENCES public.tipos_donador(id) ON DELETE SET NULL
);

-- Crear tabla de beneficiarios
CREATE TABLE public.beneficiarios (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tipo TEXT,
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    personas_afectadas INTEGER,
    prioridad INTEGER,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de recursos de inventario
CREATE TABLE public.recursosinventario (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    donacion_id BIGINT REFERENCES public.donaciones(id) ON DELETE SET NULL,
    categoria TEXT,
    nombre TEXT NOT NULL,
    cantidad INTEGER,
    unidad_medida TEXT,
    fecha_vencimiento DATE,
    ubicacion_almacen TEXT,
    estado TEXT
);

-- Crear tabla de distribuciones
CREATE TABLE public.distribuciones (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    beneficiario_id BIGINT REFERENCES public.beneficiarios(id) ON DELETE SET NULL,
    usuario_id BIGINT REFERENCES public.usuarios(id) ON DELETE SET NULL,
    fecha_programada TIMESTAMP,
    fecha_entrega TIMESTAMP,
    estado TEXT,
    responsable TEXT
);

-- Crear tabla de detalle de distribuciones
CREATE TABLE public.detalledistribucion (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    distribucion_id BIGINT REFERENCES public.distribuciones(id) ON DELETE SET NULL,
    recurso_id BIGINT REFERENCES public.recursosinventario(id) ON DELETE SET NULL,
    cantidad INTEGER,
    estado TEXT
);

-- Crear tabla de tipos de donador
CREATE TABLE public.tipos_donador (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tipo TEXT NOT NULL UNIQUE
);

-- Crear tabla de categorías de inventario
CREATE TABLE public.categorias_inventario (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    categoria TEXT NOT NULL UNIQUE
);

-- Crear tabla de inventario
CREATE TABLE public.inventario (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    donacion_id BIGINT REFERENCES public.donaciones(id) ON DELETE SET NULL,
    categoria_id BIGINT REFERENCES public.categorias_inventario(id) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    cantidad INTEGER,
    unidad_medida TEXT,
    fecha_vencimiento DATE,
    ubicacion_almacen TEXT,
    estado TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de donaciones
CREATE TABLE public.donaciones (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    donador_id BIGINT REFERENCES public.donadores(id) ON DELETE SET NULL,
    usuario_id BIGINT REFERENCES public.usuarios(id) ON DELETE SET NULL,
    monto NUMERIC(10,2),
    tipo_donacion_id BIGINT REFERENCES public.tipos_donacion(id) ON DELETE SET NULL,
    fecha_donacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TEXT,
    comprobante TEXT,
    detalles_especie TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de voluntarios
CREATE TABLE public.voluntarios (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    usuario_id BIGINT REFERENCES public.usuarios(id) ON DELETE CASCADE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tareas_asignadas TEXT,
    historial_participacion TEXT
);