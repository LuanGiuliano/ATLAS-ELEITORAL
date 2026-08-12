import React from 'react';
import { LayoutDashboard, Users, Map, Megaphone } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'perfil', label: 'Perfil do Eleitorado', icon: Users },
    { id: 'densidade', label: 'Densidade Eleitoral', icon: Map },
    { id: 'mobilizacao', label: 'Mobilização', icon: Megaphone },
    { id: 'apoiadores', label: 'Apoiadores', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo VoteElieth" style={{ width: '120px', height: 'auto', maxHeight: '80px', objectFit: 'contain' }} />
        <h2>VoteElieth</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="sidebar-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">D</div>
          <div className="user-info">
            <span className="user-name">Deputada Federal</span>
            <span className="user-role">Campanha 2026</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
