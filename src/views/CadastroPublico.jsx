import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { municipiosPA } from '../data/municipiosPA';
import './Views.css'; // reaproveitar alguns estilos globais
import { CheckCircle2, User, MapPin, Briefcase, Users, Phone, Calendar } from 'lucide-react';

const CadastroPublico = () => {
  const [formData, setFormData] = useState({
    nome: '',
    municipio: '',
    area_atuacao: '',
    nucleo: '',
    faixa_etaria: '',
    telefone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Inserir no Supabase na tabela "apoiadores"
      const { data, error } = await supabase
        .from('apoiadores')
        .insert([
          {
            nome: formData.nome,
            municipio: formData.municipio,
            area_atuacao: formData.area_atuacao,
            nucleo_indicacao: formData.nucleo,
            faixa_etaria: formData.faixa_etaria,
            telefone: formData.telefone
          }
        ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErrorMsg('Ocorreu um erro ao enviar seu cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)', padding: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px 30px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <CheckCircle2 size={64} color="var(--color-green-text)" style={{ margin: '0 auto 20px auto' }} />
          <h2 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>Cadastro Realizado!</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Obrigado por se juntar a nós. Suas informações foram registradas com sucesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundImage: 'url(/fundo-cadastro.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '20px' 
    }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="Logo VoteElieth" style={{ width: '120px', height: 'auto', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>Faça parte do nosso Time</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Preencha seus dados para receber as novidades e ficar por dentro das atualizações da nossa campanha. <strong style={{ color: 'var(--color-primary)' }}>#VoteEliete</strong></p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red-text)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Nome Completo *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input required type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite seu nome" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Telefone *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input required type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Município *</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select required name="municipio" value={formData.municipio} onChange={handleChange} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}>
                <option value="">Selecione a sua cidade...</option>
                {municipiosPA.map(mun => (
                  <option key={mun} value={mun}>{mun}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Área de Atuação</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" name="area_atuacao" value={formData.area_atuacao} onChange={handleChange} placeholder="Ex: Educação, Saúde..." style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Quem lhe indicou?</label>
              <div style={{ position: 'relative' }}>
                <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" name="nucleo" value={formData.nucleo} onChange={handleChange} placeholder="Opcional" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Faixa Etária</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select name="faixa_etaria" value={formData.faixa_etaria} onChange={handleChange} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}>
                  <option value="">Selecione...</option>
                  <option value="16-24 anos">16-24 anos</option>
                  <option value="25-34 anos">25-34 anos</option>
                  <option value="35-44 anos">35-44 anos</option>
                  <option value="45-59 anos">45-59 anos</option>
                  <option value="60+ anos">60+ anos</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '12px', 
              padding: '14px', 
              borderRadius: '8px', 
              backgroundColor: loading ? 'var(--text-muted)' : 'var(--color-primary)', 
              color: 'white', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '600', 
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Enviando...' : 'Confirmar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroPublico;
