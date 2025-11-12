// src/components/Simetria.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Point {
  x: number;
  y: number;
}

type FigureType = 'butterfly' | 'star' | 'heart' | 'leaf';

interface Figure {
  id: FigureType;
  name: string;
  emoji: string;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  emoji: string;
}

const figures: Figure[] = [
  { id: 'butterfly', name: 'Mariposa', emoji: '🦋', color: '#FFB6D9' },
  { id: 'star', name: 'Estrella', emoji: '⭐', color: '#FFF5BA' },
  { id: 'heart', name: 'Corazón', emoji: '❤️', color: '#C7CEEA' },
  { id: 'leaf', name: 'Hoja', emoji: '🍃', color: '#26DE81' }
];

export default function Simetria() {
  const navigate = useNavigate();
  const [selectedFigure, setSelectedFigure] = useState<FigureType>('butterfly');
  const [leftPoints, setLeftPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const centerX = 300;

  const encouragements = [
    '¡Increíble! 🌟',
    '¡Eres un artista! 🎨',
    '¡Maravilloso! ✨',
    '¡Fantástico! 🎉',
    '¡Sigue así! 💫',
    '¡Qué talento! 🌈',
    '¡Perfecto! 🎊',
    '¡Brillante! ⭐'
  ];

  // Dibujar automáticamente cuando cambia la figura
  useEffect(() => {
    if (showExample) {
      drawExampleFigure(selectedFigure);
    } else {
      drawSymmetry();
    }
  }, [leftPoints, selectedFigure, showExample]);

  // Animación de partículas
  useEffect(() => {
    if (particles.length === 0) return;

    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animationFrame = requestAnimationFrame(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles(prevParticles => {
        return prevParticles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5,
            life: p.life - 1
          }))
          .filter(p => p.life > 0);
      });

      particles.forEach(p => {
        ctx.font = '24px serif';
        ctx.fillText(p.emoji, p.x, p.y);
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  // Celebración cuando alcanza ciertos puntos
  useEffect(() => {
    if (leftPoints.length > 0 && leftPoints.length % 15 === 0 && !showExample) {
      triggerCelebration();
      setScore(prev => prev + 10);
    }
  }, [leftPoints.length, showExample]);

  const triggerCelebration = () => {
    const newParticles: Particle[] = [];
    const emojis = ['⭐', '✨', '🌟', '💫', '🎉', '🎊', '🌈', '💖'];
    
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        x: Math.random() * 600,
        y: 200,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        life: 60,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    setShowCelebration(true);
    setEncouragementMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
    
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const drawExampleFigure = (figureType: FigureType) => {
    let examplePoints: Point[] = [];

    if (figureType === 'butterfly') {
      examplePoints = [
        { x: 150, y: 200 },
        { x: 120, y: 150 },
        { x: 100, y: 120 },
        { x: 90, y: 100 },
        { x: 100, y: 80 },
        { x: 130, y: 100 },
        { x: 150, y: 140 },
        { x: 150, y: 200 },
        { x: 130, y: 250 },
        { x: 100, y: 280 },
        { x: 90, y: 300 },
        { x: 100, y: 320 },
        { x: 120, y: 290 },
        { x: 150, y: 250 },
        { x: 150, y: 200 }
      ];
    } else if (figureType === 'star') {
      examplePoints = [
        { x: 150, y: 100 },
        { x: 170, y: 160 },
        { x: 230, y: 170 },
        { x: 185, y: 210 },
        { x: 200, y: 270 },
        { x: 150, y: 235 },
        { x: 100, y: 270 },
        { x: 115, y: 210 },
        { x: 70, y: 170 },
        { x: 130, y: 160 },
        { x: 150, y: 100 }
      ];
    } else if (figureType === 'heart') {
      examplePoints = [
        { x: 150, y: 120 },
        { x: 120, y: 100 },
        { x: 90, y: 110 },
        { x: 80, y: 140 },
        { x: 90, y: 170 },
        { x: 120, y: 200 },
        { x: 150, y: 250 },
        { x: 150, y: 300 },
        { x: 150, y: 250 },
        { x: 180, y: 200 },
        { x: 210, y: 170 },
        { x: 220, y: 140 },
        { x: 210, y: 110 },
        { x: 180, y: 100 },
        { x: 150, y: 120 }
      ];
    } else if (figureType === 'leaf') {
      examplePoints = [
        { x: 150, y: 80 },
        { x: 180, y: 120 },
        { x: 190, y: 160 },
        { x: 185, y: 200 },
        { x: 170, y: 240 },
        { x: 150, y: 280 },
        { x: 130, y: 240 },
        { x: 115, y: 200 },
        { x: 110, y: 160 },
        { x: 120, y: 120 },
        { x: 150, y: 80 }
      ];
    }

    setLeftPoints(examplePoints);
  };

  const drawSymmetry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Línea de simetría con efecto brillante
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 8]);
    ctx.shadowColor = '#6366F1';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    const currentFigure = figures.find(f => f.id === selectedFigure);
    if (!currentFigure) return;

    ctx.fillStyle = currentFigure.color;
    ctx.strokeStyle = currentFigure.color;
    ctx.lineWidth = 5;
    ctx.shadowColor = currentFigure.color;
    ctx.shadowBlur = 15;

    if (leftPoints.length > 0) {
      // Dibujar lado izquierdo
      ctx.beginPath();
      ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
      for (let i = 1; i < leftPoints.length; i++) {
        ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
      }
      ctx.stroke();

      // Dibujar lado derecho (reflejado)
      ctx.beginPath();
      const mirroredStartX = centerX + (centerX - leftPoints[0].x);
      ctx.moveTo(mirroredStartX, leftPoints[0].y);
      for (let i = 1; i < leftPoints.length; i++) {
        const mirrorX = centerX + (centerX - leftPoints[i].x);
        ctx.lineTo(mirrorX, leftPoints[i].y);
      }
      ctx.stroke();

      // Dibujar puntos brillantes
      leftPoints.forEach(point => {
        // Punto izquierdo
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Punto derecho (reflejado)
        const mirrorX = centerX + (centerX - point.x);
        ctx.beginPath();
        ctx.arc(mirrorX, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.shadowBlur = 0;
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (showExample) {
      setShowExample(false);
      setLeftPoints([]);
      setScore(0);
    }

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    const { x, y } = coords;

    if (x < centerX) {
      setIsDrawing(true);
      setLeftPoints([{ x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    const { x, y } = coords;

    if (x < centerX) {
      setLeftPoints(prev => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleReset = () => {
    setLeftPoints([]);
    setIsDrawing(false);
    setShowExample(false);
    setScore(0);
    setParticles([]);
  };

  const handleChangeFigure = (figureId: FigureType) => {
    setSelectedFigure(figureId);
    setShowExample(true);
    setIsDrawing(false);
    setScore(0);
    setParticles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 p-4 md:p-8 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>

      {/* Estrellas de fondo animadas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Canvas de partículas celebratorias */}
      <canvas
        ref={particleCanvasRef}
        width={600}
        height={400}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
        style={{ maxWidth: '90vw' }}
      />

      {/* Mensaje de celebración flotante */}
      {showCelebration && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-300 to-orange-400 text-white text-3xl md:text-5xl font-bold px-8 py-4 rounded-full shadow-2xl border-4 border-white">
            {encouragementMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-gray-900 font-bold py-2 md:py-3 px-4 md:px-6 rounded-full shadow-lg border-2 border-yellow-200 hover:from-yellow-400 hover:to-yellow-600 hover:scale-110 transition-all duration-300"
        >
          <span className="text-xl">←</span>
          <span>Volver al Inicio</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-2xl mb-2">
            🎨 ¡Descubre la Simetría! 🪞
          </h1>
          <p className="text-base md:text-lg text-white font-semibold drop-shadow-lg">
            ✨ Dibuja en un lado y mira la magia del espejo ✨
          </p>
        </div>

        {/* Puntuación */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-xl border-4 border-white">
          <div className="text-center">
            <div className="text-sm">Puntos</div>
            <div className="text-3xl" data-testid="score">{score} ⭐</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Selector de figuras mejorado */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 border-4 border-white">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-3xl">🎯</span>
                Elige tu figura
              </h3>
              <div className="space-y-3">
                {figures.map(figure => (
                  <button
                    key={figure.id}
                    data-testid={`figure-${figure.id}`}
                    onClick={() => handleChangeFigure(figure.id)}
                    className={`w-full py-5 px-4 rounded-2xl font-bold text-gray-800 transition-all shadow-lg hover:scale-110 transform ${
                      selectedFigure === figure.id
                        ? 'ring-4 ring-purple-500 scale-110 shadow-2xl'
                        : 'hover:shadow-xl'
                    }`}
                    style={{ backgroundColor: figure.color }}
                  >
                    <span className="text-4xl mr-2">{figure.emoji}</span>
                    <span className="text-xl">{figure.name}</span>
                  </button>
                ))}
              </div>

              <button
                data-testid="reset-button"
                onClick={handleReset}
                className="w-full mt-6 bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold py-4 px-4 rounded-2xl hover:scale-105 transition-all shadow-xl text-lg border-2 border-white"
              >
                🔄 Limpiar y empezar
              </button>

              {/* Información educativa mejorada */}
              <div className="mt-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-5 border-4 border-yellow-300 shadow-lg">
                <p className="text-sm font-bold text-gray-800 mb-2 text-center text-lg">
                  💡 ¿Qué es simetría?
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  ¡Es como un espejo mágico! 🪞 Todo lo que dibujes en un lado aparece igual en el otro lado.
                </p>
              </div>

              {/* Contador de puntos motivacional */}
              {!showExample && leftPoints.length > 0 && (
                <div className="mt-4 bg-gradient-to-r from-green-300 to-blue-300 rounded-2xl p-4 border-4 border-green-400 shadow-lg animate-pulse">
                  <p className="text-center font-bold text-gray-800">
                    🌟 Llevas {leftPoints.length} puntos dibujados
                  </p>
                  <div className="w-full bg-white rounded-full h-4 mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${Math.min((leftPoints.length / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas mejorado */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 border-4 border-white">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {showExample ? '🌟 Ejemplo mágico' : '🎨 ¡Tu obra de arte!'}
                </h3>
                <div className="flex gap-2 flex-wrap justify-center">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg border-2 border-white">
                    ← Dibuja aquí
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-green-500 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg border-2 border-white">
                    Espejo mágico →
                  </div>
                </div>
              </div>

              <div className="flex justify-center relative">
                <canvas
                  ref={canvasRef}
                  data-testid="canvas"
                  width={600}
                  height={400}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="border-4 border-purple-400 rounded-2xl cursor-crosshair bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl hover:shadow-2xl transition-shadow"
                  style={{ 
                    touchAction: 'none',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              </div>

              <div className="mt-4">
                {showExample ? (
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400 rounded-2xl p-5 shadow-lg">
                    <p className="text-gray-800 font-bold text-xl text-center mb-2">
                      📚 Este es un <span className="text-orange-600 text-2xl">EJEMPLO</span>
                    </p>
                    <p className="text-gray-700 text-base text-center font-semibold">
                      👆 Toca el lienzo para crear tu propio dibujo simétrico mágico
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-blue-400 rounded-2xl p-5 shadow-lg">
                    <p className="text-gray-800 font-bold text-xl text-center mb-2">
                      {leftPoints.length === 0
                        ? '👆 Haz clic y arrastra en el lado izquierdo'
                        : `✨ ¡Increíble! Llevas ${leftPoints.length} puntos dibujados`}
                    </p>
                    <p className="text-gray-700 text-base text-center font-semibold">
                      {leftPoints.length > 0 && '¡Mira cómo brilla tu creación simétrica! 🌈✨'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ejemplos de simetría mejorados */}
        <div className="mt-8 bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border-4 border-white">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🌟</span>
            Simetría en la naturaleza
            <span className="text-4xl">🌟</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🦋', label: 'Mariposas', color: 'from-pink-300 to-purple-300' },
              { emoji: '❄️', label: 'Copos de nieve', color: 'from-blue-200 to-cyan-300' },
              { emoji: '🌺', label: 'Flores', color: 'from-red-300 to-pink-300' },
              { emoji: '😊', label: 'Rostros', color: 'from-yellow-200 to-orange-300' }
            ].map((item, i) => (
              <div
                key={i}
                className={`text-center p-6 bg-gradient-to-br ${item.color} rounded-2xl shadow-xl hover:scale-110 transition-transform cursor-pointer border-4 border-white`}
              >
                <div className="text-6xl mb-3 animate-bounce">{item.emoji}</div>
                <p className="text-base font-bold text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}