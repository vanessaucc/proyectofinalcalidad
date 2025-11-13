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
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centerX = 300;

  // Dibujar cuando hay cambios
  useEffect(() => {
    drawCanvas();
  }, [leftPoints, selectedFigure]);

  // Celebración cuando alcanza puntos
  useEffect(() => {
    if (leftPoints.length > 0 && leftPoints.length % 15 === 0) {
      setScore(prev => prev + 10);
    }
  }, [leftPoints.length]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar boceto guía de la figura seleccionada
    if (leftPoints.length === 0) {
      drawFigureGuide(ctx);
    }

    // Línea de simetría
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 8]);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    const currentFigure = figures.find(f => f.id === selectedFigure);
    if (!currentFigure) return;

    ctx.fillStyle = currentFigure.color;
    ctx.strokeStyle = currentFigure.color;
    ctx.lineWidth = 5;

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

      // Dibujar puntos
      leftPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();

        const mirrorX = centerX + (centerX - point.x);
        ctx.beginPath();
        ctx.arc(mirrorX, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  const drawFigureGuide = (ctx: CanvasRenderingContext2D) => {
    const currentFigure = figures.find(f => f.id === selectedFigure);
    if (!currentFigure) return;

    // Estilo para el boceto guía
    ctx.strokeStyle = currentFigure.color;
    ctx.fillStyle = currentFigure.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.3; // Transparente para que sea una guía
    ctx.setLineDash([5, 5]); // Línea punteada

    const offsetX = 150; // Posición del boceto en el lado izquierdo
    const offsetY = 200; // Centro vertical

    switch (selectedFigure) {
      case 'butterfly':
        // Ala superior izquierda de mariposa
        ctx.beginPath();
        ctx.ellipse(offsetX, offsetY - 40, 50, 60, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Ala inferior izquierda
        ctx.beginPath();
        ctx.ellipse(offsetX, offsetY + 40, 40, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Cuerpo (en el centro)
        ctx.beginPath();
        ctx.ellipse(centerX, offsetY, 8, 70, 0, 0, Math.PI * 2);
        ctx.fill();
        // Antenas
        ctx.beginPath();
        ctx.moveTo(centerX, offsetY - 70);
        ctx.lineTo(centerX - 15, offsetY - 90);
        ctx.moveTo(centerX, offsetY - 70);
        ctx.lineTo(centerX + 15, offsetY - 90);
        ctx.stroke();
        break;

      case 'star':
        // Estrella de 5 puntas (mitad izquierda)
        const starPoints = 5;
        const outerRadius = 70;
        const innerRadius = 30;
        ctx.beginPath();
        for (let i = 0; i <= starPoints; i++) {
          const angle = (Math.PI / starPoints) * i - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = centerX + radius * Math.cos(angle);
          const y = offsetY + radius * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        // Completar mitad izquierda
        for (let i = starPoints; i >= 0; i--) {
          const angle = (Math.PI / starPoints) * i - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = centerX - radius * Math.cos(angle);
          const y = offsetY + radius * Math.sin(angle);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        break;

      case 'heart':
        // Corazón (mitad izquierda)
        ctx.beginPath();
        // Lóbulo superior izquierdo
        ctx.arc(offsetX + 20, offsetY - 20, 30, Math.PI, 0, false);
        // Curva hacia abajo
        ctx.lineTo(centerX, offsetY + 60);
        // Línea de simetría
        ctx.lineTo(centerX, offsetY - 50);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'leaf':
        // Hoja (mitad izquierda con vena central)
        ctx.beginPath();
        ctx.moveTo(centerX, offsetY - 80);
        // Curva exterior de la hoja
        ctx.quadraticCurveTo(offsetX - 40, offsetY - 30, offsetX, offsetY);
        ctx.quadraticCurveTo(offsetX - 40, offsetY + 30, centerX, offsetY + 80);
        ctx.stroke();
        
        // Vena central
        ctx.beginPath();
        ctx.moveTo(centerX, offsetY - 80);
        ctx.lineTo(centerX, offsetY + 80);
        ctx.stroke();
        
        // Venas secundarias
        for (let i = -60; i <= 60; i += 30) {
          ctx.beginPath();
          ctx.moveTo(centerX, offsetY + i);
          ctx.lineTo(centerX - 40, offsetY + i - 15);
          ctx.stroke();
        }
        break;
    }

    ctx.globalAlpha = 1.0; // Restaurar opacidad
    ctx.setLineDash([]); // Restaurar línea sólida
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
    setScore(0);
  };

  const handleChangeFigure = (figureId: FigureType) => {
    setSelectedFigure(figureId);
    setLeftPoints([]);
    setIsDrawing(false);
    setScore(0);
    // Redibujar inmediatamente con la nueva figura
    setTimeout(() => drawCanvas(), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 p-4 md:p-8 relative overflow-hidden">
      {/* Estrellas de fondo animadas */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>

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

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-full hover:scale-105 transition-all shadow-xl border-2 border-yellow-200 flex items-center gap-2"
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

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-xl border-4 border-white">
          <div className="text-center">
            <div className="text-sm">Puntos</div>
            <div className="text-3xl" data-testid="score">{score} ⭐</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Selector de figuras */}
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

              <div className="mt-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-5 border-4 border-yellow-300 shadow-lg">
                <p className="text-sm font-bold text-gray-800 mb-2 text-center text-lg">
                  💡 ¿Qué es simetría?
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  ¡Es como un espejo mágico! 🪞 Todo lo que dibujes en un lado aparece igual en el otro lado.
                </p>
              </div>

              <div className="mt-4 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-2xl p-5 border-4 border-cyan-300 shadow-lg">
                <p className="text-sm font-bold text-gray-800 mb-2 text-center text-lg">
                  ✏️ ¿Cómo dibujar?
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  1️⃣ Elige tu figura favorita arriba<br />
                  2️⃣ Verás un boceto punteado en el tablero<br />
                  3️⃣ Dibuja encima del boceto en el lado izquierdo<br />
                  4️⃣ ¡Mira la magia del espejo! ✨
                </p>
              </div>

              {leftPoints.length > 0 && (
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

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 border-4 border-white">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  🎨 ¡Tu obra de arte!
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
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-blue-400 rounded-2xl p-5 shadow-lg">
                  <p className="text-gray-800 font-bold text-xl text-center mb-2">
                    {leftPoints.length === 0
                      ? '👆 ¡Sigue la línea punteada para dibujar tu figura! Dibuja en el lado izquierdo'
                      : `✨ ¡Increíble! Llevas ${leftPoints.length} puntos dibujados`}
                  </p>
                  <p className="text-gray-700 text-base text-center font-semibold">
                    {leftPoints.length === 0 
                      ? '🎨 El boceto te ayuda a saber dónde dibujar' 
                      : '¡Mira cómo brilla tu creación simétrica! 🌈✨'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ejemplos de simetría */}
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