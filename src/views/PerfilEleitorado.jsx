import React, { useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
import { Users, User, Map, HelpCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import './Views.css';

const PerfilEleitorado = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>Perfil do Eleitorado</h1>
          <button 
            onClick={() => setIsHelpOpen(true)}
            style={{ color: 'var(--color-primary)', background: 'var(--color-blue-bg)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
          >
            <HelpCircle size={18} />
          </button>
        </div>
        <p>Análise demográfica detalhada da base de apoio.</p>
      </div>

      <div className="demo-grid mb-lg">
        <StatCard 
          title="Feminino" 
          value="58%" 
          subtitle="Maioria do eleitorado" 
          icon={User} 
          color="purple"
        />
        <StatCard 
          title="Jovens (16-24)" 
          value="24%" 
          subtitle="Crescimento de 5% no trimestre" 
          icon={Users} 
          color="green"
        />
        <StatCard 
          title="Zona Urbana" 
          value="72%" 
          subtitle="Concentração na capital" 
          icon={Map} 
          color="primary"
        />
      </div>

      <div className="demo-grid mt-xl">
        <div className="view-section">
          <h2>Distribuição por Faixa Etária</h2>
          <div className="chart-placeholder">
            [Gráfico de Barras: Faixa Etária]
          </div>
        </div>
        
        <div className="view-section">
          <h2>Escolaridade</h2>
          <div className="chart-placeholder">
            [Gráfico de Pizza: Nível de Escolaridade]
          </div>
        </div>
      </div>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Sobre o Perfil do Eleitorado">
        <p>A aba <strong>Perfil do Eleitorado</strong> foca nas características sociodemográficas das pessoas que apoiam a candidata ou interagem com a campanha.</p>
        <p><strong>Elementos da tela:</strong></p>
        <ul>
          <li><strong>Cards Demográficos:</strong> Mostram os recortes mais importantes do eleitorado em tempo real (Gênero, Idade e Localização).</li>
          <li><strong>Métricas de Crescimento:</strong> Acompanha qual público está engajando mais rápido para guiar o direcionamento de anúncios.</li>
          <li><strong>Gráficos Avançados (Breve):</strong> Detalhamentos maiores sobre faixa etária, escolaridade e renda permitirão discursos políticos mais precisos.</li>
        </ul>
      </Modal>
    </div>
  );
};

export default PerfilEleitorado;
