import React from 'react';
import Card from '../ui/Card';
import IconBadge from '../ui/IconBadge';
import './ActionCard.css';

const ActionCard = ({ title, icon: Icon, color, onClick }) => {
  return (
    <Card className="action-card" onClick={onClick}>
      <IconBadge icon={Icon} color={color} size={20} />
      <span className="action-card-title">{title}</span>
    </Card>
  );
};

export default ActionCard;
