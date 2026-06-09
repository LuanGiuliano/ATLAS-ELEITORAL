import React, { useState } from 'react';
import { Megaphone, MessageSquare, PhoneCall, HelpCircle } from 'lucide-react';
import ActionCard from '../components/dashboard/ActionCard';
import Modal from '../components/ui/Modal';
import './Views.css';

const Mobilizacao = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>Mobilização</h1>
          <button 
            onClick={() => setIsHelpOpen(true)}
            style={{ color: 'var(--color-primary)', background: 'var(--color-blue-bg)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
          >
            <HelpCircle size={18} />
          </button>
        </div>
        <p>Ações estratégicas, comunicação e direcionamento de equipe.</p>
      </div>

      <div className="demo-grid mb-lg">
        <ActionCard title="Campanha de SMS" icon={MessageSquare} color="blue" />
        <ActionCard title="Call Center" icon={PhoneCall} color="green" />
        <ActionCard title="Eventos de Rua" icon={Megaphone} color="red" />
      </div>

      <div className="view-section mt-xl">
        <h2>Próximas Ações Recomendadas (IA)</h2>
        <div className="goals-list">
          <div className="goal-item">
            <div className="goal-content">
              <h4>Reforço na Zona Leste</h4>
              <p>A queda de engajamento sugere necessidade de mobilização urgente no bairro X. Ação recomendada: Carro de som no final de semana.</p>
            </div>
          </div>
          <div className="goal-item">
            <div className="goal-content">
              <h4>Foco no Eleitorado Jovem</h4>
              <p>Aprovação de pautas estudantis. Ação recomendada: Divulgar vídeo curto no TikTok/Instagram segmentado para universitários.</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Sobre a Mobilização">
        <p>A aba de <strong>Mobilização</strong> é a sua central de comando para ações práticas no mundo real e no digital.</p>
        <p><strong>Recursos principais:</strong></p>
        <ul>
          <li><strong>Disparo de Ações:</strong> Atalhos diretos para iniciar campanhas massivas (ex: disparos de SMS ou integração com equipes de telemarketing).</li>
          <li><strong>Inteligência Estratégica (Recomendações):</strong> Com base nos dados lidos do mapa e do perfil do eleitorado, o sistema sugere automaticamente a melhor ação a ser tomada (onde ir, com qual discurso, em que formato).</li>
        </ul>
      </Modal>
    </div>
  );
};

export default Mobilizacao;
