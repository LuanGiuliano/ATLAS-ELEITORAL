import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import apoiadoresData from '../data/apoiadores.json';
import './Views.css';

const Apoiadores = () => {
  const [apoiadores, setApoiadores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  const initialState = {
    APOIADOR: '',
    'MUNICÍPIO': '',
    'ÁREA DE ATUAÇÃO': '',
    'NÚCLEO DE INDICAÇÃO': '',
    'INDICADOR DE ENGAJAMENTO': '',
    'CONTATO': '',
    'FAIXA_ETARIA': '',
    'OBSERVACOES': ''
  };
  
  const [novoApoiador, setNovoApoiador] = useState(initialState);

  useEffect(() => {
    const saved = localStorage.getItem('apoiadoresData');
    if (saved) {
      setApoiadores(JSON.parse(saved));
    } else {
      const initial = apoiadoresData.filter(item => item.APOIADOR);
      setApoiadores(initial);
      localStorage.setItem('apoiadoresData', JSON.stringify(initial));
    }
  }, []);

  const handleAgendaChange = (index, value) => {
    const updated = [...apoiadores];
    updated[index].AGENDA = value;
    setApoiadores(updated);
    localStorage.setItem('apoiadoresData', JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoApoiador(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setNovoApoiador(apoiadores[index]);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditIndex(null);
    setNovoApoiador(initialState);
    setIsModalOpen(true);
  };

  const handleSaveApoiador = (e) => {
    e.preventDefault();
    let updated;
    if (editIndex !== null) {
      updated = [...apoiadores];
      updated[editIndex] = novoApoiador;
    } else {
      updated = [...apoiadores, novoApoiador];
    }
    setApoiadores(updated);
    localStorage.setItem('apoiadoresData', JSON.stringify(updated));
    setIsModalOpen(false);
    setEditIndex(null);
    setNovoApoiador(initialState);
  };

  const engajamentoMap = {};
  const areaMap = {};

  apoiadores.forEach(item => {
    const eng = item['INDICADOR DE ENGAJAMENTO'] || 'Não definido';
    engajamentoMap[eng] = (engajamentoMap[eng] || 0) + 1;

    const area = item['ÁREA DE ATUAÇÃO'] || 'Não definida';
    areaMap[area] = (areaMap[area] || 0) + 1;
  });

  const engajamentoData = Object.keys(engajamentoMap).map(key => ({
    name: key,
    value: engajamentoMap[key]
  })).sort((a, b) => b.value - a.value);

  const areaData = Object.keys(areaMap).map(key => ({
    name: key,
    value: areaMap[key]
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['var(--color-primary)', 'var(--color-orange-text)', 'var(--color-green-text)', '#8b5cf6', '#ec4899'];

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1>Apoiadores</h1>
          </div>
          <p>Gestão e visualização da base de apoiadores cadastrados.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleOpenAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
        >
          <Plus size={18} />
          Adicionar Apoiador
        </button>
      </div>

      <div className="demo-grid mt-lg mb-lg">
        <div className="view-section">
          <h2>Indicadores de Engajamento</h2>
          <div className="chart-container" style={{ height: '300px', backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={engajamentoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {engajamentoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="view-section">
          <h2>Áreas de Atuação</h2>
          <div className="chart-container" style={{ height: '300px', backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} style={{ fontSize: '0.8rem' }} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="view-section mt-xl">
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)' }}>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Apoiador</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Município</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Área de Atuação</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Núcleo</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Engajamento</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Contato</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Agenda</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {apoiadores.map((apoiador, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row-hover">
                  <td style={{ padding: '16px', fontWeight: '500' }}>{apoiador.APOIADOR}</td>
                  <td style={{ padding: '16px' }}>{apoiador['MUNICÍPIO']}</td>
                  <td style={{ padding: '16px' }}>{apoiador['ÁREA DE ATUAÇÃO']}</td>
                  <td style={{ padding: '16px' }}>{apoiador['NÚCLEO DE INDICAÇÃO']}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      backgroundColor: 
                        apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Muito Alto') || apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Alto') 
                          ? 'var(--color-green-bg)' 
                          : apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Médio') 
                            ? 'var(--color-orange-bg)' 
                            : 'var(--color-blue-bg)',
                      color: 
                        apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Muito Alto') || apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Alto') 
                          ? 'var(--color-green-text)' 
                          : apoiador['INDICADOR DE ENGAJAMENTO']?.includes('Médio') 
                            ? 'var(--color-orange-text)' 
                            : 'var(--color-primary)'
                    }}>
                      {apoiador['INDICADOR DE ENGAJAMENTO']}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>{apoiador.CONTATO || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <input 
                      type="datetime-local" 
                      value={apoiador.AGENDA && apoiador.AGENDA !== 'A definir' ? apoiador.AGENDA : ''}
                      onChange={(e) => handleAgendaChange(index, e.target.value)}
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        cursor: 'pointer'
                      }}
                    />
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEditClick(index)}
                      style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      title="Editar Apoiador"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editIndex !== null ? "Editar Apoiador" : "Adicionar Novo Apoiador"}>
        <form onSubmit={handleSaveApoiador} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Nome do Apoiador</label>
            <input required type="text" name="APOIADOR" value={novoApoiador.APOIADOR || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Município</label>
            <input required type="text" name="MUNICÍPIO" value={novoApoiador['MUNICÍPIO'] || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Área de Atuação</label>
            <input type="text" name="ÁREA DE ATUAÇÃO" value={novoApoiador['ÁREA DE ATUAÇÃO'] || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Núcleo de Indicação</label>
            <input type="text" name="NÚCLEO DE INDICAÇÃO" value={novoApoiador['NÚCLEO DE INDICAÇÃO'] || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Engajamento</label>
            <select name="INDICADOR DE ENGAJAMENTO" value={novoApoiador['INDICADOR DE ENGAJAMENTO'] || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
              <option value="">Selecione...</option>
              <option value="Muito Alto">Muito Alto</option>
              <option value="Alto">Alto</option>
              <option value="Médio">Médio</option>
              <option value="Baixo">Baixo</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Faixa Etária</label>
            <select name="FAIXA_ETARIA" value={novoApoiador.FAIXA_ETARIA || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
              <option value="">Selecione...</option>
              <option value="16-24 anos">16-24 anos</option>
              <option value="25-34 anos">25-34 anos</option>
              <option value="35-44 anos">35-44 anos</option>
              <option value="45-59 anos">45-59 anos</option>
              <option value="60+ anos">60+ anos</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Informações de Contato</label>
            <input type="text" name="CONTATO" value={novoApoiador.CONTATO || ''} onChange={handleInputChange} placeholder="Email, Telefone, etc." style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Outras Informações (Opcional)</label>
            <textarea name="OBSERVACOES" value={novoApoiador.OBSERVACOES || ''} onChange={handleInputChange} placeholder="Anotações adicionais, histórico, etc." rows={3} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Apoiadores;
