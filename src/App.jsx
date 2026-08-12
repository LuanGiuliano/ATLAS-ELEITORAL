import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import VisaoGeral from './views/VisaoGeral';
import PerfilEleitorado from './views/PerfilEleitorado';
import DensidadeEleitoral from './views/DensidadeEleitoral';
import Mobilizacao from './views/Mobilizacao';
import Apoiadores from './views/Apoiadores';
import Login from './views/Login';
import './App.css';
import { Menu } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'geral': return <VisaoGeral />;
      case 'perfil': return <PerfilEleitorado />;
      case 'densidade': return <DensidadeEleitoral />;
      case 'mobilizacao': return <Mobilizacao />;
      case 'apoiadores': return <Apoiadores />;
      default: return <VisaoGeral />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-layout">
      {/* Mobile Header for hamburger menu */}
      <header className="mobile-header">
        <img src="/logo.png" alt="Logo VoteElieth" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', backgroundColor: 'white' }} />
        <h2>VoteElieth</h2>
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`sidebar-container ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false); // Close menu on mobile after selection
          }} 
        />
      </div>

      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
