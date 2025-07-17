import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
} from "recharts";
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
import EvolucionInventarioCategoria from "./EvolucionInventarioCategoria";
import DonacionesHeatmap from "./DonacionesHeatmap";
import RadarVoluntarios from "./RadarVolunetarios";

// Configuración de colores para los gráficos
const COLORS = ["#2563eb", "#22c55e", "#f59e42", "#e11d48", "#f43f5e", "#a21caf", "#0ea5e9", "#facc15", "#14b8a6", "#64748b", "#f472b6", "#b91c1c"];

// Lista de meses en orden
const MESES_ORDENADOS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"
];

// Versiones abreviadas para cuando hay poco espacio
const MESES_ABREV = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

// Configuración para leyendas
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

function ordenarMeses(data) {
    // Ordena los datos por el orden de MESES_ORDENADOS
    return data.slice().sort((a, b) =>
        MESES_ORDENADOS.indexOf(a.mes) - MESES_ORDENADOS.indexOf(b.mes)
    );
}

function normalizarMes(mes) {
    if (!mes) return "";
    // Quita espacios y pone la primera letra en mayúscula, el resto en minúscula
    const limpio = mes.trim().toLowerCase();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

function rellenarMeses(data, keyExtra = {}) {
    // Rellena los meses faltantes con total 0
    const mesesSet = new Set(data.map(item => item.mes));
    const anio = data.length > 0 ? data[0].anio : "";
    const base = MESES_ORDENADOS.map(mes => {
        const found = data.find(item => item.mes === mes);
        return found
            ? { ...found, ...keyExtra }
            : { mes, total: 0, anio, ...keyExtra };
    });
    return base;
}

// Función personalizada para formatear etiquetas del eje X
const formatXAxisLabel = (tickItem) => {
    // Usar abreviaciones para ahorrar espacio
    const indexMes = MESES_ORDENADOS.indexOf(tickItem);
    return indexMes !== -1 ? MESES_ABREV[indexMes] : tickItem;
};

function Dashboard() {
    // Estados para los datos
    const [donacionesPorMes, setDonacionesPorMes] = useState([]);
    const [donacionesPorCategoria, setDonacionesPorCategoria] = useState([]);
    const [donacionesPorEstado, setDonacionesPorEstado] = useState([]);
    const [donacionesPorTipo, setDonacionesPorTipo] = useState([]);
    const [distribucionesPorEstadoMes, setDistribucionesPorEstadoMes] = useState([]);
    const [filtroAnio, setFiltroAnio] = useState("Todos");
    const [filtroAnioDistrib, setFiltroAnioDistrib] = useState("Todos");
    const [kpis, setKpis] = useState({
        totalDonaciones: 0,
        valorTotal: 0,
        totalBeneficiarios: 0,
        voluntariosActivos: 0,
    });
    useEffect(() => {
        axios.get("http://localhost:8080/dashboard/kpis")
            .then(res => setKpis(res.data))
            .catch(() => setKpis({
                totalDonaciones: 0,
                valorTotal: 0,
                totalBeneficiarios: 0,
                voluntariosActivos: 0,
            }));
    }, []);
    // Cargar datos
    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-mes")
            .then(res => setDonacionesPorMes(res.data))
            .catch(() => setDonacionesPorMes([]));
    }, []);
    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-categoria")
            .then(res => setDonacionesPorCategoria(res.data))
            .catch(() => setDonacionesPorCategoria([]));
    }, []);
    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-estado")
            .then(res => setDonacionesPorEstado(res.data))
            .catch(() => setDonacionesPorEstado([]));
    }, []);
    useEffect(() => {
        axios.get("http://localhost:8080/donation/donaciones-por-tipo")
            .then(res => setDonacionesPorTipo(res.data))
            .catch(() => setDonacionesPorTipo([]));
    }, []);
    useEffect(() => {
        axios.get("http://localhost:8080/distribucion/distribuciones-por-estado-mes")
            .then(res => setDistribucionesPorEstadoMes(res.data))
            .catch(() => setDistribucionesPorEstadoMes([]));
    }, []);

    // --- Donaciones por Mes ---
    const aniosUnicos = [...new Set(donacionesPorMes.map(item => item.anio))];
    // Filtrado por año
    const donacionesFiltradas = (filtroAnio === "Todos"
        ? donacionesPorMes
        : donacionesPorMes.filter(item => item.anio === filtroAnio)
    ).map(item => ({
        ...item,
        mes: normalizarMes(item.mes), // <-- normaliza aquí
        donacion: item.total
    }));

    // Rellenar y ordenar meses
    const dataDonacionesPorMesFiltrado = ordenarMeses(
        rellenarMeses(
            donacionesFiltradas.map(item => ({
                ...item,
                donacion: item.total
            }))
        )
    );

    // --- Distribuciones por Estado y Mes ---
    const aniosDistrib = [...new Set(distribucionesPorEstadoMes.map(item => item.anio))];
    const distribucionesFiltradas = (filtroAnioDistrib === "Todos"
        ? distribucionesPorEstadoMes
        : distribucionesPorEstadoMes.filter(item => item.anio === filtroAnioDistrib)
    ).map(item => ({
        ...item,
        mes: normalizarMes(item.mes) // <-- normaliza aquí
    }));

    // Agrupar por mes y estado, rellenar meses y estados
    const estados = ["PROGRAMADA", "ENTREGADA", "CANCELADA"];
    const distribucionesPorMes = MESES_ORDENADOS.map(mes => {
        const row = { mes };
        estados.forEach(estado => {
            const found = distribucionesFiltradas.find(item => item.mes === mes && item.estado === estado);
            row[estado] = found ? found.total : 0;
        });
        return row;
    });

    // --- Donaciones por Tipo ---
    const dataDonacionesPorTipo = donacionesPorTipo.map(item => ({
        tipo: item.tipo.tipo,
        total: item.total,
    }));

    // --- Donaciones por Estado ---
    const dataDonacionesPorEstado = donacionesPorEstado.map(item => ({
        estado: item.estado,
        total: item.total,
    }));

    // --- Donaciones por Categoría ---
    const dataDonacionesPorCategoria = donacionesPorCategoria.map(item => ({
        categoria: item.categoria,
        total: item.total,
    }));
return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Dashboard de Donaciones
                </h1>
                <p className="text-gray-600">Resumen de Información</p>
            </div>

            {/* KPIs Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Donaciones</p>
                                <p className="text-3xl font-bold mt-1">{kpis.totalDonaciones}</p>
                            </div>
                            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Beneficiarios</p>
                                <p className="text-3xl font-bold mt-1">{kpis.totalBeneficiarios}</p>
                            </div>
                            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Voluntarios Activos</p>
                                <p className="text-3xl font-bold mt-1">{kpis.voluntariosActivos}</p>
                            </div>
                            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Valor Total</p>
                                <p className="text-3xl font-bold mt-1">{kpis.valorTotal}</p>
                            </div>
                            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Donaciones por Mes - Span 2 columns */}
                <div className="xl:col-span-2">
                    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        Donaciones por Mes
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Tendencia mensual de donaciones
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="filtroAnio" className="text-sm font-medium text-gray-700">
                                        Año:
                                    </label>
                                    <select
                                        id="filtroAnio"
                                        value={filtroAnio}
                                        onChange={e => setFiltroAnio(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Todos">Todos</option>
                                        {aniosUnicos.map(anio => (
                                            <option key={anio} value={anio}>{anio}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} style={{ width: "100%", height: 360 }}>
                                <ResponsiveContainer width="100%" height={340}>
                                    <LineChart
                                        data={dataDonacionesPorMesFiltrado}
                                        margin={{ left: 12, right: 12, bottom: 50, top: 10 }}
                                    >
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="mes"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            angle={-45}
                                            textAnchor="end"
                                            height={70}
                                            interval={0}
                                            tickFormatter={formatXAxisLabel}
                                            fontSize={11}
                                        />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Line
                                            dataKey="donacion"
                                            type="monotone"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                                            activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Donaciones por Tipo - Donut */}
                <div>
                    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Donaciones por Tipo
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Distribución por tipo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={dataDonacionesPorTipo}
                                            dataKey="total"
                                            nameKey="tipo"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            label
                                        >
                                            {dataDonacionesPorTipo.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Secondary Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Distribuciones por Estado */}
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">
                                    Distribuciones por Estado
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Estado de las distribuciones
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="filtroAnioDistrib" className="text-sm font-medium text-gray-700">
                                    Año:
                                </label>
                                <select
                                    id="filtroAnioDistrib"
                                    value={filtroAnioDistrib}
                                    onChange={e => setFiltroAnioDistrib(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Todos">Todos</option>
                                    {aniosDistrib.map(anio => (
                                        <option key={anio} value={anio}>{anio}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} style={{ width: "100%", height: 360 }}>
                            <ResponsiveContainer width="100%" height={340}>
                                <BarChart
                                    data={distribucionesPorMes}
                                    margin={{ left: 12, right: 12, bottom: 50, top: 10 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="mes"
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                        interval={0}
                                        tickFormatter={formatXAxisLabel}
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="PROGRAMADA" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="ENTREGADA" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="CANCELADA" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Donaciones por Estado */}
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Donaciones por Estado
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Estados de las donaciones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dataDonacionesPorEstado}
                                    margin={{ left: 12, right: 12 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="estado" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donaciones por Categoría */}
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Donaciones por Categoría
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Categorías más populares
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart 
                                    data={dataDonacionesPorCategoria} 
                                    margin={{ left: 12, right: 12, bottom: 50 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="categoria"
                                        angle={-45}
                                        textAnchor="end"
                                        interval={0}
                                        height={70}
                                        tickMargin={8}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Componente adicional */}
                <div>
                    <EvolucionInventarioCategoria />
                </div>
            </div>
        </div>
    </div>
);
}

export default Dashboard;