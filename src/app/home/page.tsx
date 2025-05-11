'use client';

import { useEffect, useState } from 'react';
import api from '@/service/api';

import { useBudgetContext } from '@/hooks/budget';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import style from './style.module.css';

export default function Home() {
  const { toggleBudget, budget } = useBudgetContext();

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    }

    fetchClientes();
  }, []);

  // Dados para gráfico de colunas
  const barData = [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Abr', value: 200 },
  ];

  // Dados para gráfico de pizza
  const pieData = [
    { name: 'Maquina de lavar', value: 230 },
    { name: 'Geladeira', value: 300 },
    { name: 'Aspirador', value: 20 },
    { name: 'Litificador', value: 300 },
    { name: 'Fogão eletrico', value: 10 },
    { name: 'Microndas', value: 50 }
  ];

  const COLORS = ['#A8D5BA', '#FBC3BC', '#FBE7C6', '#C3AED6', '#BEE3DB', '#F5D5CB'];

  return (
    <div style={{ padding: '2rem' }}>
    <h2>Dashboard</h2>
    <section className={style.container_tables}>
    <div style={{ width: '100%', maxWidth: 600, height: 300, marginTop: '2rem' }}>
        <h2>Gráfico de Faturamento</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#A8D5E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', maxWidth: 600, height: 300, marginTop: '2rem' }}>
        <h2>Gráfico de Atendimento</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#A8D5E2"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
    </div>
  );
}
