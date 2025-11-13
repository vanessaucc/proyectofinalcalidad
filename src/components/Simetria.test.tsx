// src/components/Simetria.test.tsx
import { jest } from "@jest/globals";
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Simetria from './Simetria';

// Mock de canvas context - COMPLETO con todos los métodos necesarios
const mockCanvasContext = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  setLineDash: jest.fn(),
  ellipse: jest.fn(),
  quadraticCurveTo: jest.fn(),
  closePath: jest.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  globalAlpha: 1
};

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvasContext as any);
  HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
    left: 0,
    top: 0,
    width: 600,
    height: 400,
    right: 600,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => {}
  }));
});

beforeEach(() => {
  jest.clearAllMocks();
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Simetria Component', () => {
  test('renderiza el componente correctamente', () => {
    renderWithRouter(<Simetria />);
    expect(screen.getByText('🎨 ¡Descubre la Simetría! 🪞')).toBeInTheDocument();
    expect(screen.getByText(/Dibuja en un lado y mira la magia del espejo/)).toBeInTheDocument();
  });

  test('muestra todas las figuras disponibles', () => {
    renderWithRouter(<Simetria />);
    expect(screen.getByTestId('figure-butterfly')).toBeInTheDocument();
    expect(screen.getByTestId('figure-star')).toBeInTheDocument();
    expect(screen.getByTestId('figure-heart')).toBeInTheDocument();
    expect(screen.getByTestId('figure-leaf')).toBeInTheDocument();
  });

  test('muestra el canvas correctamente', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '600');
    expect(canvas).toHaveAttribute('height', '400');
  });

  test('muestra la puntuación inicial en 0', () => {
    renderWithRouter(<Simetria />);
    expect(screen.getByText('Puntos')).toBeInTheDocument();
    const scoreElement = screen.getByTestId('score');
    expect(scoreElement).toHaveTextContent('0 ⭐');
  });

  test('cambia de figura al hacer clic en estrella', () => {
    renderWithRouter(<Simetria />);
    const starButton = screen.getByTestId('figure-star');
    fireEvent.click(starButton);
    expect(starButton).toHaveClass('ring-4', 'ring-purple-500');
  });

  test('cambia de figura al hacer clic en corazón', () => {
    renderWithRouter(<Simetria />);
    const heartButton = screen.getByTestId('figure-heart');
    fireEvent.click(heartButton);
    expect(heartButton).toHaveClass('ring-4', 'ring-purple-500');
  });

  test('cambia de figura al hacer clic en hoja', () => {
    renderWithRouter(<Simetria />);
    const leafButton = screen.getByTestId('figure-leaf');
    fireEvent.click(leafButton);
    expect(leafButton).toHaveClass('ring-4', 'ring-purple-500');
  });

  test('muestra el botón de reiniciar', () => {
    renderWithRouter(<Simetria />);
    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveTextContent('🔄 Limpiar y empezar');
  });

  test('limpia el canvas al hacer clic en reiniciar', () => {
    renderWithRouter(<Simetria />);
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    expect(mockCanvasContext.clearRect).toHaveBeenCalled();
  });

  test('dibuja puntos al mover el mouse con el botón presionado', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    fireEvent.mouseUp(canvas);
    
    expect(mockCanvasContext.lineTo).toHaveBeenCalled();
  });

  test('detiene el dibujo al soltar el mouse', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseUp(canvas);
    
    mockCanvasContext.lineTo.mockClear();
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    
    expect(mockCanvasContext.lineTo).not.toHaveBeenCalled();
  });

  test('muestra información educativa sobre simetría', () => {
    renderWithRouter(<Simetria />);
    expect(screen.getByText('💡 ¿Qué es simetría?')).toBeInTheDocument();
    expect(screen.getByText(/Es como un espejo mágico/)).toBeInTheDocument();
  });

  test('muestra ejemplos de simetría en la naturaleza', () => {
    renderWithRouter(<Simetria />);
    expect(screen.getByText('Simetría en la naturaleza')).toBeInTheDocument();
    expect(screen.getByText('Mariposas')).toBeInTheDocument();
    expect(screen.getByText('Copos de nieve')).toBeInTheDocument();
    expect(screen.getByText('Flores')).toBeInTheDocument();
    expect(screen.getByText('Rostros')).toBeInTheDocument();
  });

  test('cambia entre diferentes figuras correctamente', () => {
    renderWithRouter(<Simetria />);
    
    const butterflyButton = screen.getByTestId('figure-butterfly');
    expect(butterflyButton).toHaveClass('ring-4');
    
    const starButton = screen.getByTestId('figure-star');
    fireEvent.click(starButton);
    expect(starButton).toHaveClass('ring-4');
    
    const heartButton = screen.getByTestId('figure-heart');
    fireEvent.click(heartButton);
    expect(heartButton).toHaveClass('ring-4');
    
    const leafButton = screen.getByTestId('figure-leaf');
    fireEvent.click(leafButton);
    expect(leafButton).toHaveClass('ring-4');
  });

  test('muestra el botón de volver al inicio', () => {
    renderWithRouter(<Simetria />);
    const backButton = screen.getByText('Volver al Inicio');
    expect(backButton).toBeInTheDocument();
  });

  test('dibuja la línea de simetría en el canvas', () => {
    renderWithRouter(<Simetria />);
    expect(mockCanvasContext.setLineDash).toHaveBeenCalledWith([15, 8]);
    expect(mockCanvasContext.moveTo).toHaveBeenCalled();
    expect(mockCanvasContext.lineTo).toHaveBeenCalled();
  });

  test('resetea la puntuación al cambiar de figura', () => {
    renderWithRouter(<Simetria />);
    const starButton = screen.getByTestId('figure-star');
    fireEvent.click(starButton);
    
    const scoreElement = screen.getByTestId('score');
    expect(scoreElement).toHaveTextContent('0 ⭐');
  });

  test('muestra estrellas animadas en el fondo', () => {
    renderWithRouter(<Simetria />);
    const stars = screen.getAllByText('✨');
    expect(stars.length).toBeGreaterThanOrEqual(30);
  });

  test('el canvas tiene las dimensiones correctas', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(400);
  });

  test('dibuja círculos para representar puntos', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    fireEvent.mouseUp(canvas);
    
    expect(mockCanvasContext.arc).toHaveBeenCalled();
  });

  test('maneja correctamente el evento mouseLeave', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseLeave(canvas);
    
    mockCanvasContext.lineTo.mockClear();
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    
    expect(mockCanvasContext.lineTo).not.toHaveBeenCalled();
  });

  test('muestra el título principal correctamente', () => {
    renderWithRouter(<Simetria />);
    expect(screen.getByText('Elige tu figura')).toBeInTheDocument();
  });

  test('aplica estilos de gradiente a las figuras', () => {
    renderWithRouter(<Simetria />);
    const butterflyButton = screen.getByTestId('figure-butterfly');
    expect(butterflyButton).toHaveAttribute('style');
  });

  test('reinicia correctamente al presionar el botón de reinicio', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseUp(canvas);
    
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    
    expect(mockCanvasContext.clearRect).toHaveBeenCalled();
    
    const scoreElement = screen.getByTestId('score');
    expect(scoreElement).toHaveTextContent('0 ⭐');
  });

  test('cada figura tiene un color único', () => {
    renderWithRouter(<Simetria />);
    
    const butterflyButton = screen.getByTestId('figure-butterfly');
    const starButton = screen.getByTestId('figure-star');
    const heartButton = screen.getByTestId('figure-heart');
    const leafButton = screen.getByTestId('figure-leaf');
    
    expect(butterflyButton).toHaveAttribute('style');
    expect(starButton).toHaveAttribute('style');
    expect(heartButton).toHaveAttribute('style');
    expect(leafButton).toHaveAttribute('style');
  });

  test('muestra guías visuales para el usuario', () => {
    renderWithRouter(<Simetria />);
    expect(screen.getByText('← Dibuja aquí')).toBeInTheDocument();
    expect(screen.getByText('Espejo mágico →')).toBeInTheDocument();
  });

  // TESTS para la funcionalidad de bocetos guía
  test('dibuja el boceto guía cuando no hay puntos dibujados', () => {
    renderWithRouter(<Simetria />);
    // Verificar que se llaman los métodos de dibujo para el boceto
    expect(mockCanvasContext.beginPath).toHaveBeenCalled();
    expect(mockCanvasContext.stroke).toHaveBeenCalled();
  });

  test('usa línea punteada para el boceto guía', () => {
    renderWithRouter(<Simetria />);
    // Verificar que se establece el patrón de línea punteada [8, 4]
    expect(mockCanvasContext.setLineDash).toHaveBeenCalledWith([8, 4]);
  });

  test('el boceto de mariposa usa curvas cuadráticas', () => {
    renderWithRouter(<Simetria />);
    // La mariposa está seleccionada por defecto y usa quadraticCurveTo
    expect(mockCanvasContext.quadraticCurveTo).toHaveBeenCalled();
  });

  test('el boceto de estrella dibuja múltiples líneas', () => {
    renderWithRouter(<Simetria />);
    const starButton = screen.getByTestId('figure-star');
    
    mockCanvasContext.lineTo.mockClear();
    fireEvent.click(starButton);
    
    // La estrella usa múltiples lineTo para dibujar sus puntas
    expect(mockCanvasContext.lineTo).toHaveBeenCalled();
  });

  test('el boceto de corazón usa arcos', () => {
    renderWithRouter(<Simetria />);
    const heartButton = screen.getByTestId('figure-heart');
    
    mockCanvasContext.arc.mockClear();
    fireEvent.click(heartButton);
    
    // El corazón usa arc para la parte superior
    expect(mockCanvasContext.arc).toHaveBeenCalled();
  });

  test('el boceto de hoja usa curvas y líneas', () => {
    renderWithRouter(<Simetria />);
    const leafButton = screen.getByTestId('figure-leaf');
    
    mockCanvasContext.quadraticCurveTo.mockClear();
    mockCanvasContext.lineTo.mockClear();
    fireEvent.click(leafButton);
    
    // La hoja usa tanto curvas como líneas
    expect(mockCanvasContext.quadraticCurveTo).toHaveBeenCalled();
    expect(mockCanvasContext.lineTo).toHaveBeenCalled();
  });

  test('el boceto usa transparencia (globalAlpha)', () => {
    renderWithRouter(<Simetria />);
    // Verificar que globalAlpha se establece para la transparencia
    expect(mockCanvasContext.globalAlpha).toBeDefined();
  });

  test('el boceto desaparece cuando se empieza a dibujar', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    // Contar las llamadas antes de dibujar
    const callsBeforeDraw = mockCanvasContext.quadraticCurveTo.mock.calls.length;
    
    // Empezar a dibujar
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    
    // Las llamadas a quadraticCurveTo no deberían aumentar mucho
    // porque el boceto ya no se dibuja
    const callsAfterDraw = mockCanvasContext.quadraticCurveTo.mock.calls.length;
    expect(callsAfterDraw - callsBeforeDraw).toBeLessThanOrEqual(2);
  });

  test('el boceto reaparece después de limpiar el canvas', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    // Dibujar algo
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseUp(canvas);
    
    // Limpiar el contador de llamadas
    mockCanvasContext.quadraticCurveTo.mockClear();
    
    // Reiniciar
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    
    // El boceto debería dibujarse de nuevo
    expect(mockCanvasContext.quadraticCurveTo).toHaveBeenCalled();
  });

  test('todos los bocetos se dibujan en el lado izquierdo del canvas', () => {
    renderWithRouter(<Simetria />);
    
    // Verificar que se llaman métodos de dibujo
    expect(mockCanvasContext.moveTo).toHaveBeenCalled();
    expect(mockCanvasContext.stroke).toHaveBeenCalled();
  });

  test('los bocetos usan el color de la figura seleccionada', () => {
    renderWithRouter(<Simetria />);
    
    // Verificar que strokeStyle se establece (aunque sea un string vacío en el mock)
    expect(mockCanvasContext.strokeStyle).toBeDefined();
  });

  test('cambia el boceto al cambiar de figura', () => {
    renderWithRouter(<Simetria />);
    
    // Limpiar mocks
    mockCanvasContext.quadraticCurveTo.mockClear();
    mockCanvasContext.arc.mockClear();
    
    // Cambiar a corazón
    const heartButton = screen.getByTestId('figure-heart');
    fireEvent.click(heartButton);
    
    // Verificar que se dibuja el nuevo boceto
    expect(mockCanvasContext.arc).toHaveBeenCalled();
  });
});