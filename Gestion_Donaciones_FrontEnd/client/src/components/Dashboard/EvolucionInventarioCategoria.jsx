import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

const chartConfig = {}; // <-- Esto evita el error de ChartStyle

function formatMesAnio(anio, mes) {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${meses[mes - 1]}/${anio}`;
}

function EvolucionInventarioCategoria() {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/dashboard/evolucion-inventario-categoria")
      .then(res => {
        const rows = res.data.map(row => ({
          ...row,
          categoria: row.categoria.trim(),
        }));

        const mesesUnicos = Array.from(
          new Set(rows.map(row => `${row.anio}-${row.mes}`))
        ).sort((a, b) => {
          const [aY, aM] = a.split("-").map(Number);
          const [bY, bM] = b.split("-").map(Number);
          return aY !== bY ? aY - bY : aM - bM;
        });

        const cats = Array.from(new Set(rows.map(row => row.categoria)));

        const pivot = mesesUnicos.map(key => {
          const [anio, mes] = key.split("-").map(Number);
          const base = { mes: formatMesAnio(anio, mes) };
          cats.forEach(cat => {
            const found = rows.find(r => r.anio === anio && r.mes === mes && r.categoria === cat);
            base[cat] = found ? found.total_cantidad : 0;
          });
          return base;
        });

        setData(pivot);
        setCategorias(cats);
      });
  }, []);

  if (!data || data.length === 0 || categorias.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Inventario por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No hay datos para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de Inventario por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              {categorias.map((cat, idx) => (
                <Area
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stackId="1"
                  stroke={`hsl(${(idx * 40) % 360}, 70%, 50%)`}
                  fill={`hsl(${(idx * 40) % 360}, 70%, 70%)`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default EvolucionInventarioCategoria;