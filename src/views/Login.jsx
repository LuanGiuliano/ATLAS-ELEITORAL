import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simula um tempo de carregamento para dar sensação de sistema real
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <img src="/logo.png" alt="Logo VoteElieth" style={{ width: '100px', marginBottom: '16px', borderRadius: '8px' }} />
          <h1>VoteElieth</h1>
          <p>Acesso Restrito ao Painel de Comando</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail ou Usuário</label>
            <input 
              type="text" 
              id="email" 
              placeholder="Digite seu acesso" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="login-footer">
          <p>Ambiente Seguro e Monitorado (SSL/TLS)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
