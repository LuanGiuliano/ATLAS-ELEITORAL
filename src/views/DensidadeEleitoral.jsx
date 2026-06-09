import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Views.css';
import Pill from '../components/ui/Pill';
import { Map, Flame, Info, HelpCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';

const DensidadeEleitoral = () => {
  const [geoData, setGeoData] = useState(null);
  const [mapMode, setMapMode] = useState('densidade'); // 'densidade' ou 'calor'
  const [mockDataMap, setMockDataMap] = useState({});
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    fetch('/para-muni.json')
      .then(res => res.json())
      .then(data => {
        const mockMap = {};
        data.features.forEach(feature => {
          const id = feature.properties.codarea;
          mockMap[id] = {
            densidade: Math.random(),
            calor: Math.random()
          };
        });
        setMockDataMap(mockMap);
        setGeoData(data);
      })
      .catch(err => console.error('Erro ao carregar mapa:', err));
  }, []);

  const getStyle = (feature) => {
    const id = feature.properties.codarea;
    const data = mockDataMap[id];
    let color = '#ccc';
    let fillOpacity = 0.3;
    let weight = 0.5;
    let borderColor = 'white';

    if (data) {
      if (mapMode === 'densidade') {
        color = `hsl(217, 90%, ${100 - (data.densidade * 60)}%)`; 
        fillOpacity = 0.8;
      } else {
        color = `hsl(0, 90%, ${100 - (data.calor * 50)}%)`;
        fillOpacity = 0.8;
      }
    }

    return {
      fillColor: color,
      weight: weight,
      opacity: 1,
      color: borderColor,
      fillOpacity: fillOpacity
    };
  };

  const onEachFeature = (feature, layer) => {
    const id = feature.properties.codarea;
    const name = feature.properties.name || feature.properties.nome || `Município ${id}`;
    const data = mockDataMap[id];
    
    const valText = data ? `Valor: ${(data[mapMode] * 100).toFixed(1)}%` : 'Sem dados';
    
    layer.bindTooltip(`
      <div style="text-align: center;">
        <strong>${name}</strong><br/>
        <span style="font-size: 0.85em; opacity: 0.8;">${valText}</span>
      </div>
    `, {
      permanent: false,
      direction: 'center',
      className: 'map-tooltip'
    });
  };

  const topMunicipios = [
    { nome: 'Belém', votos: '250k votos', progresso: '85%' },
    { nome: 'Ananindeua', votos: '95k votos', progresso: '65%' },
    { nome: 'Santarém', votos: '58k votos', progresso: '45%' },
    { nome: 'Marabá', votos: '42k votos', progresso: '35%' },
    { nome: 'Parauapebas', votos: '35k votos', progresso: '30%' },
  ];

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ margin: 0 }}>Densidade Eleitoral - Pará</h1>
              <button 
                onClick={() => setIsHelpOpen(true)}
                style={{ color: 'var(--color-primary)', background: 'var(--color-blue-bg)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
              >
                <HelpCircle size={18} />
              </button>
            </div>
            <p style={{ margin: '8px 0 0 0' }}>Distribuição territorial e concentração de votos potenciais nos 144 municípios do PA.</p>
          </div>
        </div>
        
        <div className="pill-group">
          <Pill 
            icon={Map} 
            active={mapMode === 'densidade'}
            onClick={() => setMapMode('densidade')}
          >
            Densidade
          </Pill>
          <Pill 
            icon={Flame} 
            active={mapMode === 'calor'}
            onClick={() => setMapMode('calor')}
          >
            Calor
          </Pill>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-orange-bg)', color: 'var(--color-orange-text)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '0.95rem' }}>
        <Info size={20} />
        <span>Os valores numéricos e as cores exibidas no mapa e nos gráficos abaixo são apenas para fins de demonstração visual (Mock Data).</span>
      </div>

      <div className="view-section">
        <div className="chart-container" style={{ height: '550px', backgroundColor: '#e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          {geoData ? (
            <MapContainer 
              center={[-3.8, -52.2]} 
              zoom={5} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <GeoJSON 
                key={mapMode}
                data={geoData} 
                style={getStyle}
                onEachFeature={onEachFeature}
              />
            </MapContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
              Carregando municípios do Pará...
            </div>
          )}
        </div>
      </div>

      <div className="view-section mt-xl">
        <h2>Top 5 Municípios (Potencial Eleitoral)</h2>
        <div className="goals-list">
          {topMunicipios.map((mun, idx) => (
            <div className="goal-item" key={idx}>
              <div className="goal-content" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>{mun.nome}</h4>
                  <span className="text-green font-bold">{mun.votos}</span>
                </div>
                <div className="progress-bar-bg" style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: '8px', marginTop: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: mun.progresso, backgroundColor: 'var(--color-primary)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Sobre a Densidade Eleitoral">
        <p>A aba de <strong>Densidade Eleitoral</strong> responde à pergunta mais crítica de uma campanha: "Onde estão nossos votos?".</p>
        <p><strong>Recursos disponíveis:</strong></p>
        <ul>
          <li><strong>Mapa Interativo:</strong> Exibe a força da campanha estado afora. Passes o mouse nas cidades para ver informações rápidas.</li>
          <li><strong>Modo Densidade (Azul):</strong> Mapeia onde o volume total de apoiadores é maior em números absolutos.</li>
          <li><strong>Modo Calor (Vermelho):</strong> Alerta visualmente onde existem pontos críticos de engajamento (municípios prioritários ou que requerem atenção urgente).</li>
          <li><strong>Top 5:</strong> Um ranking rápido indicando quais cidades oferecem a maior alavancagem eleitoral para direcionar comícios.</li>
        </ul>
      </Modal>
    </div>
  );
};

export default DensidadeEleitoral;
