import React from 'react';
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    donacion: {
        label: "Donación",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
};

function Dashboard() {
    const [donacionesPorMes, setDonacionesPorMes] = useState([]);
    const [donacionesPorCategoria, setDonacionesPorCategoria] = useState([]);
    const [donacionesPorEstado, setDonacionesPorEstado] = useState([]);
    const [donacionesPorTipo, setDonacionesPorTipo] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-tipo")
            .then(res => setDonacionesPorTipo(res.data))
            .catch(() => setDonacionesPorTipo([]));
    }, []);

    const dataDonacionesPorTipo = donacionesPorTipo.map(item => ({
        tipo: item.tipo.tipo,
        total: item.total
    }));
    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-estado")
            .then(res => setDonacionesPorEstado(res.data))
            .catch(() => setDonacionesPorEstado([]));
    }, []);

    const dataDonacionesPorEstado = donacionesPorEstado.map(item => ({
        estado: item.estado,
        total: item.total
    }));
    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-categoria")
            .then(res => setDonacionesPorCategoria(res.data))
            .catch(() => setDonacionesPorCategoria([]));
    }, []);

    const dataDonacionesPorCategoria = donacionesPorCategoria.map(item => ({
        categoria: item.categoria,
        total: item.total
    }));

    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-mes")
            .then(res => setDonacionesPorMes(res.data))
            .catch(() => setDonacionesPorMes([]));
    }, []);

    const dataDonacionesPorMes = donacionesPorMes.map(item => ({
        month: item.mes,
        donacion: item.total // Cambia 'desktop' por 'donacion'
    }));
const COLORS = ["#2563eb", "#22c55e", "#f59e42", "#e11d48"];
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <h3 className="text-sm font-medium text-gray-500">Total Donaciones</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">1,247</p>
                        <p className="text-sm text-green-600">+12% vs mes anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">$103,500</p>
                        <p className="text-sm text-green-600">+8% vs mes anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-sm font-medium text-gray-500">Beneficiarios</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">3,456</p>
                        <p className="text-sm text-blue-600">+15% vs mes anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-sm font-medium text-gray-500">Voluntarios Activos</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">89</p>
                        <p className="text-sm text-green-600">+5% vs mes anterior</p>
                    </CardContent>
                </Card>
            </div>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard de Donaciones</h1>
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* ...tus cards de KPIs... */}
                    </div>
                    {/* Gráficos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Donaciones por Mes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Mes</CardTitle>
                                <CardDescription>Últimos meses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <LineChart
                                        width={500}
                                        height={300}
                                        data={dataDonacionesPorMes}
                                        margin={{ left: 12, right: 12 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) =>
                                                typeof value === "string"
                                                    ? value.length === 7
                                                        ? value.slice(5, 7) + "/" + value.slice(2, 4)
                                                        : value
                                                    : value
                                            }
                                        />
                                        <YAxis />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Line
                                            dataKey="donacion"
                                            type="natural"
                                            stroke="var(--chart-1)"
                                            strokeWidth={2}
                                            dot={{ fill: "var(--chart-1)" }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 font-medium leading-none">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="leading-none text-muted-foreground">
                                    Mostrando total de donaciones por mes
                                </div>
                            </CardFooter>
                        </Card>
                        {/* Donaciones por Categoría */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Categoría</CardTitle>
                                <CardDescription>Totales por tipo de categoría</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        accessibilityLayer
                                        data={dataDonacionesPorCategoria}
                                        layout="vertical"
                                        margin={{ left: -20 }}
                                    >
                                        <XAxis type="number" dataKey="total" hide />
                                        <YAxis
                                            dataKey="categoria"
                                            type="category"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={5} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Top categorías de donaciones <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Mostrando total de donaciones por categoría
                                </div>
                            </CardFooter>
                        </Card>
                        {/* Aquí puedes agregar más gráficos en el futuro */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Estado</CardTitle>
                                <CardDescription>Total agrupado por estado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={dataDonacionesPorEstado}
                                        margin={{ left: 12, right: 12 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="estado" />
                                        <YAxis />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={5} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Estados de donaciones <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Mostrando total de donaciones por estado
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Tipo</CardTitle>
                                <CardDescription>Distribución de tipos de donación</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <PieChart width={400} height={300}>
                                        <Pie
                                            data={dataDonacionesPorTipo}
                                            dataKey="total"
                                            nameKey="tipo"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            label
                                        >
                                            {dataDonacionesPorTipo.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Tipos de donación <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Mostrando total de donaciones por tipo
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;