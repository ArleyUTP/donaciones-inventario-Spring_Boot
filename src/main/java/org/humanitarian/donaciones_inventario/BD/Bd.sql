-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.beneficiarios (
  id bigint NOT NULL DEFAULT nextval('beneficiarios_id_seq'::regclass),
  tipo bigint,
  nombre character varying NOT NULL,
  ubicacion character varying,
  personas_afectadas integer CHECK (personas_afectadas >= 0),
  prioridad integer CHECK (prioridad >= 1 AND prioridad <= 5),
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT beneficiarios_pkey PRIMARY KEY (id),
  CONSTRAINT beneficiarios_tipo_fkey FOREIGN KEY (tipo) REFERENCES public.tipos_beneficiario(id)
);
CREATE TABLE public.categorias_inventario (
  id bigint NOT NULL DEFAULT nextval('categorias_inventario_id_seq'::regclass),
  categoria character varying NOT NULL UNIQUE,
  descripcion text,
  CONSTRAINT categorias_inventario_pkey PRIMARY KEY (id)
);
CREATE TABLE public.detalle_distribucion (
  id bigint NOT NULL DEFAULT nextval('detalle_distribucion_id_seq'::regclass),
  distribucion_id bigint,
  inventario_id bigint,
  cantidad integer CHECK (cantidad > 0),
  estado character varying DEFAULT 'PENDIENTE'::character varying,
  CONSTRAINT detalle_distribucion_pkey PRIMARY KEY (id),
  CONSTRAINT detalle_distribucion_distribucion_id_fkey FOREIGN KEY (distribucion_id) REFERENCES public.distribuciones(id),
  CONSTRAINT detalle_distribucion_inventario_id_fkey FOREIGN KEY (inventario_id) REFERENCES public.inventario(id)
);
CREATE TABLE public.distribuciones (
  id bigint NOT NULL DEFAULT nextval('distribuciones_id_seq'::regclass),
  beneficiario_id bigint,
  usuario_id bigint,
  fecha_programada timestamp without time zone,
  fecha_entrega timestamp without time zone,
  estado character varying DEFAULT 'PROGRAMADA'::character varying,
  responsable_id bigint,
  calificacion smallint,
  observaciones text,
  CONSTRAINT distribuciones_pkey PRIMARY KEY (id),
  CONSTRAINT distribuciones_beneficiario_id_fkey FOREIGN KEY (beneficiario_id) REFERENCES public.beneficiarios(id),
  CONSTRAINT distribuciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT distribuciones_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.donaciones (
  id bigint NOT NULL DEFAULT nextval('donaciones_id_seq'::regclass),
  donador_id bigint,
  usuario_id bigint,
  monto numeric,
  tipo_donacion bigint,
  fecha_donacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  estado character varying DEFAULT 'PENDIENTE'::character varying,
  detalles_especie text,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT donaciones_pkey PRIMARY KEY (id),
  CONSTRAINT donaciones_donador_id_fkey FOREIGN KEY (donador_id) REFERENCES public.donadores(id),
  CONSTRAINT donaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT donaciones_tipo_donacion_fkey FOREIGN KEY (tipo_donacion) REFERENCES public.tipos_donacion(id)
);
CREATE TABLE public.donadores (
  id bigint NOT NULL DEFAULT nextval('donadores_id_seq'::regclass),
  usuario_id bigint,
  tipo_id bigint,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  nombre_donador character varying,
  documento_identidad character varying,
  pais_origen character varying,
  observaciones text,
  estado_activo boolean,
  telefono text UNIQUE,
  email text UNIQUE,
  CONSTRAINT donadores_pkey PRIMARY KEY (id),
  CONSTRAINT donadores_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT donadores_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.tipos_donador(id)
);
CREATE TABLE public.incidencias (
  id bigint NOT NULL DEFAULT nextval('incidencias_id_seq'::regclass),
  distribucion_id bigint,
  usuario_reporta_id bigint,
  tipo_incidencia character varying,
  descripcion text NOT NULL,
  gravedad character varying DEFAULT 'MEDIA'::character varying,
  estado character varying DEFAULT 'ABIERTA'::character varying,
  fecha_incidencia timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion timestamp without time zone,
  solucion text,
  CONSTRAINT incidencias_pkey PRIMARY KEY (id),
  CONSTRAINT incidencias_distribucion_id_fkey FOREIGN KEY (distribucion_id) REFERENCES public.distribuciones(id),
  CONSTRAINT incidencias_usuario_reporta_id_fkey FOREIGN KEY (usuario_reporta_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.inventario (
  id bigint NOT NULL DEFAULT nextval('inventario_id_seq'::regclass),
  donacion_id bigint,
  categoria_id bigint,
  nombre character varying NOT NULL,
  cantidad integer CHECK (cantidad >= 0),
  unidad_medida character varying,
  fecha_vencimiento date,
  ubicacion_almacen character varying,
  estado character varying DEFAULT 'DISPONIBLE'::character varying,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT inventario_pkey PRIMARY KEY (id),
  CONSTRAINT inventario_donacion_id_fkey FOREIGN KEY (donacion_id) REFERENCES public.donaciones(id),
  CONSTRAINT inventario_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_inventario(id)
);
CREATE TABLE public.necesidades_actuales (
  id bigint NOT NULL DEFAULT nextval('necesidades_actuales_id_seq'::regclass),
  categoria_id bigint,
  nombre_necesidad character varying NOT NULL,
  descripcion text,
  cantidad_necesaria integer,
  unidad_medida character varying,
  prioridad integer CHECK (prioridad >= 1 AND prioridad <= 5),
  fecha_limite date,
  estado character varying DEFAULT 'ACTIVA'::character varying,
  beneficiarios_objetivo text,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  creado_por_id bigint,
  CONSTRAINT necesidades_actuales_pkey PRIMARY KEY (id),
  CONSTRAINT necesidades_actuales_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_inventario(id),
  CONSTRAINT necesidades_actuales_creado_por_id_fkey FOREIGN KEY (creado_por_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.reportes_actividad (
  id bigint NOT NULL DEFAULT nextval('reportes_actividad_id_seq'::regclass),
  tarea_id bigint,
  voluntario_id bigint,
  avance_porcentaje integer CHECK (avance_porcentaje >= 0 AND avance_porcentaje <= 100),
  descripcion_avance text,
  evidencias_multimedia text,
  fecha_reporte timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  ubicacion_gps character varying,
  CONSTRAINT reportes_actividad_pkey PRIMARY KEY (id),
  CONSTRAINT reportes_actividad_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas_voluntarios(id),
  CONSTRAINT reportes_actividad_voluntario_id_fkey FOREIGN KEY (voluntario_id) REFERENCES public.voluntarios(id)
);
CREATE TABLE public.roles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying NOT NULL UNIQUE,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tareas_voluntarios (
  id bigint NOT NULL DEFAULT nextval('tareas_voluntarios_id_seq'::regclass),
  voluntario_id bigint,
  distribucion_id bigint,
  titulo character varying NOT NULL,
  descripcion text,
  tipo_tarea character varying,
  estado character varying DEFAULT 'ASIGNADA'::character varying,
  fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_aceptacion timestamp without time zone,
  fecha_completada timestamp without time zone,
  observaciones text,
  evidencia text,
  CONSTRAINT tareas_voluntarios_pkey PRIMARY KEY (id),
  CONSTRAINT tareas_voluntarios_voluntario_id_fkey FOREIGN KEY (voluntario_id) REFERENCES public.voluntarios(id),
  CONSTRAINT tareas_voluntarios_distribucion_id_fkey FOREIGN KEY (distribucion_id) REFERENCES public.distribuciones(id)
);
CREATE TABLE public.tipos_beneficiario (
  id bigint NOT NULL DEFAULT nextval('tipos_beneficiario_id_seq'::regclass),
  tipo character varying UNIQUE,
  CONSTRAINT tipos_beneficiario_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_donacion (
  id bigint NOT NULL DEFAULT nextval('tipos_donacion_id_seq'::regclass),
  tipo character varying NOT NULL UNIQUE,
  CONSTRAINT tipos_donacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_donador (
  id bigint NOT NULL DEFAULT nextval('tipos_donador_id_seq'::regclass),
  tipo character varying NOT NULL UNIQUE,
  descripcion text NOT NULL,
  CONSTRAINT tipos_donador_pkey PRIMARY KEY (id)
);
CREATE TABLE public.usuarios (
  id bigint NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass) UNIQUE,
  nombre_usuario character varying NOT NULL UNIQUE,
  contrasena character varying NOT NULL,
  nombre_completo character varying,
  email character varying UNIQUE,
  telefono character varying,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso timestamp without time zone,
  rol_id bigint,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id)
);
CREATE TABLE public.voluntarios (
  id bigint NOT NULL DEFAULT nextval('voluntarios_id_seq'::regclass),
  usuario_id bigint,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  especialidad character varying,
  disponibilidad boolean,
  estado_activo boolean,
  CONSTRAINT voluntarios_pkey PRIMARY KEY (id),
  CONSTRAINT voluntarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);