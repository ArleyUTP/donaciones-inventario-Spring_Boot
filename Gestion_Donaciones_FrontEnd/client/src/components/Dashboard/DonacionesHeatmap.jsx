import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const horas = Array.from({ length: 24 }, (_, i) => `${i}:00`);

function DonacionesHeatmap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/dashboard/actividad-donaciones-heatmap")
      .then(res => {
        // Crear matriz de 7x24 con 0
        const matrix = Array(7).fill(0).map(() => Array(24).fill(0));
        res.data.forEach(row => {
          const dia = Number(row.dia_semana);
          const hora = Number(row.hora);
          matrix[dia][hora] = Number(row.total_donaciones);
        });
        // Convertir a formato plano para recharts
        const flat = [];
        for (let d = 0; d < 7; d++) {
          for (let h = 0; h < 24; h++) {
            flat.push({
              dia: dias[d],
              hora: horas[h],
              total: matrix[d][h],
            });
          }
        }
        setData(flat);
      });
  }, []);

  // Escala de color simple
  const getColor = (value) => {
    if (value === 0) return "#f1f5f9";
    if (value < 3) return "#c7d2fe";
    if (value < 10) return "#60a5fa";
    if (value < 20) return "#2563eb";
    return "#1e40af";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad de Donaciones (Heatmap)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <ResponsiveContainer width={700} height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
            >
              <XAxis type="number" dataKey="hora" hide />
              <YAxis
                dataKey="dia"
                type="category"
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value, name, props) =>
                  [`${props.payload.hora} - ${value} donaciones`, "Hora"]
                }
              />
              <Bar dataKey="total" barSize={16}>
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={getColor(entry.total)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Cada barra representa la cantidad de donaciones por hora y día.
        </div>
      </CardContent>
    </Card>
  );
}

export default DonacionesHeatmap;