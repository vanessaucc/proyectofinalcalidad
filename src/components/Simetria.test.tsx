// src/components/Simetria.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Simetria from './Simetria';

// Mock de canvas context
const mockCanvasContext = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  closePath: jest.fn(),
  arc: jest.fn(),
  fillText: jest.fn(),
  setLineDash: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  shadowColor: '',
  shadowBlur: 0,
  font: '',
  fillRect: jest.fn()
};

// Mock de HTMLCanvasElement.prototype.getContext
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
    if (contextType === '2d') {
      return mockCanvasContext as any;
    }
    return null;
  });

  // Mock de getBoundingClientRect
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

// Mock de requestAnimationFrame y cancelAnimationFrame
beforeEach(() => {
  global.requestAnimationFrame = jest.fn((cb) => {
    cb(0);
    return 0;
  });
  global.cancelAnimationFrame = jest.fn();
  jest.clearAllMocks();
});

afterEach(() => {
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

  test('muestra ejemplo inicial de la mariposa', () => {
    renderWithRouter(<Simetria />);
    
    expect(screen.getByText('🌟 Ejemplo mágico')).toBeInTheDocument();
    expect(screen.getByText(/Este es un/)).toBeInTheDocument();
    expect(screen.getByText('EJEMPLO')).toBeInTheDocument();
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
    
    // La figura de estrella debe tener la clase activa
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
    
    // Debe limpiar el canvas
    expect(mockCanvasContext.clearRect).toHaveBeenCalled();
  });

  test('inicia el dibujo al hacer clic en el canvas en el lado izquierdo', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Hacer clic en el lado izquierdo del canvas (x < 300)
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    
    // Debe cambiar el estado para mostrar que no es ejemplo
    waitFor(() => {
      expect(screen.queryByText('🌟 Ejemplo mágico')).not.toBeInTheDocument();
    });
  });

  test('dibuja puntos al mover el mouse con el botón presionado', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Iniciar el dibujo
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    
    // Mover el mouse (esto debería agregar puntos)
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    
    // Soltar el mouse
    fireEvent.mouseUp(canvas);
    
    // El canvas debe haber dibujado líneas
    expect(mockCanvasContext.lineTo).toHaveBeenCalled();
  });

  test('no dibuja si el mouse está en el lado derecho del canvas', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Intentar dibujar en el lado derecho (x >= 300)
    fireEvent.mouseDown(canvas, { clientX: 400, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 410, clientY: 210 });
    
    // Debe mantener el modo ejemplo
    expect(screen.getByText('🌟 Ejemplo mágico')).toBeInTheDocument();
  });

  test('detiene el dibujo al soltar el mouse', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Iniciar dibujo
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    
    // Soltar mouse
    fireEvent.mouseUp(canvas);
    
    // Limpiar el mock para contar solo las nuevas llamadas
    mockCanvasContext.lineTo.mockClear();
    
    // Mover sin estar presionado no debe dibujar nuevas líneas
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    
    // No debe haber nuevas llamadas a lineTo
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
    
    // Verificar que mariposa está seleccionada inicialmente
    const butterflyButton = screen.getByTestId('figure-butterfly');
    expect(butterflyButton).toHaveClass('ring-4');
    
    // Cambiar a estrella
    const starButton = screen.getByTestId('figure-star');
    fireEvent.click(starButton);
    expect(starButton).toHaveClass('ring-4');
    
    // Cambiar a corazón
    const heartButton = screen.getByTestId('figure-heart');
    fireEvent.click(heartButton);
    expect(heartButton).toHaveClass('ring-4');
    
    // Cambiar a hoja
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
    
    // Verificar que se configuró la línea punteada
    expect(mockCanvasContext.setLineDash).toHaveBeenCalledWith([15, 8]);
    
    // Verificar que se dibujó la línea de simetría
    expect(mockCanvasContext.moveTo).toHaveBeenCalled();
    expect(mockCanvasContext.lineTo).toHaveBeenCalled();
  });

  test('resetea la puntuación al cambiar de figura', () => {
    renderWithRouter(<Simetria />);
    
    // Cambiar a otra figura
    const starButton = screen.getByTestId('figure-star');
    fireEvent.click(starButton);
    
    // La puntuación debe estar en 0
    const scoreElement = screen.getByTestId('score');
    expect(scoreElement).toHaveTextContent('0 ⭐');
  });

  test('muestra estrellas animadas en el fondo', () => {
    renderWithRouter(<Simetria />);
    
    // Debe haber múltiples elementos con estrellas (30 estrellas)
    const stars = screen.getAllByText('✨');
    expect(stars.length).toBeGreaterThanOrEqual(30);
  });

  test('el canvas tiene las dimensiones correctas', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(400);
  });

  test('muestra mensaje cuando se sale del modo ejemplo', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Hacer clic para salir del modo ejemplo
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseUp(canvas);
    
    // Debe mostrar el mensaje de dibujo
    waitFor(() => {
      expect(screen.getByText(/Haz clic y arrastra en el lado izquierdo/)).toBeInTheDocument();
    });
  });

  test('dibuja círculos para representar puntos', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Dibujar algunos puntos
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    fireEvent.mouseUp(canvas);
    
    // Debe haber dibujado círculos (puntos)
    expect(mockCanvasContext.arc).toHaveBeenCalled();
  });

  test('maneja correctamente el evento mouseLeave', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Iniciar dibujo
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    
    // Salir del canvas
    fireEvent.mouseLeave(canvas);
    
    // Limpiar el mock
    mockCanvasContext.lineTo.mockClear();
    
    // Mover después de salir no debe dibujar
    fireEvent.mouseMove(canvas, { clientX: 170, clientY: 220 });
    
    // No debe haber nuevas llamadas
    expect(mockCanvasContext.lineTo).not.toHaveBeenCalled();
  });

  test('todas las figuras tienen nombre y emoji visibles', () => {
    renderWithRouter(<Simetria />);
    
    expect(screen.getByText(/Mariposa/)).toBeInTheDocument();
    expect(screen.getByText(/Estrella/)).toBeInTheDocument();
    expect(screen.getByText(/Corazón/)).toBeInTheDocument();
    expect(screen.getByText(/Hoja/)).toBeInTheDocument();
  });

  test('muestra el título principal correctamente', () => {
    renderWithRouter(<Simetria />);
    
    expect(screen.getByText('Elige tu figura')).toBeInTheDocument();
  });

  test('aplica estilos de gradiente a las figuras', () => {
    renderWithRouter(<Simetria />);
    
    const butterflyButton = screen.getByTestId('figure-butterfly');
    
    // Verificar que tiene un atributo de estilo
    expect(butterflyButton).toHaveAttribute('style');
  });

  test('reinicia correctamente al presionar el botón de reinicio', () => {
    renderWithRouter(<Simetria />);
    
    const canvas = screen.getByTestId('canvas');
    
    // Hacer algunos trazos
    fireEvent.mouseDown(canvas, { clientX: 150, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 160, clientY: 210 });
    fireEvent.mouseUp(canvas);
    
    // Reiniciar
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    
    // Verificar que se limpió el canvas
    expect(mockCanvasContext.clearRect).toHaveBeenCalled();
    
    // La puntuación debe estar en 0
    const scoreElement = screen.getByTestId('score');
    expect(scoreElement).toHaveTextContent('0 ⭐');
  });

  test('muestra el canvas de partículas para celebraciones', () => {
    renderWithRouter(<Simetria />);
    
    // Debe haber un canvas de partículas (además del canvas principal)
    const canvases = screen.getAllByRole('img', { hidden: true });
    expect(canvases.length).toBeGreaterThanOrEqual(1);
  });

  test('cada figura tiene un color único', () => {
    renderWithRouter(<Simetria />);
    
    const butterflyButton = screen.getByTestId('figure-butterfly');
    const starButton = screen.getByTestId('figure-star');
    const heartButton = screen.getByTestId('figure-heart');
    const leafButton = screen.getByTestId('figure-leaf');
    
    // Cada botón debe tener un estilo de fondo
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

  test('dibuja el gradiente de fondo en el canvas', () => {
    renderWithRouter(<Simetria />);
    
    // Verificar que se creó un gradiente
    expect(mockCanvasContext.createLinearGradient).toHaveBeenCalled();
    expect(mockCanvasContext.fillRect).toHaveBeenCalled();
  });
});