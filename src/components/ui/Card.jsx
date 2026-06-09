import React from 'react';
import './Card.css';

const Card = ({ children, className = '', onClick, variant = 'default' }) => {
  const classes = `ui-card ui-card-${variant} ${className} ${onClick ? 'ui-card-clickable' : ''}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
