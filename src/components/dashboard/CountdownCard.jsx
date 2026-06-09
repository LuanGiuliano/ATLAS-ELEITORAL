import React, { useMemo } from 'react';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Card from '../ui/Card';
import { Calendar } from 'lucide-react';
import './CountdownCard.css';

const CountdownCard = () => {
  const electionDate = new Date(2026, 9, 4); // October 4, 2026
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025 (campaign start reference)
  
  const { daysLeft, progress, totalDays } = useMemo(() => {
    const today = new Date();
    const total = differenceInDays(electionDate, startDate);
    const left = differenceInDays(electionDate, today);
    const passed = total - left;
    const prog = Math.min(Math.max((passed / total) * 100, 0), 100);
    
    return {
      daysLeft: left > 0 ? left : 0,
      progress: prog,
      totalDays: total
    };
  }, []);

  return (
    <Card variant="primary" className="countdown-card">
      <div className="countdown-header">
        <h2 className="countdown-title">ELEIÇÃO 2026</h2>
        <Calendar className="countdown-icon" size={20} />
      </div>
      
      <div className="countdown-body">
        <div className="countdown-number">{daysLeft}</div>
        <div className="countdown-label">dias restantes</div>
      </div>
      
      <div className="countdown-footer">
        <div className="progress-labels">
          <span>jan 2025</span>
          <span>{Math.round(progress)}% cumprido</span>
          <span>out 2026</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default CountdownCard;
