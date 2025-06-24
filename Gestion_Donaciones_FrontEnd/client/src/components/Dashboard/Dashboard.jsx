import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Datos de ejemplo basados en tu schema
const donacionesPorMes = [
  { mes: 'Ene', donaciones: 65, valor: 12000 },
  { mes: 'Feb', donaciones: 78, valor: 15000 },
  { mes: 'Mar', donaciones: 90, valor: 18000 },
  { mes: 'Abr', donaciones: 85, valor: 16500 },
  { mes: 'May', donaciones: 95, valor: 20000 },
  { mes: 'Jun', donaciones: 110, valor: 22000 }
];

const estadoDonaciones = [
  { estado: 'Completadas', cantidad: 275, color: '#22c55e' },
  { estado: 'Pendientes', cantidad: 187, color: '#f59e0b' },
  { estado: 'Rechazadas', cantidad: 90, color: '#ef4444' },
  { estado: 'En Proceso', cantidad: 173, color: '#3b82f6' }
];

const categoriasDonaciones = [
  { categoria: 'Alimentos', cantidad: 145 },
  { categoria: 'Ropa', cantidad: 98 },
  { categoria: 'Medicina', cantidad: 76 },
  { categoria: 'Juguetes', cantidad: 54 },
  { categoria: 'Libros', cantidad: 43 },
  { categoria: 'Otros', cantidad: 32 }
];

const eficienciaVoluntarios = [
  { voluntario: 'María', completadas: 85, asignadas: 90, eficiencia: 94 },
  { voluntario: 'Juan', completadas: 78, asignadas: 85, eficiencia: 92 },
  { voluntario: 'Ana', completadas: 72, asignadas: 80, eficiencia: 90 },
  { voluntario: 'Luis', completadas: 65, asignadas: 75, eficiencia: 87 },
  { voluntario: 'Sofia', completadas: 58, asignadas: 70, eficiencia: 83 }
];

const metricasRadar = [
  { categoria: 'Alimentos', A: 120, B: 110, fullMark: 150 },
  { categoria: 'Ropa', A: 98, B: 130, fullMark: 150 },
  { categoria: 'Medicina', A: 86, B: 130, fullMark: 150 },
  { categoria: 'Educación', A: 99, B: 100, fullMark: 150 },
  { categoria: 'Hogar', A: 85, B: 90, fullMark: 150 },
  { categoria: 'Otros', A: 65, B: 85, fullMark: 150 }
];

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4'];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard de Donaciones</h1>
        
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Donaciones</h3>
            <p className="text-2xl font-bold text-gray-900">1,247</p>
            <p className="text-sm text-green-600">+12% vs mes anterior</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
            <p className="text-2xl font-bold text-gray-900">$103,500</p>
            <p className="text-sm text-green-600">+8% vs mes anterior</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Beneficiarios</h3>
            <p className="text-2xl font-bold text-gray-900">3,456</p>
            <p className="text-sm text-blue-600">+15% vs mes anterior</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Voluntarios Activos</h3>
            <p className="text-2xl font-bold text-gray-900">89</p>
            <p className="text-sm text-green-600">+5% vs mes anterior</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Líneas - Donaciones por Mes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Donaciones por Mes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donacionesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="donaciones" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Cantidad"
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Valor ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Pastel - Estado de Donaciones */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Estado de Donaciones</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadoDonaciones}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {estadoDonaciones.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras - Categorías */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Donaciones por Categoría</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoriasDonaciones}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Área - Eficiencia Voluntarios */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Eficiencia de Voluntarios</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={eficienciaVoluntarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="voluntario" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="eficiencia" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Radar - Métricas por Categoría */}
          <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Necesidades vs Donaciones por Categoría</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={metricasRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="categoria" />
                <PolarRadiusAxis />
                <Radar
                  name="Necesidades"
                  dataKey="A"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Donaciones"
                  dataKey="B"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de Distribuciones Recientes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
          <h2 className="text-xl font-semibold mb-4">Distribuciones Recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beneficiario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voluntario
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Familia González
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Alimentos
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completada
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    23/06/2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    María López
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Hogar San José
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Medicina
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      En Proceso
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    24/06/2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Juan Pérez
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;