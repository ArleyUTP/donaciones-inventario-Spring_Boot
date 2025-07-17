package org.humanitarian.donaciones_inventario.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/kpis")
    public Map<String, Object> getKpis() {
        Map<String, Object> kpis = new HashMap<>();

        // Total Donaciones
        Integer totalDonaciones = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM donaciones", Integer.class);

        // Valor Total Donaciones (suma de monto, si es null poner 0)
        Double valorTotal = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(monto),0) FROM donaciones", Double.class);

        // Total Beneficiarios
        Integer totalBeneficiarios = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM beneficiarios", Integer.class);

        // Voluntarios activos
        Integer voluntariosActivos = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM voluntarios WHERE estado_activo = true", Integer.class);

        kpis.put("totalDonaciones", totalDonaciones);
        kpis.put("valorTotal", valorTotal);
        kpis.put("totalBeneficiarios", totalBeneficiarios);
        kpis.put("voluntariosActivos", voluntariosActivos);

        return kpis;
    }

    @GetMapping("/evolucion-inventario-categoria")
    public List<Map<String, Object>> getEvolucionInventarioPorCategoria() {
        String sql = """
                    SELECT
                        EXTRACT(YEAR FROM i.fecha_creacion) as anio,
                        EXTRACT(MONTH FROM i.fecha_creacion) as mes,
                        c.categoria,
                        SUM(i.cantidad) as total_cantidad
                    FROM inventario i
                    JOIN categorias_inventario c ON i.categoria_id = c.id
                    WHERE i.fecha_creacion >= CURRENT_DATE - INTERVAL '12 months'
                    GROUP BY anio, mes, c.categoria
                    ORDER BY anio, mes, c.categoria
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/actividad-donaciones-heatmap")
    public List<Map<String, Object>> getActividadDonacionesHeatmap() {
        String sql = """
                    SELECT
                        EXTRACT(DOW FROM fecha_donacion) as dia_semana,
                        EXTRACT(HOUR FROM fecha_donacion) as hora,
                        COUNT(*) as total_donaciones
                    FROM donaciones
                    WHERE fecha_donacion >= CURRENT_DATE - INTERVAL '3 months'
                    GROUP BY dia_semana, hora
                    ORDER BY dia_semana, hora
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/rendimiento-voluntarios-especialidad")
    public List<Map<String, Object>> getRendimientoVoluntariosPorEspecialidad() {
        String sql = """
                    SELECT
                        v.especialidad,
                        COUNT(tv.id) as tareas_completadas,
                        AVG(EXTRACT(EPOCH FROM (tv.fecha_completada - tv.fecha_asignacion))/3600) as tiempo_promedio_horas,
                        COUNT(DISTINCT tv.voluntario_id) as voluntarios_activos
                    FROM voluntarios v
                    JOIN tareas_voluntarios tv ON v.id = tv.voluntario_id
                    WHERE tv.estado = 'COMPLETADA'
                    GROUP BY v.especialidad
                """;
        return jdbcTemplate.queryForList(sql);
    }
}