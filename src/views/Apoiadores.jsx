import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apoiadoresData from '../data/apoiadores.json';
import './Views.css';

const Apoiadores = () => {
  const [apoiadores, setApoiadores] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('apoiadoresData');
    if (saved) {
      setApoiadores(JSON.parse(saved));
    } else {
      const initial = apoiadoresData.filter(item => item.APOIADOR);
      setApoiadores(initial);
      localStorage.setItem('apoiadoresData', JSON.stringify(initial));
    }
  }, []);

  const handleAgendaChange = (index, value) => {
    const updated = [...apoiadores];
    updated[index].AGENDA = value;
    setApoiadores(updated);
    localStorage.setItem('apoiadoresData', JSON.stringify(updated));
  };

  const engajamentoMap = {};
  const areaMap = {};

  apoiadores.forEach(item => {
    const eng = item['INDICADOR DE ENGAJAMENTO'] || 'Não definido';
    engajamentoMap[eng] = (engajamentoMap[eng] || 0) + 1;

    const area = item['ÁREA DE ATUAÇÃO'] || 'Não definida';
    areaMap[area] = (areaMap[area] || 0) + 1;
  });

  const engajamentoData = Object.keys(engajamentoMap).map(key => ({
    name: key,
    value: engajamentoMap[key]
  })).sort((a, b) => b.value - a.value);

  const areaData = Object.keys(areaMap).map(key => ({
    name: key,
    value: areaMap[key]
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['var(--color-primary)', 'var(--color-orange-text)', 'var(--color-green-text)', '#8b5cf6', '#ec4899'];

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>Apoiadores</h1>
        </div>
        <p>Gestão e visualização da base de apoiadores cadastrados.</p>
      </div>

      <div className="demo-grid mt-lg mb-lg">
        <div className="view-section">
          <h2>Indicadores de Engajamento</h2>
          <div className="chart-container" style={{ height: '300px', backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={engajamentoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {engajamentoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="view-section">
          <h2>Áreas de Atuação</h2>
          <div className="chart-container" style={{ height: '300px', backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} style={{ fontSize: '0.8rem' }} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="view-section mt-xl">
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)' }}>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Apoiador</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Município</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Área de Atuação</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Núcleo</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Engajamento</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Agenda</th>
              </tr>
            </thead>
            <tbody>
              {apoiadores.map((apoiador, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row-hover">
                  <td style={{ padding: '16px', fontWeight: '500' }}>{apoiador.APOIADOR}</td>
                  <td style={{ padding: '16px' }}>{apoiador['MUNICÍPIO']}</td>
                  <td style={{ padding: '16px' }}>{apoiador['ÁREA DE ATUAÇÃO']}</td>
                  <td style={{ padding: '16px' }}>{apoiador['NÚCLEO DE INDICAÇÃO']}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      backgroundColor: 
                        apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Muito Alto') || apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Alto') 
                          ? 'var(--color-green-bg)' 
                          : apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Médio') 
                            ? 'var(--color-orange-bg)' 
                            : 'var(--color-blue-bg)',
                      color: 
                        apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Muito Alto') || apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Alto') 
                          ? 'var(--color-green-text)' 
                          : apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Médio') 
                            ? 'var(--color-orange-text)' 
                            : 'var(--color-primary)'
                    }}>
                      {apoiador['INDICADOR DE ENGAJAMENTO']}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <input 
                      type="datetime-local" 
                      value={apoiador.AGENDA && apoiador.AGENDA !== 'A definir' ? apoiador.AGENDA : ''}
                      onChange={(e) => handleAgendaChange(index, e.target.value)}
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        cursor: 'pointer'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Apoiadores;
