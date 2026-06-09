import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import VisaoGeral from './views/VisaoGeral';
import PerfilEleitorado from './views/PerfilEleitorado';
import DensidadeEleitoral from './views/DensidadeEleitoral';
import Mobilizacao from './views/Mobilizacao';
import './App.css';
import { Menu } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('geral');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'geral': return <VisaoGeral />;
      case 'perfil': return <PerfilEleitorado />;
      case 'densidade': return <DensidadeEleitoral />;
      case 'mobilizacao': return <Mobilizacao />;
      default: return <VisaoGeral />;
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile Header for hamburger menu */}
      <header className="mobile-header">
        <div className="logo-placeholder-mobile"></div>
        <h2>ATLAS ELEITORAL</h2>
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
