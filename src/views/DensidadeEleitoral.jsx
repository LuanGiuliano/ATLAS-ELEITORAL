import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Views.css';
import Pill from '../components/ui/Pill';
import { Map, Flame, Info, HelpCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import apoiadoresData from '../data/apoiadores.json';

const DensidadeEleitoral = () => {
  const [geoData, setGeoData] = useState(null);
  const [mapMode, setMapMode] = useState('densidade'); // 'densidade' ou 'calor'
  const [realDataMap, setRealDataMap] = useState({});
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const normalizeString = (str) => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  };

  useEffect(() => {
    const saved = localStorage.getItem('apoiadoresData');
    let dataList = [];
    if (saved) {
      dataList = JSON.parse(saved);
    } else {
      dataList = apoiadoresData.filter(item => item.APOIADOR);
      localStorage.setItem('apoiadoresData', JSON.stringify(dataList));
    }

    const dataMap = {};
    dataList.forEach(item => {
      const municipio = item['MUNICÍPIO'];
      if (!municipio) return;
      
      // Alguns tem "Belém ou Vigia", vamos pegar o primeiro
      const munPrimary = municipio.split(' ou ')[0];
      const normMun = normalizeString(munPrimary);

      if (!dataMap[normMun]) {
        dataMap[normMun] = { count: 0, agendas: [], apoiadores: [], maxEngajamento: 0 };
      }
      dataMap[normMun].count += 1;
      dataMap[normMun].apoiadores.push(item);
      
      const eng = item['INDICADOR DE ENGAJAMENTO'] || '';
      if (eng.includes('Muito Alto')) dataMap[normMun].maxEngajamento = Math.max(dataMap[normMun].maxEngajamento, 3);
      else if (eng.includes('Alto')) dataMap[normMun].maxEngajamento = Math.max(dataMap[normMun].maxEngajamento, 2);
      else if (eng.includes('Médio')) dataMap[normMun].maxEngajamento = Math.max(dataMap[normMun].maxEngajamento, 1);
      
      if (item.AGENDA && item.AGENDA !== 'A definir') {
        dataMap[normMun].agendas.push({
          apoiador: item.APOIADOR,
          agenda: item.AGENDA
        });
      }
    });

    setRealDataMap(dataMap);

    fetch('/para-muni.json')
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
      })
      .catch(err => console.error('Erro ao carregar mapa:', err));
  }, []);

  const getStyle = (feature) => {
    const name = feature.properties.name || feature.properties.nome;
    const normMun = normalizeString(name);
    const data = realDataMap[normMun];

    let color = '#ccc';
    let fillOpacity = 0.3;
    let weight = 0.5;
    let borderColor = 'white';

    if (data && data.count > 0) {
      if (mapMode === 'densidade') {
        // base azul, intensidade pelo count
        const intensity = Math.min(100, 40 + (data.count * 10));
        color = `hsl(217, 90%, ${100 - (intensity * 0.6)}%)`; 
        fillOpacity = 0.8;
      } else {
        // modo calor
        const intensity = data.maxEngajamento === 3 ? 90 : data.maxEngajamento === 2 ? 70 : 50;
        color = `hsl(0, 90%, ${100 - (intensity * 0.5)}%)`;
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
    const name = feature.properties.name || feature.properties.nome || `Município ${feature.properties.codarea}`;
    const normMun = normalizeString(name);
    const data = realDataMap[normMun];
    
    if (data && data.count > 0) {
      const agendasHtml = data.agendas.length > 0 
        ? `<div style="margin-top:4px; font-size:0.75em; color:var(--color-primary); text-align:left; background:rgba(255,255,255,0.8); padding:4px; border-radius:4px;">
            <strong>Agendas:</strong><br/>
            ${data.agendas.map(a => {
              try {
                const dataObj = new Date(a.agenda);
                const dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                return `- ${a.apoiador}: ${dataFormatada}`;
              } catch (e) {
                return `- ${a.apoiador}: ${a.agenda}`;
              }
            }).join('<br/>')}
           </div>`
        : '';
        
      layer.bindTooltip(`
        <div style="text-align: center;">
          <strong>${name}</strong><br/>
          <span style="font-size: 0.85em; opacity: 0.8;">${data.count} Apoiador(es)</span>
          ${agendasHtml}
        </div>
      `, {
        permanent: true,
        direction: 'center',
        className: 'map-tooltip',
        opacity: 0.9
      });
    } else {
      layer.bindTooltip(`
        <div style="text-align: center;">
          <strong>${name}</strong><br/>
          <span style="font-size: 0.85em; opacity: 0.8;">Sem dados</span>
        </div>
      `, {
        permanent: false,
        direction: 'center',
        className: 'map-tooltip'
      });
    }
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
                key={mapMode + Object.keys(realDataMap).length}
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
