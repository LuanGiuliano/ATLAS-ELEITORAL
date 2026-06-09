import React from 'react';
import './IconBadge.css';

const IconBadge = ({ icon: Icon, color = 'blue', size = 24 }) => {
  return (
    <div className={`ui-icon-badge ui-icon-badge-${color}`}>
      <Icon size={size} className="ui-icon" />
    </div>
  );
};

export default IconBadge;
