import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  User, 
  List, 
  Siren,
  Upload,
  X,
  ChevronRight,
  ShieldAlert,
  Trophy,
  Moon,
  Sun,
  Award,
  Crosshair, // Importado para o botão de GPS
  Navigation as NavigationIcon // Ícone de navegação
} from 'lucide-react';

// Tipos de infrações e seus valores
const INFRACOES = [
  { id: 1, nome: 'Estacionamento Proibido', pontos: 4, bonus: 15.00, gravidade: 'Média' },
  { id: 2, nome: 'Avançar Sinal Vermelho', pontos: 7, bonus: 30.00, gravidade: 'Gravíssima' },
  { id: 3, nome: 'Uso de Celular', pontos: 7, bonus: 25.00, gravidade: 'Gravíssima' },
  { id: 4, nome: 'Sem Cinto de Segurança', pontos: 5, bonus: 20.00, gravidade: 'Grave' },
  { id: 5, nome: 'Excesso de Velocidade', pontos: 4, bonus: 35.00, gravidade: 'Média' },
  { id: 6, nome: 'Dirigir na Contramão', pontos: 7, bonus: 40.00, gravidade: 'Gravíssima' },
];

// Níveis de patente
const PATENTES = [
  { nome: 'Agente Jr.', minXp: 0, cor: 'text-gray-500', bg: 'bg-gray-100' },
  { nome: 'Agente Pleno', minXp: 100, cor: 'text-blue-500', bg: 'bg-blue-100' },
  { nome: 'Agente Sênior', minXp: 300, cor: 'text-purple-500', bg: 'bg-purple-100' },
  { nome: 'Comandante', minXp: 600, cor: 'text-yellow-500', bg: 'bg-yellow-100' }
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado Global
  const [reports, setReports] = useState([
    { id: 101, placa: 'ABC-1234', infracao: 'Avançar Sinal Vermelho', data: '18/01/2026', local: 'Av. Paulista, 1000', status: 'Aprovado', pontos: 7, valor: 30.00, xp: 20 },
    { id: 102, placa: 'XYZ-9876', infracao: 'Estacionamento Proibido', data: '19/01/2026', local: 'Rua Augusta, 500', status: 'Em Análise', pontos: 0, valor: 0.00, xp: 0 },
  ]);
  
  const [saldo, setSaldo] = useState(145.50);
  const [xp, setXp] = useState(85); // Experiência do usuário para gamificação
  const [notificacao, setNotificacao] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // Para modal de detalhes

  // Form State
  const [placa, setPlaca] = useState('');
  const [tipoInfracao, setTipoInfracao] = useState('');
  const [evidencias, setEvidencias] = useState([]);
  const [localizacao, setLocalizacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [buscandoGps, setBuscandoGps] = useState(false); // Estado para animação do botão GPS

  // Patente atual
  const patenteAtual = PATENTES.slice().reverse().find(p => xp >= p.minXp) || PATENTES[0];
  const proximaPatente = PATENTES.find(p => p.minXp > xp);

  // Efeito para simular pegar localização ao abrir "Nova Multa"
  useEffect(() => {
    if (view === 'nova-multa' && !localizacao) {
      atualizarGps();
    }
  }, [view]);

  const atualizarGps = () => {
    setBuscandoGps(true);
    setLocalizacao('Identificando local...');
    setTimeout(() => {
      setLocalizacao('Av. Brigadeiro Faria Lima, 3450 - SP');
      setBuscandoGps(false);
    }, 2000);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newEvidencias = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
        name: file.name
      }));
      setEvidencias([...evidencias, ...newEvidencias]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!placa || !tipoInfracao || evidencias.length === 0) {
      mostrarNotificacao('Preencha todos os campos e anexe provas!', 'erro');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const infracaoDados = INFRACOES.find(i => i.id === parseInt(tipoInfracao));
      const xpGanho = 15; // XP fixo por multa para demo
      
      const novoRelatorio = {
        id: Math.floor(Math.random() * 10000),
        placa: placa.toUpperCase(),
        infracao: infracaoDados.nome,
        data: new Date().toLocaleDateString('pt-BR'),
        local: localizacao,
        status: 'Aprovado',
        pontos: infracaoDados.pontos,
        valor: infracaoDados.bonus,
        xp: xpGanho,
        evidencias: evidencias // Guardar evidências
      };

      setReports([novoRelatorio, ...reports]);
      setSaldo(saldo + infracaoDados.bonus);
      setXp(xp + xpGanho);
      
      setPlaca('');
      setTipoInfracao('');
      setEvidencias([]);
      setLocalizacao('');
      setLoading(false);
      setView('dashboard');
      mostrarNotificacao(`Sucesso! +R$ ${infracaoDados.bonus.toFixed(2)} | +${xpGanho} XP`, 'sucesso');
    }, 1500);
  };

  const mostrarNotificacao = (msg, tipo) => {
    setNotificacao({ msg, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  // --- COMPONENTES DA UI ---

  const Navigation = () => (
    <div className={`fixed bottom-0 left-0 right-0 border-t py-2 px-4 flex justify-between items-center z-40 safe-area-bottom transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
      <NavBtn icon={<Siren size={24} />} label="Início" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
      <NavBtn icon={<Trophy size={24} />} label="Ranking" active={view === 'ranking'} onClick={() => setView('ranking')} />
      <div className="relative -top-6">
        <button 
          onClick={() => setView('nova-multa')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition-all transform hover:scale-105 border-4 border-transparent ring-4 ring-opacity-20 ring-blue-400"
        >
          <Camera size={28} />
        </button>
      </div>
      <NavBtn icon={<List size={24} />} label="Histórico" active={view === 'historico'} onClick={() => setView('historico')} />
      <NavBtn icon={<User size={24} />} label="Perfil" active={view === 'perfil'} onClick={() => setView('perfil')} />
    </div>
  );

  const NavBtn = ({ icon, label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-14 ${active ? 'text-blue-500' : (darkMode ? 'text-slate-500' : 'text-gray-400')}`}
    >
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  const TopBar = () => (
    <div className={`pt-10 pb-4 px-4 shadow-sm sticky top-0 z-30 transition-colors ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-1.5 rounded-lg text-white shadow-sm">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Fiscal Cidadão</h1>
            <div className="flex items-center gap-1">
               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${patenteAtual.bg} ${patenteAtual.cor} bg-opacity-20`}>{patenteAtual.nome}</span>
            </div>
          </div>
        </div>
        <div 
          onClick={() => setView('carteira')}
          className={`px-3 py-1.5 rounded-full flex items-center gap-2 border cursor-pointer transition-all active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
        >
          <DollarSign size={16} className="text-green-500" />
          <span className="font-bold text-green-500 text-sm">R$ {saldo.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  // --- VIEWS ---

  const Dashboard = () => (
    <div className="p-4 space-y-6 pb-28 animate-fade-in">
      {/* Progresso de Nível */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4 shadow-sm border ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>XP Atual</p>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{xp} <span className="text-sm font-normal text-slate-400">/ {proximaPatente ? proximaPatente.minXp : 'Max'}</span></h3>
          </div>
          <Award className="text-yellow-500 mb-1" size={32} />
        </div>
        {proximaPatente && (
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (xp / proximaPatente.minXp) * 100)}%` }}
            ></div>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2 text-right">
          {proximaPatente ? `Faltam ${proximaPatente.minXp - xp} XP para ${proximaPatente.nome}` : 'Nível Máximo Alcançado!'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 text-white shadow-lg shadow-blue-200/50">
          <p className="text-blue-100 text-xs mb-1 font-medium uppercase tracking-wide">Infrações</p>
          <h2 className="text-3xl font-bold">14</h2>
          <p className="text-[10px] text-blue-200 mt-2 flex items-center gap-1 bg-blue-900/30 w-fit px-2 py-0.5 rounded">
            <CheckCircle size={10} /> Esta semana
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 text-white shadow-lg shadow-orange-200/50">
          <p className="text-orange-100 text-xs mb-1 font-medium uppercase tracking-wide">Impacto</p>
          <h2 className="text-3xl font-bold">58</h2>
          <p className="text-[10px] text-orange-200 mt-2 bg-red-900/30 w-fit px-2 py-0.5 rounded">Pontos gerados</p>
        </div>
      </div>

      <div>
        <h3 className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Atividade Recente
          <button onClick={() => setView('historico')} className="text-blue-500 text-sm font-medium">Ver tudo</button>
        </h3>
        <div className="space-y-3">
          {reports.slice(0, 3).map((report) => (
            <div 
              key={report.id} 
              onClick={() => setSelectedReport(report)}
              className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} p-3 rounded-xl shadow-sm border flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${report.status === 'Aprovado' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {report.status === 'Aprovado' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{report.placa}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{report.infracao}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-500 text-sm">+R$ {report.valor.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{report.data}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NovaMulta = () => (
    <div className="p-4 pb-28 animate-slide-up">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Registrar Infração</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* MAPA ESTILO GOOGLE MAPS */}
        <div className={`relative w-full h-56 rounded-2xl overflow-hidden border shadow-inner ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          {/* Iframe do OpenStreetMap para simular o mapa real */}
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src={`https://www.openstreetmap.org/export/embed.html?bbox=-46.685,-23.590,-46.680,-23.580&layer=mapnik&marker=-23.585,-46.682`}
            className={`w-full h-full object-cover ${darkMode ? 'opacity-80' : 'opacity-100'}`}
          ></iframe>
          
          {/* Botão de Centralizar GPS */}
          <button 
            type="button"
            onClick={atualizarGps}
            className={`absolute bottom-20 right-4 p-3 rounded-full shadow-lg transition-transform active:scale-90 ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Crosshair size={24} className={buscandoGps ? 'animate-spin' : ''} />
          </button>

          {/* Cartão de Endereço Flutuante */}
          <div className="absolute bottom-4 left-4 right-4">
             <div className={`p-3 rounded-xl shadow-lg flex items-start gap-3 ${darkMode ? 'bg-slate-800/95 text-white backdrop-blur-sm' : 'bg-white/95 text-gray-800 backdrop-blur-sm'}`}>
                <div className="mt-1 text-red-500">
                   <MapPin size={20} fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">Local da Infração</p>
                   <p className="text-sm font-semibold truncate leading-tight">
                     {localizacao || 'Buscando sinal de satélite...'}
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Placa do Veículo</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <div className="bg-blue-700 text-white text-[10px] font-bold px-1 rounded-sm h-4 flex items-center justify-center">BR</div>
            </div>
            <input 
              type="text" 
              placeholder="ABC-1234"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              maxLength={8}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg uppercase shadow-sm transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tipo de Infração</label>
          <div className="grid grid-cols-1 gap-2">
            {INFRACOES.map((inf) => (
              <label 
                key={inf.id} 
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${tipoInfracao == inf.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-500/5' : (darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50')}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${tipoInfracao == inf.id ? 'border-blue-500' : 'border-gray-400'}`}>
                    {tipoInfracao == inf.id && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                  </div>
                  <input 
                    type="radio" 
                    name="infracao" 
                    value={inf.id} 
                    checked={tipoInfracao == inf.id}
                    onChange={(e) => setTipoInfracao(e.target.value)}
                    className="hidden"
                  />
                  <div>
                    <span className={`block font-medium text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{inf.nome}</span>
                    <span className="text-[10px] text-red-500 font-bold">{inf.pontos} Pts • {inf.gravidade}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">+R$ {inf.bonus.toFixed(0)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Provas (Foto/Vídeo)</label>
          <div className="grid grid-cols-3 gap-2">
            {evidencias.map((ev, idx) => (
              <div key={idx} className={`relative aspect-square rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                {ev.type === 'video' ? (
                  <video src={ev.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={ev.url} alt="Prova" className="w-full h-full object-cover" />
                )}
                <button 
                  type="button"
                  onClick={() => setEvidencias(evidencias.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <label className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${darkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
              <Camera size={24} className={darkMode ? 'text-slate-400' : 'text-gray-400'} />
              <span className={`text-[10px] mt-1 font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Adicionar</span>
              <input type="file" accept="image/*,video/*" capture="environment" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all'}`}
        >
          {loading ? 'Processando...' : <><Upload size={20} /> Enviar Denúncia</>}
        </button>
      </form>
    </div>
  );

  const Ranking = () => (
    <div className="p-4 pb-28 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ranking Mensal</h2>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Top agentes da sua região</p>
      </div>

      <div className="space-y-4">
        {/* Top 3 Placeholder Mock */}
        <div className="flex justify-center items-end gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full border-2 border-gray-400 mb-1 relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600">#2</div>
            </div>
            <div className="h-16 w-12 bg-gray-400 rounded-t-lg opacity-50"></div>
          </div>
          <div className="flex flex-col items-center">
            <Trophy className="text-yellow-500 mb-1" size={20} />
            <div className="w-16 h-16 bg-yellow-300 rounded-full border-4 border-yellow-500 mb-1 relative overflow-hidden shadow-lg">
               <div className="absolute inset-0 flex items-center justify-center font-bold text-yellow-800">VOCÊ</div>
            </div>
            <div className="h-24 w-16 bg-yellow-500 rounded-t-lg shadow-lg"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-300 rounded-full border-2 border-orange-400 mb-1 relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-orange-800">#3</div>
            </div>
            <div className="h-12 w-12 bg-orange-400 rounded-t-lg opacity-50"></div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-2xl border overflow-hidden`}>
          {[1, 2, 3, 4, 5].map((pos) => (
            <div key={pos} className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'} last:border-0`}>
              <div className="flex items-center gap-3">
                <span className={`font-bold w-6 text-center ${pos === 1 ? 'text-yellow-500 text-xl' : (darkMode ? 'text-slate-400' : 'text-gray-500')}`}>{pos}º</span>
                <div>
                  <p className={`font-bold ${pos === 1 ? 'text-blue-500' : (darkMode ? 'text-gray-200' : 'text-gray-800')}`}>
                    {pos === 1 ? 'Agente Silva (Você)' : `Agente ${['Souza', 'Santos', 'Oliveira', 'Lima'][pos-2]}`}
                  </p>
                  <p className="text-xs text-gray-400">{1500 - (pos * 120)} XP</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded">R$ {(4500 - (pos * 300)).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Carteira = () => (
    <div className="p-4 pb-28 animate-fade-in">
      <div className={`bg-slate-900 text-white rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
        <p className="text-slate-400 text-sm mb-1">Saldo Disponível</p>
        <h2 className="text-4xl font-bold mb-4">R$ {saldo.toFixed(2)}</h2>
        <div className="flex gap-3">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
            <DollarSign size={16} /> Sacar Pix
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
            Extrato
          </button>
        </div>
      </div>

      <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Extrato Recente</h3>
      <div className="space-y-0">
        {reports.filter(r => r.status === 'Aprovado').map((report) => (
          <div key={report.id} className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                <DollarSign size={16} />
              </div>
              <div>
                <p className={`font-medium text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Bônus - {report.infracao}</p>
                <p className="text-xs text-gray-400">{report.data}</p>
              </div>
            </div>
            <span className="font-bold text-green-500">+R$ {report.valor.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
  
  const Historico = () => (
    <div className="p-4 pb-28 animate-fade-in">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Histórico de Atuações</h2>
      <div className="space-y-3">
        {reports.map((report) => (
          <div 
            key={report.id} 
            onClick={() => setSelectedReport(report)}
            className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-4 shadow-sm relative overflow-hidden cursor-pointer`}
          >
            {report.status === 'Em Análise' && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                EM ANÁLISE
              </div>
            )}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{report.placa}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{report.infracao}</p>
              </div>
              <div className="text-right mt-1">
                <span className="block text-[10px] text-gray-400 uppercase tracking-wide">Pontos</span>
                <span className="font-bold text-red-500 text-lg">{report.pontos} pts</span>
              </div>
            </div>
            <div className={`flex items-center gap-2 pt-2 border-t mt-2 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
               <MapPin size={12} className="text-gray-400" />
               <span className="text-xs text-gray-400 truncate w-48">{report.local || 'Localização não registrada'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Perfil = () => (
    <div className="p-4 pb-28 animate-fade-in">
      <div className="text-center mb-8 mt-4">
        <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-blue-100">
          AS
        </div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Agente Silva</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadastro #4092-BR</p>
        <div className="flex justify-center mt-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${patenteAtual.bg} ${patenteAtual.cor}`}>
            {patenteAtual.nome} • Nível {Math.floor(xp / 50) + 1}
          </span>
        </div>
      </div>

      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-orange-400" />}
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Modo Escuro</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>
        <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
             <User size={20} className="text-blue-500" />
             <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dados Pessoais</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <ShieldAlert size={20} className="text-red-500" />
             <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Termos de Conduta</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button className="text-red-500 font-medium text-sm">Sair da conta</button>
        <p className="text-[10px] text-gray-400 mt-4">Versão 2.1.0 (Beta)</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden border-x transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
      {view !== 'perfil' && <TopBar />}
      
      <main className="min-h-screen">
        {view === 'dashboard' && <Dashboard />}
        {view === 'nova-multa' && <NovaMulta />}
        {view === 'carteira' && <Carteira />}
        {view === 'historico' && <Historico />}
        {view === 'ranking' && <Ranking />}
        {view === 'perfil' && <Perfil />}
      </main>

      <Navigation />

      {/* Modal de Detalhes */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl p-6 relative shadow-2xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`}>
            <button onClick={() => setSelectedReport(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-slate-700 rounded-full">
              <X size={16} />
            </button>
            
            <div className="mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${selectedReport.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {selectedReport.status}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{selectedReport.placa}</h2>
            <p className="text-gray-500 text-sm mb-4">{selectedReport.infracao}</p>
            
            <div className="space-y-4">
              <div className={`p-3 rounded-xl flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <MapPin className="text-blue-500 shrink-0" size={20} />
                <div>
                   <p className="text-xs font-bold uppercase text-gray-400">Local</p>
                   <p className="text-sm font-medium leading-tight">{selectedReport.local || 'Localização não disponível'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                   <p className="text-xs font-bold uppercase text-gray-400">Penalidade</p>
                   <p className="text-lg font-bold text-red-500">{selectedReport.pontos} Pontos</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                   <p className="text-xs font-bold uppercase text-gray-400">Seu Bônus</p>
                   <p className="text-lg font-bold text-green-500">R$ {selectedReport.valor.toFixed(2)}</p>
                </div>
              </div>
              
              {selectedReport.evidencias && selectedReport.evidencias.length > 0 ? (
                 <div className="h-32 bg-black rounded-xl flex items-center justify-center relative overflow-hidden group">
                    <img src={selectedReport.evidencias[0].url} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">Ver Prova ({selectedReport.evidencias.length})</span>
                    </div>
                 </div>
              ) : (
                <div className={`h-20 rounded-xl flex flex-col items-center justify-center border-2 border-dashed ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-gray-200 bg-gray-50'}`}>
                   <p className="text-xs text-gray-400">Nenhuma imagem anexada na visualização rápida</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notificacao && (
        <div className={`fixed top-20 left-4 right-4 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce-in text-white ${notificacao.tipo === 'sucesso' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notificacao.tipo === 'sucesso' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <p className="font-medium text-sm">{notificacao.msg}</p>
        </div>
      )}
    </div>
  );
}
