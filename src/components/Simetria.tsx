// src/components/Simetria.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Definición de figuras con sus puntos de control
const FIGURAS = {
  mariposa: {
    nombre: '🦋 Mariposa',
    color: '#FF6B9D',
    puntosIniciales: [
      { x: 0, y: -60 },
      { x: 40, y: -80 },
      { x: 60, y: -40 },
      { x: 50, y: 0 },
      { x: 60, y: 40 },
      { x: 40, y: 60 },
      { x: 0, y: 50 }
    ]
  },
  corazon: {
    nombre: '❤️ Corazón',
    color: '#FF4757',
    puntosIniciales: [
      { x: 0, y: -30 },
      { x: 30, y: -60 },
      { x: 60, y: -40 },
      { x: 60, y: -10 },
      { x: 40, y: 10 },
      { x: 0, y: 60 }
    ]
  },
  estrella: {
    nombre: '⭐ Estrella',
    color: '#FFA502',
    puntosIniciales: [
      { x: 0, y: -70 },
      { x: 20, y: -20 },
      { x: 70, y: -20 },
      { x: 30, y: 10 },
      { x: 45, y: 60 },
      { x: 0, y: 30 }
    ]
  },
  hoja: {
    nombre: '🍃 Hoja',
    color: '#26DE81',
    puntosIniciales: [
      { x: 0, y: -70 },
      { x: 30, y: -50 },
      { x: 40, y: -20 },
      { x: 35, y: 10 },
      { x: 20, y: 40 },
      { x: 0, y: 60 }
    ]
  }
};

export default function Simetria() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [figuraActual, setFiguraActual] = useState('mariposa');
  const [puntos, setPuntos] = useState([...FIGURAS.mariposa.puntosIniciales]);
  const [puntoArrastrado, setPuntoArrastrado] = useState<number | null>(null);
  const [mostrarCelebracion, setMostrarCelebracion] = useState(false);

  // Dibujar en el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo con gradiente suave
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFF5F7');
    gradient.addColorStop(1, '#E3F2FD');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar línea de simetría
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#9E9E9E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Texto de la línea de simetría
    ctx.fillStyle = '#757575';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Línea de Simetría', centerX - 65, 25);

    const figura = FIGURAS[figuraActual as keyof typeof FIGURAS];
    
    // Dibujar figura lado izquierdo (original)
    ctx.fillStyle = figura.color + '99';
    ctx.strokeStyle = figura.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    puntos.forEach((punto, index) => {
      const x = centerX + punto.x;
      const y = centerY + punto.y;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dibujar figura lado derecho (reflejo)
    ctx.fillStyle = figura.color + 'CC';
    ctx.strokeStyle = figura.color;
    ctx.beginPath();
    puntos.forEach((punto, index) => {
      const x = centerX - punto.x;
      const y = centerY + punto.y;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dibujar puntos de control (solo en el lado izquierdo)
    puntos.forEach((punto) => {
      const x = centerX + punto.x;
      const y = centerY + punto.y;
      
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = figura.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Punto reflejado (solo visual, no interactivo)
      const xReflejo = centerX - punto.x;
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = figura.color;
      ctx.beginPath();
      ctx.arc(xReflejo, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

  }, [puntos, figuraActual]);

  // Manejo del mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Verificar si se hizo clic en algún punto
    puntos.forEach((punto, index) => {
      const x = centerX + punto.x;
      const y = centerY + punto.y;
      const distancia = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      
      if (distancia < 15) {
        setPuntoArrastrado(index);
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (puntoArrastrado === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const nuevosPuntos = [...puntos];
    nuevosPuntos[puntoArrastrado] = {
      x: mouseX - centerX,
      y: mouseY - centerY
    };
    setPuntos(nuevosPuntos);
  };

  const handleMouseUp = () => {
    if (puntoArrastrado !== null) {
      setMostrarCelebracion(true);
      setTimeout(() => setMostrarCelebracion(false), 1000);
    }
    setPuntoArrastrado(null);
  };

  // Manejo táctil para dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const reiniciarFigura = () => {
    setPuntos([...FIGURAS[figuraActual as keyof typeof FIGURAS].puntosIniciales]);
    setMostrarCelebracion(true);
    setTimeout(() => setMostrarCelebracion(false), 800);
  };

  const cambiarFigura = (nombreFigura: string) => {
    setFiguraActual(nombreFigura);
    setPuntos([...FIGURAS[nombreFigura as keyof typeof FIGURAS].puntosIniciales]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all transform hover:scale-105"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Volver</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-2 justify-center">
              <Sparkles className="text-yellow-500" />
              Simetría Mágica
              <Sparkles className="text-yellow-500" />
            </h1>
            <p className="text-gray-600 text-sm mt-1">¡Arrastra los puntos y observa el reflejo!</p>
          </div>

          <button
            onClick={reiniciarFigura}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all transform hover:scale-105"
          >
            <RotateCcw size={20} />
            <span className="font-semibold">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Selector de figuras */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-xl font-bold text-center text-purple-600 mb-4">Elige una figura</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(FIGURAS).map(([key, figura]) => (
              <button
                key={key}
                onClick={() => cambiarFigura(key)}
                className={`p-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 ${
                  figuraActual === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {figura.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden">
          {mostrarCelebracion && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
              <div className="text-6xl animate-bounce">✨</div>
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-auto border-4 border-purple-200 rounded-xl cursor-move shadow-inner"
            style={{ touchAction: 'none' }}
          />
          
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <p className="text-center text-gray-700 font-medium">
              💡 <strong>Tip:</strong> Arrastra los puntos blancos del lado izquierdo y observa cómo se refleja en el lado derecho
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}