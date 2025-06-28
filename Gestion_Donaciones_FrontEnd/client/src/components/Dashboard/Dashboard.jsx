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

// Configuración de colores para los gráficos
const COLORS = ["#2563eb", "#22c55e", "#f59e42", "#e11d48", "#f43f5e", "#a21caf", "#0ea5e9", "#facc15", "#14b8a6", "#64748b", "#f472b6", "#b91c1c"];

// Lista de meses en orden
const MESES_ORDENADOS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"
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

function Dashboard() {
    // Estados para los datos
    const [donacionesPorMes, setDonacionesPorMes] = useState([]);
    const [donacionesPorCategoria, setDonacionesPorCategoria] = useState([]);
    const [donacionesPorEstado, setDonacionesPorEstado] = useState([]);
    const [donacionesPorTipo, setDonacionesPorTipo] = useState([]);
    const [distribucionesPorEstadoMes, setDistribucionesPorEstadoMes] = useState([]);
    const [filtroAnio, setFiltroAnio] = useState("Todos");
    const [filtroAnioDistrib, setFiltroAnioDistrib] = useState("Todos");

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
    const donacionesFiltradas = filtroAnio === "Todos"
        ? donacionesPorMes
        : donacionesPorMes.filter(item => item.anio === filtroAnio);

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
    const distribucionesFiltradas = filtroAnioDistrib === "Todos"
        ? distribucionesPorEstadoMes
        : distribucionesPorEstadoMes.filter(item => item.anio === filtroAnioDistrib);

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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Dashboard de Donaciones
                </h1>

                {/* ================= KPIs ================= */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <h3 className="text-sm font-medium text-gray-500">
                                Total Donaciones
                            </h3>
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
                            <h3 className="text-sm font-medium text-gray-500">
                                Voluntarios Activos
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-gray-900">89</p>
                            <p className="text-sm text-green-600">+5% vs mes anterior</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ================= Gráficos ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ----------- Donaciones por Mes (Línea) ----------- */}
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <label htmlFor="filtroAnio" className="font-medium">Año:</label>
                            <select
                                id="filtroAnio"
                                value={filtroAnio}
                                onChange={e => setFiltroAnio(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="Todos">Todos</option>
                                {aniosUnicos.map(anio => (
                                    <option key={anio} value={anio}>{anio}</option>
                                ))}
                            </select>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Mes</CardTitle>
                                <CardDescription>Últimos meses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={dataDonacionesPorMesFiltrado}
                                            margin={{ left: 12, right: 12 }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="mes"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                            />
                                            <YAxis />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                            <Line
                                                dataKey="donacion"
                                                type="monotone"
                                                stroke="#f59e42"
                                                strokeWidth={3}
                                                dot={{ fill: "#f59e42", r: 5 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
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
                    </div>

                    {/* ----------- Distribuciones por Estado y Mes (Barras apiladas) ----------- */}
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <label htmlFor="filtroAnioDistrib" className="font-medium">Año:</label>
                            <select
                                id="filtroAnioDistrib"
                                value={filtroAnioDistrib}
                                onChange={e => setFiltroAnioDistrib(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="Todos">Todos</option>
                                {aniosDistrib.map(anio => (
                                    <option key={anio} value={anio}>{anio}</option>
                                ))}
                            </select>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuciones por Estado y Mes</CardTitle>
                                <CardDescription>Barras apiladas por mes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={distribucionesPorMes}
                                            margin={{ left: 12, right: 12 }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                            <Bar dataKey="PROGRAMADA" stackId="a" fill="#2563eb" />
                                            <Bar dataKey="ENTREGADA" stackId="a" fill="#22c55e" />
                                            <Bar dataKey="CANCELADA" stackId="a" fill="#f59e42" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Distribuciones por estado y mes <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Mostrando total de distribuciones por estado y mes
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* ----------- Donaciones por Categoría (Barras horizontales) ----------- */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Categoría</CardTitle>
                                <CardDescription>Totales por tipo de categoría</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
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
                                            <Bar dataKey="total" fill="#2563eb" radius={5} />
                                        </BarChart>
                                    </ResponsiveContainer>
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
                    </div>

                    {/* ----------- Donaciones por Estado (Barras) ----------- */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Estado</CardTitle>
                                <CardDescription>Total agrupado por estado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} style={{ width: "100%", height: 320 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={dataDonacionesPorEstado}
                                            margin={{ left: 12, right: 12 }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="estado" />
                                            <YAxis />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                            <Bar dataKey="total" fill="#22c55e" radius={5} />
                                        </BarChart>
                                    </ResponsiveContainer>
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
                    </div>

                    {/* ----------- Donaciones por Tipo (Donut) ----------- */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Donaciones por Tipo</CardTitle>
                                <CardDescription>
                                    Distribución de tipos de donación
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
        </div>
    );
}

export default Dashboard;