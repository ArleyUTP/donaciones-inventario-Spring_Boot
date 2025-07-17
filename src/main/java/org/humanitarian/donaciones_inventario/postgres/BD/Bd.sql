Script de la base de datos:
-- Script SQL mejorado con secuencias y estandarización


-- Tipos personalizados

-- =============================================================================
-- SECUENCIAS PARA AUTO-INCREMENTO
-- =============================================================================

CREATE SEQUENCE roles_id_seq START 1;
CREATE SEQUENCE usuarios_id_seq START 1;
CREATE SEQUENCE voluntarios_id_seq START 1;
CREATE SEQUENCE tipos_beneficiario_id_seq START 1;
CREATE SEQUENCE beneficiarios_id_seq START 1;
CREATE SEQUENCE tipos_donador_id_seq START 1;
CREATE SEQUENCE donadores_id_seq START 1;
CREATE SEQUENCE tipos_donacion_id_seq START 1;
CREATE SEQUENCE categorias_inventario_id_seq START 1;
CREATE SEQUENCE necesidades_actuales_id_seq START 1;
CREATE SEQUENCE donaciones_id_seq START 1;
CREATE SEQUENCE inventario_id_seq START 1;
CREATE SEQUENCE distribuciones_id_seq START 1;
CREATE SEQUENCE detalle_distribucion_id_seq START 1;
CREATE SEQUENCE tareas_voluntarios_id_seq START 1;
CREATE SEQUENCE reportes_actividad_id_seq START 1;
CREATE SEQUENCE asignaciones_recojo_id_seq START 1;
CREATE SEQUENCE notificaciones_id_seq START 1;
CREATE SEQUENCE incidencias_id_seq START 1;

-- =============================================================================
-- TABLAS MAESTRAS (CATÁLOGOS)
-- =============================================================================

-- Tabla: roles
CREATE TABLE "public"."roles" (
    "id" bigint NOT NULL DEFAULT nextval('roles_id_seq'),
    "nombre" character varying(255) NOT NULL UNIQUE,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "roles_roles_nombre_key" ON "public"."roles" ("nombre");

-- Tabla: tipos_beneficiario
CREATE TABLE "public"."tipos_beneficiario" (
    "id" bigint NOT NULL DEFAULT nextval('tipos_beneficiario_id_seq'),
    "tipo" character varying(100) UNIQUE,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tipos_beneficiario_tipos_beneficiario_tipo_key" ON "public"."tipos_beneficiario" ("tipo");

-- Tabla: tipos_donador
CREATE TABLE "public"."tipos_donador" (
    "id" bigint NOT NULL DEFAULT nextval('tipos_donador_id_seq'),
    "tipo" character varying(100) NOT NULL UNIQUE,
    "descripcion" text NOT NULL,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tipos_donador_tipos_donador_tipo_key" ON "public"."tipos_donador" ("tipo");

-- Tabla: tipos_donacion
CREATE TABLE "public"."tipos_donacion" (
    "id" bigint NOT NULL DEFAULT nextval('tipos_donacion_id_seq'),
    "tipo" character varying(100) NOT NULL UNIQUE,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tipos_donacion_tipos_donacion_tipo_key" ON "public"."tipos_donacion" ("tipo");

-- Tabla: categorias_inventario
CREATE TABLE "public"."categorias_inventario" (
    "id" bigint NOT NULL DEFAULT nextval('categorias_inventario_id_seq'),
    "categoria" character varying(100) NOT NULL UNIQUE,
    "descripcion" text,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "categorias_inventario_categorias_inventario_categoria_key" ON "public"."categorias_inventario" ("categoria");

-- =============================================================================
-- TABLAS PRINCIPALES
-- =============================================================================

-- Tabla: usuarios
CREATE TABLE "public"."usuarios" (
    "id" bigint NOT NULL DEFAULT nextval('usuarios_id_seq'),
    "nombre_usuario" character varying(255) NOT NULL UNIQUE,
    "contrasena" character varying(255) NOT NULL,
    "nombre_completo" character varying(255),
    "email" character varying(255) UNIQUE,
    "telefono" character varying(255),
    "fecha_registro" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "ultimo_acceso" timestamp without time zone,
    "rol_id" bigint,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "usuarios_usuarios_email_key" ON "public"."usuarios" ("email");
CREATE INDEX "usuarios_idx_usuarios_nombre_usuario" ON "public"."usuarios" ("nombre_usuario");
CREATE UNIQUE INDEX "usuarios_usuarios_nombre_usuario_key" ON "public"."usuarios" ("nombre_usuario");
CREATE INDEX "usuarios_idx_usuarios_email" ON "public"."usuarios" ("email");

-- Tabla: voluntarios
CREATE TABLE "public"."voluntarios" (
    "id" bigint NOT NULL DEFAULT nextval('voluntarios_id_seq'),
    "usuario_id" bigint,
    "fecha_registro" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "especialidad" character varying,
    "disponibilidad" boolean DEFAULT true,
    "estado_activo" boolean DEFAULT true,
    PRIMARY KEY ("id")
);

-- Tabla: beneficiarios
CREATE TABLE "public"."beneficiarios" (
    "id" bigint NOT NULL DEFAULT nextval('beneficiarios_id_seq'),
    "tipo" bigint,
    "nombre" character varying(150) NOT NULL,
    "ubicacion" character varying(200),
    "personas_afectadas" integer,
    "prioridad" integer CHECK (prioridad BETWEEN 1 AND 5),
    "fecha_registro" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- Tabla: donadores
CREATE TABLE "public"."donadores" (
    "id" bigint NOT NULL DEFAULT nextval('donadores_id_seq'),
    "usuario_id" bigint,
    "tipo_id" bigint,
    "fecha_registro" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "nombre_donador" character varying,
    "documento_identidad" character varying,
    "pais_origen" character varying,
    "observaciones" text,
    "estado_activo" boolean DEFAULT true,
    "telefono" text UNIQUE,
    "email" text UNIQUE,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "donadores_donadores_email_key" ON "public"."donadores" ("email");
CREATE UNIQUE INDEX "donadores_donadores_telefono_key" ON "public"."donadores" ("telefono");

-- Tabla: necesidades_actuales
CREATE TABLE "public"."necesidades_actuales" (
    "id" bigint NOT NULL DEFAULT nextval('necesidades_actuales_id_seq'),
    "categoria_id" bigint,
    "nombre_necesidad" character varying(200) NOT NULL,
    "descripcion" text,
    "cantidad_necesaria" integer,
    "unidad_medida" character varying(50),
    "prioridad" integer CHECK (prioridad BETWEEN 1 AND 5),
    "fecha_limite" date,
    "estado" character varying(50) DEFAULT 'ACTIVA',
    "beneficiarios_objetivo" text,
    "fecha_creacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "creado_por_id" bigint,
    "tipo_donacion_id" bigint,
    PRIMARY KEY ("id")
);

-- Tabla: donaciones
CREATE TABLE "public"."donaciones" (
    "id" bigint NOT NULL DEFAULT nextval('donaciones_id_seq'),
    "donador_id" bigint,
    "usuario_id" bigint,
    "monto" numeric(19, 2),
    "tipo_donacion" bigint,
    "fecha_donacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "estado" character varying(50) DEFAULT 'PENDIENTE',
    "detalles_especie" text,
    "fecha_creacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "categoria_inventario_id" bigint,
    "ubicacion_recojo" geography,
    "direccion_recojo" text,
    "referencia_recojo" text,
    "necesidad_id" bigint,
    PRIMARY KEY ("id")
);

CREATE INDEX "donaciones_idx_donaciones_estado" ON "public"."donaciones" ("estado");
CREATE INDEX "donaciones_idx_donaciones_fecha" ON "public"."donaciones" ("fecha_donacion");

-- Tabla: inventario
CREATE TABLE "public"."inventario" (
    "id" bigint NOT NULL DEFAULT nextval('inventario_id_seq'),
    "donacion_id" bigint,
    "categoria_id" bigint,
    "nombre" character varying(150) NOT NULL,
    "cantidad" integer,
    "unidad_medida" character varying(50),
    "fecha_vencimiento" date,
    "ubicacion_almacen" character varying(200),
    "estado" character varying(50) DEFAULT 'DISPONIBLE',
    "fecha_creacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE INDEX "inventario_idx_inventario_vencimiento" ON "public"."inventario" ("fecha_vencimiento");
CREATE INDEX "inventario_idx_inventario_estado" ON "public"."inventario" ("estado");
CREATE INDEX "inventario_idx_inventario_categoria" ON "public"."inventario" ("categoria_id");

-- Tabla: distribuciones
CREATE TABLE "public"."distribuciones" (
    "id" bigint NOT NULL DEFAULT nextval('distribuciones_id_seq'),
    "beneficiario_id" bigint,
    "usuario_id" bigint,
    "fecha_programada" timestamp without time zone,
    "fecha_entrega" timestamp without time zone,
    "estado" character varying(50) DEFAULT 'PROGRAMADA',
    "responsable_id" bigint,
    "calificacion" smallint CHECK (calificacion BETWEEN 1 AND 5),
    "observaciones" text,
    PRIMARY KEY ("id")
);

CREATE INDEX "distribuciones_idx_distribuciones_fecha_programada" ON "public"."distribuciones" ("fecha_programada");
CREATE INDEX "distribuciones_idx_distribuciones_estado" ON "public"."distribuciones" ("estado");

-- Tabla: detalle_distribucion
CREATE TABLE "public"."detalle_distribucion" (
    "id" bigint NOT NULL DEFAULT nextval('detalle_distribucion_id_seq'),
    "distribucion_id" bigint,
    "inventario_id" bigint,
    "cantidad" integer,
    "estado" character varying(50) DEFAULT 'PENDIENTE',
    PRIMARY KEY ("id")
);

-- Tabla: tareas_voluntarios
CREATE TABLE "public"."tareas_voluntarios" (
    "id" bigint NOT NULL DEFAULT nextval('tareas_voluntarios_id_seq'),
    "voluntario_id" bigint,
    "distribucion_id" bigint,
    "titulo" character varying(200) NOT NULL,
    "descripcion" text,
    "tipo_tarea" character varying(100),
    "estado" character varying(50) DEFAULT 'ASIGNADA',
    "fecha_asignacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "fecha_aceptacion" timestamp without time zone,
    "fecha_completada" timestamp without time zone,
    "observaciones" text,
    "evidencia" text,
    PRIMARY KEY ("id")
);

-- Tabla: reportes_actividad
CREATE TABLE "public"."reportes_actividad" (
    "id" bigint NOT NULL DEFAULT nextval('reportes_actividad_id_seq'),
    "tarea_id" bigint,
    "voluntario_id" bigint,
    "avance_porcentaje" integer CHECK (avance_porcentaje BETWEEN 0 AND 100),
    "descripcion_avance" text,
    "evidencias_multimedia" text,
    "fecha_reporte" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "ubicacion_gps" character varying(100),
    PRIMARY KEY ("id")
);

-- Tabla: asignaciones_recojo
CREATE TABLE "public"."asignaciones_recojo" (
    "id" bigint NOT NULL DEFAULT nextval('asignaciones_recojo_id_seq'),
    "donacion_id" bigint NOT NULL,
    "voluntario_id" bigint NOT NULL,
    "fecha_asignacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "fecha_aceptacion" timestamp without time zone,
    "fecha_rechazo" timestamp without time zone,
    "motivo_rechazo" text,
    "estado" character varying DEFAULT 'ASIGNADA',
    "observaciones" text,
    PRIMARY KEY ("id")
);

-- Tabla: notificaciones
CREATE TABLE "public"."notificaciones" (
    "id" bigint NOT NULL DEFAULT nextval('notificaciones_id_seq'),
    "usuario_id" bigint NOT NULL,
    "titulo" character varying(255) NOT NULL,
    "mensaje" text NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "leido" boolean DEFAULT false,
    "fecha_creacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- Tabla: incidencias
CREATE TABLE "public"."incidencias" (
    "id" bigint NOT NULL DEFAULT nextval('incidencias_id_seq'),
    "distribucion_id" bigint,
    "usuario_reporta_id" bigint,
    "tipo_incidencia" character varying(100),
    "descripcion" text NOT NULL,
    "gravedad" character varying(50),
    "estado" character varying(50) DEFAULT 'REPORTADA',
    "fecha_incidencia" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "fecha_resolucion" timestamp without time zone,
    "solucion" text,
    PRIMARY KEY ("id")
);



-- =============================================================================
-- FOREIGN KEYS
-- =============================================================================

ALTER TABLE "public"."usuarios" ADD CONSTRAINT "fk_usuarios_rol_id_roles_id" FOREIGN KEY("rol_id") REFERENCES "public"."roles"("id");
ALTER TABLE "public"."voluntarios" ADD CONSTRAINT "fk_voluntarios_usuario_id_usuarios_id" FOREIGN KEY("usuario_id") REFERENCES "public"."usuarios"("id");
ALTER TABLE "public"."beneficiarios" ADD CONSTRAINT "fk_beneficiarios_tipo_tipos_beneficiario_id" FOREIGN KEY("tipo") REFERENCES "public"."tipos_beneficiario"("id");
ALTER TABLE "public"."donadores" ADD CONSTRAINT "fk_donadores_usuario_id_usuarios_id" FOREIGN KEY("usuario_id") REFERENCES "public"."usuarios"("id");
ALTER TABLE "public"."donadores" ADD CONSTRAINT "fk_donadores_tipo_id_tipos_donador_id" FOREIGN KEY("tipo_id") REFERENCES "public"."tipos_donador"("id");
ALTER TABLE "public"."necesidades_actuales" ADD CONSTRAINT "fk_necesidades_actuales_categoria_id_categorias_inventario_i" FOREIGN KEY("categoria_id") REFERENCES "public"."categorias_inventario"("id");
ALTER TABLE "public"."necesidades_actuales" ADD CONSTRAINT "fk_necesidades_actuales_creado_por_id_usuarios_id" FOREIGN KEY("creado_por_id") REFERENCES "public"."usuarios"("id");
ALTER TABLE "public"."necesidades_actuales" ADD CONSTRAINT "fk_necesidades_actuales_tipo_donacion_id_tipos_donacion_id" FOREIGN KEY("tipo_donacion_id") REFERENCES "public"."tipos_donacion"("id");
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "fk_donaciones_donador_id_donadores_id" FOREIGN KEY("donador_id") REFERENCES "public"."donadores"("id");
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "fk_donaciones_usuario_id_usuarios_id" FOREIGN KEY("usuario_id") REFERENCES "public"."usuarios"("id");
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "fk_donaciones_tipo_donacion_tipos_donacion_id" FOREIGN KEY("tipo_donacion") REFERENCES "public"."tipos_donacion"("id");
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "fk_donaciones_categoria_inventario_id_categorias_inventario_" FOREIGN KEY("categoria_inventario_id") REFERENCES "public"."categorias_inventario"("id");
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "fk_donaciones_necesidad_id_necesidades_actuales_id" FOREIGN KEY("necesidad_id") REFERENCES "public"."necesidades_actuales"("id");
ALTER TABLE "public"."inventario" ADD CONSTRAINT "fk_inventario_donacion_id_donaciones_id" FOREIGN KEY("donacion_id") REFERENCES "public"."donaciones"("id");
ALTER TABLE "public"."inventario" ADD CONSTRAINT "fk_inventario_categoria_id_categorias_inventario_id" FOREIGN KEY("categoria_id") REFERENCES "public"."categorias_inventario"("id");
ALTER TABLE "public"."distribuciones" ADD CONSTRAINT "fk_distribuciones_beneficiario_id_beneficiarios_id" FOREIGN KEY("beneficiario_id") REFERENCES "public"."beneficiarios"("id");
ALTER TABLE "public"."distribuciones" ADD CONSTRAINT "fk_distribuciones_usuario_id_usuarios_id" FOREIGN KEY("usuario_id") REFERENCES "public"."usuarios"("id");
ALTER TABLE "public"."distribuciones" ADD CONSTRAINT "fk_distribuciones_responsable_id_usuarios_id" FOREIGN KEY("responsable_id") REFERENCES "public"."usuarios"("id");
ALTER TABLE "public"."detalle_distribucion" ADD CONSTRAINT "fk_detalle_distribucion_distribucion_id_distribuciones_id" FOREIGN KEY("distribucion_id") REFERENCES "public"."distribuciones"("id");
ALTER TABLE "public"."detalle_distribucion" ADD CONSTRAINT "fk_detalle_distribucion_inventario_id_inventario_id" FOREIGN KEY("inventario_id") REFERENCES "public"."inventario"("id");
ALTER TABLE "public"."tareas_voluntarios" ADD CONSTRAINT "fk_tareas_voluntarios_voluntario_id_voluntarios_id" FOREIGN KEY("voluntario_id") REFERENCES "public"."voluntarios"("id");
ALTER TABLE "public"."tareas_voluntarios" ADD CONSTRAINT "fk_tareas_voluntarios_distribucion_id_distribuciones_id" FOREIGN KEY("distribucion_id") REFERENCES "public"."distribuciones"("id");
ALTER TABLE "public"."reportes_actividad" ADD CONSTRAINT "fk_reportes_actividad_tarea_id_tareas_voluntarios_id" FOREIGN KEY("tarea_id") REFERENCES "public"."tareas_voluntarios"("id");
ALTER TABLE "public"."reportes_actividad" ADD CONSTRAINT "fk_reportes_actividad_voluntario_id_voluntarios_id" FOREIGN KEY("voluntario_id") REFERENCES "public"."voluntarios"("id");
ALTER TABLE "public"."asignaciones_recojo" ADD CONSTRAINT "fk_asignaciones_recojo_donacion_id_donaciones_id" FOREIGN KEY("donacion_id") REFERENCES "public"."donaciones"("id");
ALTER TABLE "public"."asignaciones_recojo" ADD CONSTRAINT "fk_asignaciones_recojo_voluntario_id_voluntarios_id" FOREIGN KEY("voluntario_id") REFERENCES "public"."voluntarios"("id");
ALTER TABLE "public"."notificaciones" ADD CONSTRAINT "fk_notificaciones_usuario_id_usuarios_id" FOREIGN KEY("usuario_id") REFERENCES "public"."usuarios"("id");
ALTER TABLE "public"."incidencias" ADD CONSTRAINT "fk_incidencias_distribucion_id_distribuciones_id" FOREIGN KEY("distribucion_id") REFERENCES "public"."distribuciones"("id");
ALTER TABLE "public"."incidencias" ADD CONSTRAINT "fk_incidencias_usuario_reporta_id_usuarios_id" FOREIGN KEY("usuario_reporta_id") REFERENCES "public"."usuarios"("id");

-- =============================================================================
-- TRIGGERS PARA FECHA_MODIFICACION
-- =============================================================================

-- Función para actualizar fecha_modificacion
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER tr_donaciones_fecha_modificacion
    BEFORE UPDATE ON donaciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER tr_inventario_fecha_modificacion
    BEFORE UPDATE ON inventario
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();