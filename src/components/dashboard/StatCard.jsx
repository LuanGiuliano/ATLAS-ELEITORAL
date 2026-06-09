import React from 'react';
import Card from '../ui/Card';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => {
  return (
    <Card className={`stat-card stat-card-${color}`}>
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        {Icon && (
          <div className={`stat-icon-wrapper bg-${color}`}>
            <Icon className={`stat-icon text-${color}`} size={20} />
          </div>
        )}
      </div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </Card>
  );
};

export default StatCard;
