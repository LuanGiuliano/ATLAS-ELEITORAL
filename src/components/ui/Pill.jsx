import React from 'react';
import './Pill.css';

const Pill = ({ children, icon: Icon, active, onClick }) => {
  return (
    <button 
      className={`ui-pill ${active ? 'ui-pill-active' : ''}`}
      onClick={onClick}
    >
      {Icon && <Icon className="ui-pill-icon" size={16} />}
      <span className="ui-pill-text">{children}</span>
    </button>
  );
};

export default Pill;
