import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer
} from "recharts";

function RadarVoluntarios() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/dashboard/rendimiento-voluntarios-especialidad")
      .then(res => {
        setData(res.data.map(row => ({
          especialidad: row.especialidad || "Sin especialidad",
          tareas_completadas: Number(row.tareas_completadas),
          tiempo_promedio_horas: Number(row.tiempo_promedio_horas || 0),
          voluntarios_activos: Number(row.voluntarios_activos)
        })));
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de Voluntarios por Especialidad</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="especialidad" />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Radar name="Tareas Completadas" dataKey="tareas_completadas" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
            <Radar name="Voluntarios Activos" dataKey="voluntarios_activos" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
        <div className="text-xs text-muted-foreground mt-2">
          * El tiempo promedio de tareas (horas) se puede mostrar en tooltip.
        </div>
      </CardContent>
    </Card>
  );
}

export default RadarVoluntarios;