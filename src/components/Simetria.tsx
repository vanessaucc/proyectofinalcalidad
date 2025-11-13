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
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4; // Más transparente para que sea una guía suave
    ctx.setLineDash([8, 4]); // Línea punteada visible

    const centerY = 200; // Centro vertical del canvas

    switch (selectedFigure) {
      case 'butterfly':
        // Ala superior izquierda
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY - 80);
        ctx.quadraticCurveTo(centerX - 80, centerY - 120, centerX - 100, centerY - 60);
        ctx.quadraticCurveTo(centerX - 110, centerY - 30, centerX - 80, centerY - 20);
        ctx.quadraticCurveTo(centerX - 50, centerY - 10, centerX - 10, centerY - 20);
        ctx.stroke();
        
        // Ala inferior izquierda
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY + 20);
        ctx.quadraticCurveTo(centerX - 50, centerY + 30, centerX - 70, centerY + 60);
        ctx.quadraticCurveTo(centerX - 80, centerY + 90, centerX - 60, centerY + 100);
        ctx.quadraticCurveTo(centerX - 30, centerY + 90, centerX - 10, centerY + 80);
        ctx.stroke();
        
        // Cuerpo central (en el eje de simetría)
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 6, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Antenas
        ctx.globalAlpha = 0.4;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 75, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 75, 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'star':
        // Estrella de 5 puntas - solo el lado izquierdo
        const points = [
          { x: centerX, y: centerY - 80 },           // Punta superior (en el centro)
          { x: centerX - 25, y: centerY - 30 },      // Interior izquierdo superior
          { x: centerX - 80, y: centerY - 25 },      // Punta izquierda
          { x: centerX - 35, y: centerY + 10 },      // Interior izquierdo inferior
          { x: centerX - 50, y: centerY + 70 },      // Punta inferior izquierda
          { x: centerX, y: centerY + 35 }            // Interior inferior (en el centro)
        ];
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[0].x, points[0].y);
        ctx.stroke();
        break;

      case 'heart':
        // Corazón - mitad izquierda
        ctx.beginPath();
        // Parte superior (semicírculo)
        ctx.arc(centerX - 40, centerY - 30, 35, 0, Math.PI, true);
        // Curva hacia la punta del corazón
        ctx.quadraticCurveTo(centerX - 90, centerY, centerX - 70, centerY + 40);
        ctx.quadraticCurveTo(centerX - 40, centerY + 70, centerX, centerY + 90);
        // Línea de vuelta al centro superior
        ctx.lineTo(centerX, centerY - 65);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'leaf':
        // Hoja - mitad izquierda con nervaduras
        ctx.beginPath();
        // Contorno exterior de la hoja
        ctx.moveTo(centerX, centerY - 90);
        ctx.quadraticCurveTo(centerX - 60, centerY - 60, centerX - 80, centerY - 20);
        ctx.quadraticCurveTo(centerX - 90, centerY + 20, centerX - 70, centerY + 60);
        ctx.quadraticCurveTo(centerX - 40, centerY + 85, centerX, centerY + 95);
        ctx.stroke();
        
        // Nervadura central (eje de simetría)
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 90);
        ctx.lineTo(centerX, centerY + 95);
        ctx.stroke();
        
        // Nervaduras secundarias
        ctx.setLineDash([8, 4]);
        ctx.globalAlpha = 0.25;
        const veins = [
          { start: centerY - 70, end: -50 },
          { start: centerY - 40, end: -35 },
          { start: centerY - 10, end: -25 },
          { start: centerY + 20, end: -20 },
          { start: centerY + 50, end: -30 },
          { start: centerY + 75, end: -25 }
        ];
        
        veins.forEach(vein => {
          ctx.beginPath();
          ctx.moveTo(centerX, vein.start);
          ctx.lineTo(centerX + vein.end, vein.start - 10);
          ctx.stroke();
        });
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
                      ? '👆 Haz clic y arrastra en el lado izquierdo para dibujar'
                      : `✨ ¡Increíble! Llevas ${leftPoints.length} puntos dibujados`}
                  </p>
                  <p className="text-gray-700 text-base text-center font-semibold">
                    {leftPoints.length > 0 && '¡Mira cómo brilla tu creación simétrica! 🌈✨'}
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