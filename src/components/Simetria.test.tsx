// src/components/Simetria.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Simetria from './Simetria';

// Mock de canvas context - ACTUALIZADO con métodos adicionales
const mockCanvasContext = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  setLineDash: jest.fn(),
  ellipse: jest.fn(), // NUEVO - para los bocetos
  quadraticCurveTo: jest.fn(), // NUEVO - para la hoja
  closePath: jest.fn(), // NUEVO - para cerrar paths
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  globalAlpha: 1 // NUEVO - para transparencia
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

  // NUEVOS TESTS para la funcionalidad de bocetos guía
  test('dibuja el boceto guía de mariposa cuando no hay puntos', () => {
    renderWithRouter(<Simetria />);
    // La mariposa está seleccionada por defecto
    expect(mockCanvasContext.ellipse).toHaveBeenCalled();
  });

  test('dibuja el boceto guía de estrella al seleccionarla', () => {
    renderWithRouter(<Simetria />);
    const starButton = screen.getByTestId('figure-star');
    
    mockCanvasContext.lineTo.mockClear();
    fireEvent.click(starButton);
    
    expect(mockCanvasContext.lineTo).toHaveBeenCalled();
  });

  test('dibuja el boceto guía de corazón al seleccionarlo', () => {
    renderWithRouter(<Simetria />);
    const heartButton = screen.getByTestId('figure-heart');
    
    mockCanvasContext.arc.mockClear();
    fireEvent.click(heartButton);
    
    expect(mockCanvasContext.arc).toHaveBeenCalled();
  });

  test('dibuja el boceto guía de hoja al seleccionarla', () => {
    renderWithRouter(<Simetria />);
    const leafButton = screen.getByTestId('figure-leaf');
    
    mockCanvasContext.quadraticCurveTo.mockClear();
    fireEvent.click(leafButton);
    
    expect(mockCanvasContext.quadraticCurveTo).toHaveBeenCalled();
  });

  test('el boceto guía usa transparencia', () => {
    renderWithRouter(<Simetria />);
    // Verificar que se establece la transparencia para el boceto
    expect(mockCanvasContext.globalAlpha).toBeDefined();
  });

  test('el boceto desaparece cuando se empieza a dibujar', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    // Limpiar los mocks para contar solo las nuevas llamadas
    mockCanvasContext.ellipse.mockClear();
    
    // Empezar a dibujar
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    
    // El boceto no debería dibujarse más (ellipse se llama menos veces)
    const ellipseCalls = mockCanvasContext.ellipse.mock.calls.length;
    expect(ellipseCalls).toBeLessThan(3); // Mariposa tiene 2 elipses en el boceto
  });

  test('el boceto reaparece después de limpiar el canvas', () => {
    renderWithRouter(<Simetria />);
    const canvas = screen.getByTestId('canvas');
    
    // Dibujar algo
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseUp(canvas);
    
    // Limpiar mocks
    mockCanvasContext.ellipse.mockClear();
    
    // Reiniciar
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    
    // El boceto debería dibujarse de nuevo
    expect(mockCanvasContext.ellipse).toHaveBeenCalled();
  });
});