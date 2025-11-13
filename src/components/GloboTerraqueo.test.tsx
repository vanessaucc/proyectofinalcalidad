/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GloboTerraqueo from './GloboTerraqueo';

// Mock para Three.js (evita errores por WebGLRenderer)
jest.mock('three', () => ({
  Scene: jest.fn().mockImplementation(() => ({ add: jest.fn() })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({ position: { z: 0 } })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    domElement: document.createElement('canvas'),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  SphereGeometry: jest.fn().mockImplementation(() => ({ dispose: jest.fn() })),
  ShaderMaterial: jest.fn().mockImplementation(() => ({
    dispose: jest.fn(),
    uniforms: { time: { value: 0 } },
  })),
  Mesh: jest.fn().mockImplementation(() => ({ rotation: { y: 0 } })),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn().mockImplementation(() => ({ position: { set: jest.fn() } })),
  BackSide: 'BackSide',
  AdditiveBlending: 'AdditiveBlending',
}));

// Helper para renderizar con Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('🌍 GloboTerraqueo Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renderiza el título principal correctamente', () => {
    renderWithRouter(<GloboTerraqueo />);
    expect(screen.getByText('🌍 Aventura por el Mundo 🌍')).toBeInTheDocument();
  });

  it('muestra los continentes disponibles', () => {
    renderWithRouter(<GloboTerraqueo />);
    expect(screen.getByText('América del Norte')).toBeInTheDocument();
    expect(screen.getByText('América del Sur')).toBeInTheDocument();
    expect(screen.getByText('Europa')).toBeInTheDocument();
    expect(screen.getByText('África')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Oceanía')).toBeInTheDocument();
  });

  it('permite abrir un continente y mostrar sus países', async () => {
    renderWithRouter(<GloboTerraqueo />);
    fireEvent.click(screen.getByText('América del Sur'));

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido a América del Sur/i)).toBeInTheDocument();
    });

    // Países de América del Sur visibles
    expect(screen.getByText('Colombia')).toBeInTheDocument();
    expect(screen.getByText('Brasil')).toBeInTheDocument();
  });

  it('muestra los datos del país al seleccionarlo', async () => {
    renderWithRouter(<GloboTerraqueo />);
    fireEvent.click(screen.getByText('América del Sur'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Colombia'));
    });

    await waitFor(() => {
      expect(screen.getByText('Capital: Bogotá')).toBeInTheDocument();
      expect(screen.getByText('Población: 51 millones')).toBeInTheDocument();
    });
  });

  it('muestra el botón Volver al Inicio', () => {
    renderWithRouter(<GloboTerraqueo />);
    const backButton = screen.getByText(/Volver al Inicio/i);
    expect(backButton).toBeInTheDocument();
  });

  it('muestra correctamente el número de países por continente', () => {
    renderWithRouter(<GloboTerraqueo />);
    
    // Verificar que muestre el conteo de países
    const continentButtons = screen.getAllByText(/países/i);
    expect(continentButtons.length).toBeGreaterThan(0);
  });

  it('incrementa puntos al visitar un país por primera vez', async () => {
    renderWithRouter(<GloboTerraqueo />);
    
    // Puntos iniciales deben ser 0
    expect(screen.getByText('0')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('América del Sur'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Colombia'));
    });

    await waitFor(() => {
      // Debe incrementar a 10 puntos
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  it('muestra el contador de países visitados', () => {
    renderWithRouter(<GloboTerraqueo />);
    expect(screen.getByText(/VISITADOS/i)).toBeInTheDocument();
    expect(screen.getByText(/0\/12/i)).toBeInTheDocument();
  });

  it('puede cerrar el modal del continente con el botón Volver', async () => {
    renderWithRouter(<GloboTerraqueo />);
    fireEvent.click(screen.getByText('América del Sur'));

    await waitFor(() => {
      expect(screen.getByText('Bienvenido a América del Sur')).toBeInTheDocument();
    });

    const volverButton = screen.getByText('🔄 Volver');
    fireEvent.click(volverButton);

    await waitFor(() => {
      expect(screen.queryByText('Bienvenido a América del Sur')).not.toBeInTheDocument();
    });
  });

  it('muestra banderas de los países', async () => {
    renderWithRouter(<GloboTerraqueo />);
    fireEvent.click(screen.getByText('América del Norte'));

    await waitFor(() => {
      expect(screen.getByText('🇲🇽')).toBeInTheDocument(); // México
      expect(screen.getByText('🇺🇸')).toBeInTheDocument(); // Estados Unidos
    });
  });

  it('muestra check en países ya visitados', async () => {
    renderWithRouter(<GloboTerraqueo />);
    
    // Visitar Colombia
    fireEvent.click(screen.getByText('América del Sur'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Colombia'));
    });

    // Volver al continente
    await waitFor(() => {
      fireEvent.click(screen.getByText('🔙 Volver al Continente'));
    });

    // Debe mostrar el check ✅
    await waitFor(() => {
      expect(screen.getByText('✅')).toBeInTheDocument();
    });
  });

  it('permite explorar múltiples continentes', async () => {
    renderWithRouter(<GloboTerraqueo />);
    
    // Explorar América del Norte
    fireEvent.click(screen.getByText('América del Norte'));
    await waitFor(() => {
      expect(screen.getByText('Bienvenido a América del Norte')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('🔄 Volver'));

    // Explorar Europa
    fireEvent.click(screen.getByText('Europa'));
    await waitFor(() => {
      expect(screen.getByText('Bienvenido a Europa')).toBeInTheDocument();
    });
  });

  it('muestra información de población del país', async () => {
    renderWithRouter(<GloboTerraqueo />);
    fireEvent.click(screen.getByText('Asia'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Japón'));
    });

    await waitFor(() => {
      expect(screen.getByText('Población: 125 millones')).toBeInTheDocument();
    });
  });

  it('muestra todos los 12 países en el sistema', () => {
    renderWithRouter(<GloboTerraqueo />);
    expect(screen.getByText(/0\/12/i)).toBeInTheDocument();
  });

  it('cierra el modal de país al hacer clic en volver al continente', async () => {
    renderWithRouter(<GloboTerraqueo />);
    
    fireEvent.click(screen.getByText('Europa'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Francia'));
    });

    await waitFor(() => {
      expect(screen.getByText('Capital: París')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('🔙 Volver al Continente'));

    await waitFor(() => {
      expect(screen.queryByText('Capital: París')).not.toBeInTheDocument();
      expect(screen.getByText('Bienvenido a Europa')).toBeInTheDocument();
    });
  });

  it('muestra la información correcta del continente del país', async () => {
    renderWithRouter(<GloboTerraqueo />);
    
    fireEvent.click(screen.getByText('África'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Egipto'));
    });

    await waitFor(() => {
      expect(screen.getByText('Continente: África')).toBeInTheDocument();
    });
  });

  it('actualiza el contador de visitados correctamente', async () => {
    renderWithRouter(<GloboTerraqueo />);
    
    // Inicialmente 0/12
    expect(screen.getByText('0/12')).toBeInTheDocument();
    
    // Visitar primer país
    fireEvent.click(screen.getByText('Asia'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('China'));
    });

    await waitFor(() => {
      expect(screen.getByText('1/12')).toBeInTheDocument();
    });
  });
});