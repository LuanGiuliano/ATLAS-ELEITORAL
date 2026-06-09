import React, { useState } from 'react';
import CountdownCard from '../components/dashboard/CountdownCard';
import StatCard from '../components/dashboard/StatCard';
import { Users, MapPin, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from '../components/ui/Modal';
import './Views.css';

const VisaoGeral = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const evolutionData = [
    { name: 'Jan', apoiadores: 120 },
    { name: 'Fev', apoiadores: 350 },
    { name: 'Mar', apoiadores: 480 },
    { name: 'Abr', apoiadores: 750 },
    { name: 'Mai', apoiadores: 1020 },
    { name: 'Jun', apoiadores: 1245 },
  ];

  const regionData = [
    { name: 'Metropolitana', engajamento: 85 },
    { name: 'Sudeste', engajamento: 65 },
    { name: 'Sudoeste', engajamento: 40 },
    { name: 'Nordeste', engajamento: 55 },
    { name: 'Baixo Amazonas', engajamento: 70 },
  ];

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>Visão Geral</h1>
          <button 
            onClick={() => setIsHelpOpen(true)}
            style={{ color: 'var(--color-primary)', background: 'var(--color-blue-bg)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
          >
            <HelpCircle size={18} />
          </button>
        </div>
        <p>Resumo da campanha e panorama eleitoral.</p>
      </div>

      <div style={{ backgroundColor: 'var(--color-orange-bg)', color: 'var(--color-orange-text)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '0.95rem' }}>
        <Info size={20} />
        <span>Os valores numéricos e os gráficos exibidos nesta tela são apenas para fins de demonstração (Mock Data).</span>
      </div>

      <div className="view-grid-top mb-lg">
        <CountdownCard />
        <div className="stats-col">
          <StatCard 
            title="Apoiadores Registrados" 
            value="1.245" 
            subtitle="+12% esta semana" 
            icon={Users} 
            color="primary"
          />
          <StatCard 
            title="Municípios Visitados" 
            value="34" 
            subtitle="de 144" 
            icon={MapPin} 
            color="orange"
          />
        </div>
      </div>

      <div className="demo-grid mt-xl">
        <div className="view-section">
          <h2>Evolução de Apoiadores</h2>
          <div className="chart-container" style={{ height: '300px', backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Line type="monotone" dataKey="apoiadores" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="view-section">
          <h2>Engajamento por Região</h2>
          <div className="chart-container" style={{ height: '300px', backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="engajamento" fill="var(--color-green-text)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="view-section mt-xl">
        <h2>Metas da Semana</h2>
        <div className="goals-list">
          <div className="goal-item">
            <CheckCircle className="text-green" size={24} />
            <div className="goal-content">
              <h4>Reunião com lideranças da Zona Norte</h4>
              <p>Realizado em 12 de Outubro. 50+ pessoas presentes.</p>
            </div>
          </div>
          <div className="goal-item pending">
            <CheckCircle className="text-gray" size={24} />
            <div className="goal-content">
              <h4>Visita ao sindicato dos professores</h4>
              <p>Agendado para 15 de Outubro.</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Sobre a Visão Geral">
        <p>A aba <strong>Visão Geral</strong> é o painel de controle principal da campanha. Ela consolida as métricas mais importantes para que você saiba a situação atual em um relance.</p>
        <p><strong>Elementos da tela:</strong></p>
        <ul>
          <li><strong>Contagem Regressiva:</strong> Exibe quantos dias faltam para a eleição e o progresso da campanha desde o início.</li>
          <li><strong>Métricas Rápidas:</strong> Mostra o volume de apoiadores e a cobertura de municípios (meta vs. realidade).</li>
          <li><strong>Gráficos:</strong> Acompanhe a tendência de crescimento (linha) e compare o sucesso das ações nas diferentes macrorregiões do estado (barras).</li>
        </ul>
      </Modal>
    </div>
  );
};

export default VisaoGeral;
