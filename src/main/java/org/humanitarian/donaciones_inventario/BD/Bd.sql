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
  categoria character varying NOT NULL UNIQUE,
  descripcion text,
  id bigint NOT NULL DEFAULT nextval('categorias_inventario_id_seq'::regclass),
  CONSTRAINT categorias_inventario_pkey PRIMARY KEY (id)
);
CREATE TABLE public.detalle_distribucion (
  distribucion_id bigint,
  inventario_id bigint,
  cantidad integer CHECK (cantidad > 0),
  id bigint NOT NULL DEFAULT nextval('detalle_distribucion_id_seq'::regclass),
  estado character varying DEFAULT 'PENDIENTE'::character varying,
  CONSTRAINT detalle_distribucion_pkey PRIMARY KEY (id),
  CONSTRAINT detalle_distribucion_distribucion_id_fkey FOREIGN KEY (distribucion_id) REFERENCES public.distribuciones(id),
  CONSTRAINT detalle_distribucion_inventario_id_fkey FOREIGN KEY (inventario_id) REFERENCES public.inventario(id)
);
CREATE TABLE public.distribuciones (
  calificacion smallint,
  observaciones text,
  beneficiario_id bigint,
  usuario_id bigint,
  fecha_programada timestamp without time zone,
  fecha_entrega timestamp without time zone,
  responsable_id bigint,
  id bigint NOT NULL DEFAULT nextval('distribuciones_id_seq'::regclass),
  estado character varying DEFAULT 'PROGRAMADA'::character varying,
  CONSTRAINT distribuciones_pkey PRIMARY KEY (id),
  CONSTRAINT distribuciones_beneficiario_id_fkey FOREIGN KEY (beneficiario_id) REFERENCES public.beneficiarios(id),
  CONSTRAINT distribuciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT distribuciones_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.donaciones (
  categoria_inventario_id bigint,
  monto numeric,
  donador_id bigint,
  usuario_id bigint,
  tipo_donacion bigint,
  detalles_especie text,
  id bigint NOT NULL DEFAULT nextval('donaciones_id_seq'::regclass),
  fecha_donacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  estado character varying DEFAULT 'PENDIENTE'::character varying,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  ubicacion_recojo USER-DEFINED,
  direccion_recojo text,
  referencia_recojo text,
  necesidad_id bigint,
  CONSTRAINT donaciones_pkey PRIMARY KEY (id),
  CONSTRAINT donaciones_tipo_donacion_fkey FOREIGN KEY (tipo_donacion) REFERENCES public.tipos_donacion(id),
  CONSTRAINT donaciones_donador_id_fkey FOREIGN KEY (donador_id) REFERENCES public.donadores(id),
  CONSTRAINT donaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT donaciones_necesidad_id_fkey FOREIGN KEY (necesidad_id) REFERENCES public.necesidades_actuales(id),
  CONSTRAINT donaciones_categoria_inventario_id_fkey FOREIGN KEY (categoria_inventario_id) REFERENCES public.categorias_inventario(id)
);
CREATE TABLE public.donadores (
  pais_origen character varying,
  observaciones text,
  telefono text UNIQUE,
  email text UNIQUE,
  usuario_id bigint,
  tipo_id bigint,
  id bigint NOT NULL DEFAULT nextval('donadores_id_seq'::regclass),
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  nombre_donador character varying,
  documento_identidad character varying,
  estado_activo boolean,
  CONSTRAINT donadores_pkey PRIMARY KEY (id),
  CONSTRAINT donadores_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT donadores_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.tipos_donador(id)
);
CREATE TABLE public.incidencias (
  distribucion_id bigint,
  usuario_reporta_id bigint,
  tipo_incidencia character varying,
  descripcion text NOT NULL,
  fecha_resolucion timestamp without time zone,
  solucion text,
  id bigint NOT NULL DEFAULT nextval('incidencias_id_seq'::regclass),
  gravedad character varying DEFAULT 'MEDIA'::character varying,
  estado character varying DEFAULT 'ABIERTA'::character varying,
  fecha_incidencia timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT incidencias_pkey PRIMARY KEY (id),
  CONSTRAINT incidencias_distribucion_id_fkey FOREIGN KEY (distribucion_id) REFERENCES public.distribuciones(id),
  CONSTRAINT incidencias_usuario_reporta_id_fkey FOREIGN KEY (usuario_reporta_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.inventario (
  donacion_id bigint,
  categoria_id bigint,
  nombre character varying NOT NULL,
  cantidad integer CHECK (cantidad >= 0),
  unidad_medida character varying,
  fecha_vencimiento date,
  ubicacion_almacen character varying,
  id bigint NOT NULL DEFAULT nextval('inventario_id_seq'::regclass),
  estado character varying DEFAULT 'DISPONIBLE'::character varying,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT inventario_pkey PRIMARY KEY (id),
  CONSTRAINT inventario_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_inventario(id),
  CONSTRAINT inventario_donacion_id_fkey FOREIGN KEY (donacion_id) REFERENCES public.donaciones(id)
);
CREATE TABLE public.necesidades_actuales (
  tipo_donacion_id bigint,
  categoria_id bigint,
  nombre_necesidad character varying NOT NULL,
  descripcion text,
  cantidad_necesaria integer,
  unidad_medida character varying,
  prioridad integer CHECK (prioridad >= 1 AND prioridad <= 5),
  fecha_limite date,
  beneficiarios_objetivo text,
  creado_por_id bigint,
  id bigint NOT NULL DEFAULT nextval('necesidades_actuales_id_seq'::regclass),
  estado character varying DEFAULT 'ACTIVA'::character varying,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT necesidades_actuales_pkey PRIMARY KEY (id),
  CONSTRAINT necesidades_actuales_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_inventario(id),
  CONSTRAINT necesidades_actuales_creado_por_id_fkey FOREIGN KEY (creado_por_id) REFERENCES public.usuarios(id),
  CONSTRAINT necesidades_actuales_tipo_donacion_id_fkey FOREIGN KEY (tipo_donacion_id) REFERENCES public.tipos_donacion(id)
);
CREATE TABLE public.reportes_actividad (
  tarea_id bigint,
  voluntario_id bigint,
  avance_porcentaje integer CHECK (avance_porcentaje >= 0 AND avance_porcentaje <= 100),
  descripcion_avance text,
  evidencias_multimedia text,
  ubicacion_gps character varying,
  id bigint NOT NULL DEFAULT nextval('reportes_actividad_id_seq'::regclass),
  fecha_reporte timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reportes_actividad_pkey PRIMARY KEY (id),
  CONSTRAINT reportes_actividad_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas_voluntarios(id),
  CONSTRAINT reportes_actividad_voluntario_id_fkey FOREIGN KEY (voluntario_id) REFERENCES public.voluntarios(id)
);
CREATE TABLE public.roles (
  nombre character varying NOT NULL UNIQUE,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.spatial_ref_sys (
  srid integer NOT NULL CHECK (srid > 0 AND srid <= 998999),
  auth_name character varying,
  auth_srid integer,
  srtext character varying,
  proj4text character varying,
  CONSTRAINT spatial_ref_sys_pkey PRIMARY KEY (srid)
);
CREATE TABLE public.tareas_voluntarios (
  voluntario_id bigint,
  distribucion_id bigint,
  titulo character varying NOT NULL,
  descripcion text,
  tipo_tarea character varying,
  fecha_aceptacion timestamp without time zone,
  fecha_completada timestamp without time zone,
  observaciones text,
  evidencia text,
  id bigint NOT NULL DEFAULT nextval('tareas_voluntarios_id_seq'::regclass),
  estado character varying DEFAULT 'ASIGNADA'::character varying,
  fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tareas_voluntarios_pkey PRIMARY KEY (id),
  CONSTRAINT tareas_voluntarios_voluntario_id_fkey FOREIGN KEY (voluntario_id) REFERENCES public.voluntarios(id),
  CONSTRAINT tareas_voluntarios_distribucion_id_fkey FOREIGN KEY (distribucion_id) REFERENCES public.distribuciones(id)
);
CREATE TABLE public.tipos_beneficiario (
  tipo character varying UNIQUE,
  id bigint NOT NULL DEFAULT nextval('tipos_beneficiario_id_seq'::regclass),
  CONSTRAINT tipos_beneficiario_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_donacion (
  tipo character varying NOT NULL UNIQUE,
  id bigint NOT NULL DEFAULT nextval('tipos_donacion_id_seq'::regclass),
  CONSTRAINT tipos_donacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_donador (
  tipo character varying NOT NULL UNIQUE,
  descripcion text NOT NULL,
  id bigint NOT NULL DEFAULT nextval('tipos_donador_id_seq'::regclass),
  CONSTRAINT tipos_donador_pkey PRIMARY KEY (id)
);
CREATE TABLE public.usuarios (
  contrasena character varying NOT NULL,
  email character varying UNIQUE,
  nombre_completo character varying,
  nombre_usuario character varying NOT NULL UNIQUE,
  telefono character varying,
  ultimo_acceso timestamp without time zone,
  rol_id bigint,
  id bigint NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass) UNIQUE,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id)
);
CREATE TABLE public.voluntarios (
  disponibilidad boolean,
  usuario_id bigint,
  id bigint NOT NULL DEFAULT nextval('voluntarios_id_seq'::regclass),
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  estado_activo boolean,
  especialidad character varying,
  CONSTRAINT voluntarios_pkey PRIMARY KEY (id),
  CONSTRAINT voluntarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);