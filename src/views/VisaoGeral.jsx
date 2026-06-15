import React, { useState, useEffect } from 'react';
import CountdownCard from '../components/dashboard/CountdownCard';
import StatCard from '../components/dashboard/StatCard';
import { Users, MapPin, CheckCircle, Info, HelpCircle, Calendar, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from '../components/ui/Modal';
import apoiadoresData from '../data/apoiadores.json';
import './Views.css';

const VisaoGeral = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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

  const totalApoiadores = apoiadores.length;
  const municipiosValidos = apoiadores.map(item => item['MUNICÍPIO']).filter(Boolean);
  const municipiosUnicos = new Set(municipiosValidos).size;

  const agendas = apoiadores
    .filter(item => item.AGENDA && item.AGENDA !== 'A definir')
    .map(item => {
      const dateObj = new Date(item.AGENDA);
      return {
        ...item,
        dateObj,
        timestamp: dateObj.getTime(),
      };
    })
    .filter(item => !isNaN(item.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp);

  const now = new Date().getTime();

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

      <div className="view-grid-top mb-lg">
        <CountdownCard />
        <div className="stats-col">
          <StatCard 
            title="Apoiadores Registrados" 
            value={totalApoiadores.toString()} 
            subtitle="Ativos na base" 
            icon={Users} 
            color="primary"
          />
          <StatCard 
            title="Municípios Alcançados" 
            value={municipiosUnicos.toString()} 
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
        <h2>Próximas Agendas</h2>
        <div className="goals-list">
          {agendas.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '12px' }}>Nenhuma agenda cadastrada no momento. Adicione agendas na aba Apoiadores.</div>
          ) : (
            agendas.slice(0, 5).map((agendaItem, idx) => {
              const isPast = agendaItem.timestamp < now;
              const dataFormatada = agendaItem.dateObj.toLocaleDateString('pt-BR');
              const horaFormatada = agendaItem.dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              const isVerySoon = !isPast && (agendaItem.timestamp - now < 86400000 * 3); // menos de 3 dias
              
              return (
                <div className={`goal-item ${isPast ? '' : 'pending'}`} key={idx}>
                  {isPast ? (
                    <CheckCircle className="text-green" size={24} />
                  ) : (
                    <Calendar className={isVerySoon ? "text-orange" : "text-gray"} size={24} />
                  )}
                  <div className="goal-content">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      Reunião com {agendaItem.APOIADOR}
                      {isVerySoon && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', backgroundColor: 'var(--color-orange-bg)', color: 'var(--color-orange-text)', padding: '2px 6px', borderRadius: '4px' }}>
                          <AlertCircle size={12} /> Próximo
                        </span>
                      )}
                    </h4>
                    <p>{agendaItem['MUNICÍPIO']} - {dataFormatada} às {horaFormatada}</p>
                  </div>
                </div>
              );
            })
          )}
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
