import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit2, Database, RefreshCw } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { supabase } from '../lib/supabase';
import { municipiosPA } from '../data/municipiosPA';
import './Views.css';

const Apoiadores = () => {
  const [apoiadores, setApoiadores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('Desconectado');
  
  const initialState = {
    nome: '',
    municipio: '',
    area_atuacao: '',
    nucleo_indicacao: '',
    faixa_etaria: '',
    telefone: '',
    agenda: ''
  };
  
  const [novoApoiador, setNovoApoiador] = useState(initialState);

  const fetchApoiadores = async () => {
    setIsLoading(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setDbStatus('Faltando .env');
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.from('apoiadores').select('*');
      if (error) throw error;
      setApoiadores(data || []);
      setDbStatus('Conectado');
    } catch (error) {
      console.error('Erro ao buscar apoiadores:', error);
      setDbStatus('Erro de Conexão');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApoiadores();
  }, []);

  const handleAgendaChange = async (index, value) => {
    const apoiadorId = apoiadores[index].id;
    if (!apoiadorId) return;

    try {
      const { error } = await supabase.from('apoiadores').update({ agenda: value }).eq('id', apoiadorId);
      if (error) throw error;
      
      const updated = [...apoiadores];
      updated[index].agenda = value;
      setApoiadores(updated);
    } catch (error) {
      console.error('Erro ao atualizar agenda:', error);
    }
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

  const handleSaveApoiador = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editIndex !== null && novoApoiador.id) {
        // Editar
        const { error } = await supabase.from('apoiadores').update({
          nome: novoApoiador.nome,
          municipio: novoApoiador.municipio,
          area_atuacao: novoApoiador.area_atuacao,
          nucleo_indicacao: novoApoiador.nucleo_indicacao,
          faixa_etaria: novoApoiador.faixa_etaria,
          telefone: novoApoiador.telefone,
          agenda: novoApoiador.agenda
        }).eq('id', novoApoiador.id);
        if (error) throw error;
      } else {
        // Criar
        const { error } = await supabase.from('apoiadores').insert([{
          nome: novoApoiador.nome,
          municipio: novoApoiador.municipio,
          area_atuacao: novoApoiador.area_atuacao,
          nucleo_indicacao: novoApoiador.nucleo_indicacao,
          faixa_etaria: novoApoiador.faixa_etaria,
          telefone: novoApoiador.telefone,
          agenda: novoApoiador.agenda
        }]);
        if (error) throw error;
      }
      
      await fetchApoiadores();
      setIsLoading(false);
      setIsModalOpen(false);
      setEditIndex(null);
      setNovoApoiador(initialState);
    } catch (error) {
      console.error('Erro ao salvar apoiador:', error);
      setIsLoading(false);
      alert('Erro ao salvar apoiador no banco de dados.');
    }
  };

  const areaMap = {};

  apoiadores.forEach(item => {
    const area = item.area_atuacao || 'Não definida';
    areaMap[area] = (areaMap[area] || 0) + 1;
  });

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
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '12px', backgroundColor: dbStatus === 'Conectado' ? 'var(--color-green-bg)' : 'var(--color-orange-bg)', color: dbStatus === 'Conectado' ? 'var(--color-green-text)' : 'var(--color-orange-text)', fontWeight: '600' }}>
              <Database size={12} />
              {dbStatus}
            </span>
          </div>
          <p>Gestão e visualização da base de apoiadores cadastrados no banco de dados.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-secondary" 
            onClick={fetchApoiadores}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>

          <button 
            className="btn-primary" 
            onClick={handleOpenAddModal}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
          >
            <Plus size={18} />
            Adicionar Apoiador
          </button>
        </div>
      </div>

      <div className="demo-grid mt-lg mb-lg">


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
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Quem Indicou?</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Telefone</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>Agenda</th>
                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {apoiadores.map((apoiador, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row-hover">
                  <td style={{ padding: '16px', fontWeight: '500' }}>{apoiador.nome}</td>
                  <td style={{ padding: '16px' }}>{apoiador.municipio}</td>
                  <td style={{ padding: '16px' }}>{apoiador.area_atuacao}</td>
                  <td style={{ padding: '16px' }}>{apoiador.nucleo_indicacao}</td>
                  <td style={{ padding: '16px' }}>{apoiador.telefone || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <input 
                      type="datetime-local" 
                      value={apoiador.agenda && apoiador.agenda !== 'A definir' ? apoiador.agenda : ''}
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
            <input required type="text" name="nome" value={novoApoiador.nome || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Município</label>
            <select required name="municipio" value={novoApoiador.municipio || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', appearance: 'none' }}>
              <option value="">Selecione a sua cidade...</option>
              {municipiosPA.map(mun => (
                <option key={mun} value={mun}>{mun}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Área de Atuação</label>
            <input type="text" name="area_atuacao" value={novoApoiador.area_atuacao || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Quem lhe indicou?</label>
            <input type="text" name="nucleo_indicacao" value={novoApoiador.nucleo_indicacao || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Faixa Etária</label>
            <select name="faixa_etaria" value={novoApoiador.faixa_etaria || ''} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
              <option value="">Selecione...</option>
              <option value="16-24 anos">16-24 anos</option>
              <option value="25-34 anos">25-34 anos</option>
              <option value="35-44 anos">35-44 anos</option>
              <option value="45-59 anos">45-59 anos</option>
              <option value="60+ anos">60+ anos</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Telefone</label>
            <input type="tel" name="telefone" value={novoApoiador.telefone || ''} onChange={handleInputChange} placeholder="(00) 00000-0000" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }} />
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
