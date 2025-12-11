import React, { useState, useEffect } from 'react';
import { 
  Wind, Activity, BookOpen, 
  MessageCircle, Sparkles, X, Send, Leaf, 
  PlayCircle, PauseCircle
} from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/*** AIRMIND APP - AUTONOMOUS EDITION (TypeScript Enforced) */

// --- 0. TIPOS BASE (INTERFACES) ---

// Tipo necesario para la función cn (combina clases de Tailwind)
type ClassValue = string | number | boolean | ClassValue[] | { [key: string]: any } | null | undefined;

interface Crop {
  id: string;
  name: string;
  type: string;
  days: number;
  ph: number;
  ec: number;
  icon: string;
  desc: string;
}

interface SensorData {
  ph: number;
  ec: number;
  temp: number;
}

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ESTILOS CSS INYECTADOS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@400;500;700&display=swap');
  
  body { 
    background-color: #0B1021; 
    font-family: 'Quicksand', sans-serif;
    color: white;
    overflow-x: hidden;
  }

  .font-heading { font-family: 'Nunito', sans-serif; }
  
  /* Glassmorphism Classes */
  .glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }

  /* Animaciones */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 10px rgba(74, 222, 128, 0.2); }
    50% { box-shadow: 0 0 25px rgba(74, 222, 128, 0.6); }
  }
  .animate-pulse-glow { animation: pulse-glow 3s infinite; }
`;

// --- BASES DE DATOS SIMULADAS ---

const CROP_LIBRARY: Crop[] = [
  { id: 'lettuce', name: 'Lechuga', type: 'Hoja', days: 45, ph: 5.8, ec: 1.2, icon: '🥬', desc: 'Rica en agua y fibra. Crecimiento rápido.' },
  { id: 'basil', name: 'Albahaca', type: 'Aroma', days: 60, ph: 6.0, ec: 1.6, icon: '🌿', desc: 'Aromática esencial. Requiere mucha luz.' },
  { id: 'petunia', name: 'Petunia', type: 'Flor', days: 70, ph: 5.5, ec: 1.8, icon: '🌸', desc: 'Ornamental cascada. Colores vibrantes.' },
  { id: 'nasturtium', name: 'Capuchina', type: 'Flor', days: 50, ph: 6.0, ec: 1.4, icon: '🌺', desc: 'Flor comestible picante. Repele plagas.' },
  { id: 'strawberry', name: 'Fresas', type: 'Fruto', days: 90, ph: 5.8, ec: 2.0, icon: '🍓', desc: 'Dulces y ricas en Vitamina C.' },
];

const AI_RESPONSES: string[] = [
  "¡Todo se ve genial! 🌟 El sistema autónomo mantiene el pH estable.",
  "He notado que hace calor. No te preocupes, aumenté el riego automáticamente. 💧",
  "¿Sabías que tus Capuchinas son comestibles? ¡Pruébalas en ensalada! 🥗",
  "Modo Silencio activado para la noche. Shhh... las plantas duermen. 😴",
  "Tus raíces están blanquitas y sanas, eso significa que hay mucho oxígeno."
];

// --- 1. COMPONENTES UI (Tipados) ---

interface TabButtonProps { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; }
const TabButton: React.FC<TabButtonProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 p-2 flex-1 transition-all duration-300",
      active ? "text-[#4ADE80] scale-110" : "text-gray-400 hover:text-white"
    )}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    {active && <div className="w-1 h-1 rounded-full bg-[#4ADE80] mt-1 shadow-[0_0_8px_#4ADE80]" />}
  </button>
);

interface MetricCardProps { label: string; value: number | string; unit: string; status: 'ok' | 'warn'; color: string; }
const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status, color }) => (
  <div className={`glass-panel rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] relative overflow-hidden group`}>
    <div className={`absolute top-0 right-0 w-12 h-12 bg-${color}-500 opacity-10 rounded-full blur-xl group-hover:opacity-20 transition`}></div>
    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-heading font-black text-white">{value}</span>
      <span className="text-xs text-gray-500 font-bold">{unit}</span>
    </div>
    <div className={cn(
      "mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
      status === 'ok' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
    )}>
      {status === 'ok' ? 'Óptimo' : 'Atención'}
    </div>
  </div>
);

// --- 2. PANTALLAS ---

interface DashboardProps { 
  currentCrop: Crop; 
  cropDay: number; 
  sensorData: SensorData; 
  isPaused: boolean; 
  togglePause: () => void; 
}
const DashboardScreen: React.FC<DashboardProps> = ({ currentCrop, cropDay, sensorData, isPaused, togglePause }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    
    {/* 1. VISUALIZACIÓN CENTRAL 3D (GEMELO DIGITAL) */}
    <section className="relative h-80 w-full glass-panel rounded-[3rem] flex flex-col items-center justify-center border-2 border-white/10 overflow-hidden">
      
      {/* Indicador de Autonomía */}
      <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
           <div className={cn("w-2 h-2 rounded-full", isPaused ? "bg-yellow-500" : "bg-[#4ADE80] animate-pulse-glow")}></div>
           <span className="text-[10px] font-bold tracking-wide text-white">
             {isPaused ? "SISTEMA PAUSADO" : "PILOTO AUTOMÁTICO"}
           </span>
        </div>
        <div className="text-xs font-bold text-[#E0B0FF] flex items-center gap-1">
          <Sparkles size={12} /> {currentCrop.name}
        </div>
      </div>

      {/* RENDER CSS DE LA TORRE (Visual) */}
      <div className={cn("relative z-10 transition-all duration-1000", isPaused ? "grayscale opacity-50" : "animate-float")}>
         {/* Torre Base */}
         <div className="w-24 h-48 bg-gradient-to-b from-[#1B263B] to-[#0B1021] rounded-2xl border border-white/20 relative flex flex-col items-center shadow-2xl">
            {/* Luces de Crecimiento */}
            <div className="absolute inset-0 bg-[#E0B0FF] opacity-10 blur-xl animate-pulse"></div>
            
            {/* Plantas (Iconos según fase) */}
            <div className="absolute top-4 -left-6 text-4xl drop-shadow-lg transform -rotate-12">{cropDay > 5 ? currentCrop.icon : '🌱'}</div>
            <div className="absolute top-16 -right-6 text-4xl drop-shadow-lg transform rotate-12 delay-100">{cropDay > 10 ? currentCrop.icon : '🌱'}</div>
            <div className="absolute bottom-10 -left-6 text-4xl drop-shadow-lg transform -rotate-6 delay-200">{cropDay > 15 ? currentCrop.icon : '🌱'}</div>
         </div>
         {/* Base */}
         <div className="w-32 h-8 bg-[#1B263B] rounded-[50%] mt-[-10px] border border-white/10 shadow-xl z-20 relative"></div>
      </div>

      {/* Línea de Tiempo Circular */}
      <div className="absolute bottom-8 w-full px-12 z-20">
         <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase">
            <span>Día {cropDay}</span>
            <span className="text-[#4ADE80]">Cosecha (Día {currentCrop.days})</span>
         </div>
         <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0E7490] to-[#4ADE80] rounded-full relative transition-all duration-1000"
              style={{ width: `${(cropDay / currentCrop.days) * 100}%` }}
            >
               <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_infinite]"></div>
            </div>
         </div>
      </div>
    </section>

    {/* 2. SEMÁFORO DE VARIABLES (Simplificado) */}
    <section>
      <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2 px-2">
        <Activity size={18} className="text-[#E0B0FF]" /> Signos Vitales
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        <MetricCard label="Nutrientes" value={sensorData.ec} unit="mS" status="ok" color="purple" />
        <MetricCard label="pH Agua" value={sensorData.ph} unit="pH" status={sensorData.ph > currentCrop.ph + 0.2 || sensorData.ph < currentCrop.ph - 0.2 ? 'warn' : 'ok'} color="green" />
        <MetricCard label="Temp" value={sensorData.temp} unit="°C" status="ok" color="blue" />
        <MetricCard label="Agua" value={85} unit="%" status="ok" color="cyan" />
      </div>
    </section>

    {/* 3. ACCIONES RÁPIDAS (Gestión) */}
    <section className="grid grid-cols-2 gap-4">
      <button 
        onClick={togglePause}
        className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition active:scale-95"
      >
        <div className={cn("p-2 rounded-full", isPaused ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400")}>
          {isPaused ? <PlayCircle size={24} /> : <PauseCircle size={24} />}
        </div>
        <div className="text-left">
          <span className="block text-sm font-bold">{isPaused ? "Reanudar" : "Pausar"}</span>
          <span className="text-[10px] text-gray-400">Para limpieza</span>
        </div>
      </button>

      <button className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition active:scale-95">
        <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
          <Wind size={24} />
        </div>
        <div className="text-left">
          <span className="block text-sm font-bold">Purga</span>
          <span className="text-[10px] text-gray-400">Renovar agua</span>
        </div>
      </button>
    </section>
  </div>
);

interface LibraryProps { onSelectCrop: (crop: Crop) => void; }
const LibraryScreen: React.FC<LibraryProps> = ({ onSelectCrop }) => (
  <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
    <div className="px-2">
      <h2 className="text-2xl font-heading font-bold mb-2">Bio-Biblioteca <span className="text-[#4ADE80]">.</span></h2>
      <p className="text-sm text-gray-400">Selecciona qué vas a cultivar. AirMind configurará la química automáticamente.</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {CROP_LIBRARY.map((crop: Crop) => (
        <button 
          key={crop.id}
          onClick={() => onSelectCrop(crop)}
          className="glass-panel p-0 rounded-2xl flex items-stretch text-left hover:border-[#4ADE80]/50 transition-all group relative overflow-hidden"
        >
          {/* Fondo gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4ADE80]/0 to-[#4ADE80]/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
          
          <div className="w-24 bg-white/5 flex items-center justify-center text-4xl border-r border-white/5">
            {crop.icon}
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg text-white group-hover:text-[#4ADE80] transition">{crop.name}</h3>
              <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full text-[#E0B0FF] uppercase">{crop.type}</span>
            </div>
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{crop.desc}</p>
            
            <div className="flex gap-4 border-t border-white/5 pt-2">
              <div className="flex flex-col">
                 <span className="text-[9px] text-gray-500 uppercase font-bold">Ciclo</span>
                 <span className="text-xs font-mono text-gray-300">{crop.days} días</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] text-gray-500 uppercase font-bold">pH Auto</span>
                 <span className="text-xs font-mono text-[#4ADE80]">{crop.ph}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

interface ChatProps { isOpen: boolean; onClose: () => void; }
const BrotesChat: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  const [msgs, setMsgs] = useState<{ from: 'ai' | 'user'; text: string }[]>([{ from: 'ai', text: '¡Hola! Soy Brotes 🌱. ¿En qué te ayudo?' }]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input) return;
    setMsgs(prev => [...prev, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { from: 'ai', text: AI_RESPONSES[Math.floor(Math.random()*AI_RESPONSES.length)] }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B1021] border border-white/20 rounded-[2rem] h-[80vh] flex flex-col shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Chat */}
        <div className="bg-[#1B263B] p-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#E0B0FF] rounded-full flex items-center justify-center text-xl shadow-[0_0_15px_#E0B0FF]">🌱</div>
             <div>
               <h3 className="font-bold text-white">Brotes AI</h3>
               <p className="text-[10px] text-[#4ADE80] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse"></span> Online</p>
             </div>
          </div>
          <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex", m.from === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-3 rounded-2xl text-sm",
                m.from === 'user' ? "bg-[#0E7490] text-white rounded-tr-sm" : "bg-[#1B263B] text-gray-200 border border-white/10 rounded-tl-sm"
              )}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-[#1B263B] border-t border-white/10 flex gap-2">
           <input 
             className="flex-1 bg-[#0B1021] border border-white/10 rounded-full px-4 text-sm text-white focus:outline-none focus:border-[#E0B0FF]"
             placeholder="Escribe algo..."
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyPress={e => e.key === 'Enter' && send()}
           />
           <button onClick={send} className="p-2 bg-[#E0B0FF] rounded-full text-[#0B1021] hover:scale-110 transition"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

const AirMindApp: React.FC = () => {
  const [tab, setTab] = useState<'monitor' | 'library' | 'settings'>('monitor');
  const [currentCrop, setCurrentCrop] = useState<Crop>(CROP_LIBRARY[0]);
  const [cropDay, setCropDay] = useState(12);
  const [isPaused, setIsPaused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showScience, setShowScience] = useState(false); // Modo Científico Oculto

  // Simulación de Sensores
  const [sensorData, setSensorData] = useState<SensorData>({ ph: 5.8, ec: 1.2, temp: 24 });
  
  useEffect(() => {
    const i = setInterval(() => {
      setSensorData(prev => ({
        ph: +(prev.ph + (Math.random() * 0.1 - 0.05)).toFixed(1),
        ec: prev.ec,
        temp: +(24 + Math.random()).toFixed(1)
      }));
    }, 2000);
    return () => clearInterval(i);
  }, []);

  const handleSelectCrop = (crop: Crop) => {
    setCurrentCrop(crop);
    setCropDay(1); // Reiniciar ciclo
    setTab('monitor'); // Volver a home
    alert(`Configurando sistema para: ${crop.name}. pH ajustado a ${crop.ph}`);
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-white/5 bg-[#0B1021]">
      <style>{styles}</style>

      {/* HEADER */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-end bg-[#0B1021]/80 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-tight text-white flex items-center gap-2">
            AirMind <span className="text-[10px] bg-[#4ADE80] text-[#0B1021] px-1.5 rounded font-bold uppercase tracking-widest">Auto</span>
          </h1>
          <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">
            {tab === 'monitor' ? 'Centro de Control' : 'Configuración'}
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowScience(!showScience)}
             className={cn("p-2 rounded-full transition", showScience ? "bg-[#4ADE80] text-[#0B1021]" : "bg-white/5 text-gray-400")}
           >
             <BookOpen size={20} />
           </button>
           <div className="w-10 h-10 rounded-full border-2 border-white/20 p-0.5">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" className="rounded-full bg-white/10" />
           </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="px-6 mt-4 mb-20">
        {tab === 'monitor' && (
          <DashboardScreen 
             currentCrop={currentCrop} 
             cropDay={cropDay} 
             sensorData={sensorData} 
             isPaused={isPaused}
             togglePause={() => setIsPaused(!isPaused)}
          />
        )}
        
        {tab === 'library' && (
          <LibraryScreen onSelectCrop={handleSelectCrop} />
        )}

        {/* MÓDULO CIENTÍFICO (Expandible) */}
        {showScience && (
          <section className="mt-8 mb-4 animate-in slide-in-from-bottom duration-500">
            <div className="glass-panel p-4 rounded-2xl border-l-4 border-[#0E7490]">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-[#0E7490] uppercase text-xs tracking-widest">Data Logger</h3>
                 <button className="text-[10px] bg-[#0E7490] px-2 py-1 rounded text-white">Exportar CSV</button>
              </div>
              <div className="h-32 w-full bg-black/20 rounded-lg flex items-center justify-center text-xs text-gray-500">
                 [Gráfica Histórica de pH 24h]
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FAB (Floating Action Button) - CHAT */}
      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => setShowChat(true)}
          className="w-14 h-14 bg-[#E0B0FF] rounded-full flex items-center justify-center text-[#0B1021] shadow-[0_0_20px_rgba(224,176,255,0.4)] hover:scale-110 transition border-4 border-[#0B1021]"
        >
          <MessageCircle size={28} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>

      {/* NAVBAR */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 glass-panel rounded-full flex items-center justify-around px-2 z-50 shadow-2xl">
        <TabButton 
          active={tab === 'monitor'} 
          onClick={() => setTab('monitor')} 
          icon={<Activity size={24}/>} 
          label="Monitor" 
        />
        
        {/* Espacio Central */}
        <div className="w-8"></div> 

        <TabButton 
          active={tab === 'library'} 
          onClick={() => setTab('library')} 
          icon={<Leaf size={24}/>} 
          label="Cultivos" 
        />
        
        {/* Decoración Central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-white/5 rounded-full pointer-events-none"></div>
      </nav>

      <BrotesChat isOpen={showChat} onClose={() => setShowChat(false)} />

    </div>
  );
};

export default AirMindApp;