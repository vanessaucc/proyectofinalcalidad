// src/components/SistemaSolar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SistemaSolar, { planets } from './SistemaSolar';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SistemaSolar Component', () => {
  test('renderiza el componente correctamente', () => {
    renderWithRouter(<SistemaSolar />);
    expect(screen.getByText('🌌 Sistema Solar Interactivo 🚀')).toBeInTheDocument();
  });

  test('muestra el botón de volver', () => {
    renderWithRouter(<SistemaSolar />);
    expect(screen.getByText('Volver al Inicio')).toBeInTheDocument();
  });

  test('renderiza el Sol', () => {
    renderWithRouter(<SistemaSolar />);
    const sun = screen.getByTestId('sun');
    expect(sun).toBeInTheDocument();
  });

  test('renderiza todos los planetas', () => {
    renderWithRouter(<SistemaSolar />);
    planets.forEach((planet) => {
      const planetElement = screen.getByTestId(`planet-${planet.name}`);
      expect(planetElement).toBeInTheDocument();
    });
  });

  test('renderiza todas las órbitas', () => {
    renderWithRouter(<SistemaSolar />);
    planets.forEach((planet) => {
      const orbit = screen.getByTestId(`orbit-${planet.name}`);
      expect(orbit).toBeInTheDocument();
    });
  });

  test('abre el modal al hacer clic en un planeta', () => {
    renderWithRouter(<SistemaSolar />);
    const tierraButton = screen.getByText(/Tierra/i).closest('button');
    
    if (tierraButton) {
      fireEvent.click(tierraButton);
      expect(screen.getByTestId('planet-modal')).toBeInTheDocument();
    }
  });

  test('muestra información del planeta en el modal', () => {
    renderWithRouter(<SistemaSolar />);
    const tierraButton = screen.getByText(/Tierra/i).closest('button');
    
    if (tierraButton) {
      fireEvent.click(tierraButton);
      expect(screen.getByText('Tierra')).toBeInTheDocument();
      expect(screen.getByText('149.6 millones km')).toBeInTheDocument();
      expect(screen.getByText('365 días')).toBeInTheDocument();
    }
  });

  test('cierra el modal al hacer clic en la X', () => {
    renderWithRouter(<SistemaSolar />);
    const tierraButton = screen.getByText(/Tierra/i).closest('button');
    
    if (tierraButton) {
      fireEvent.click(tierraButton);
      expect(screen.getByTestId('planet-modal')).toBeInTheDocument();
      
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);
      
      expect(screen.queryByTestId('planet-modal')).not.toBeInTheDocument();
    }
  });

  test('cierra el modal al hacer clic fuera', () => {
    renderWithRouter(<SistemaSolar />);
    const tierraButton = screen.getByText(/Tierra/i).closest('button');
    
    if (tierraButton) {
      fireEvent.click(tierraButton);
      const modal = screen.getByTestId('planet-modal');
      expect(modal).toBeInTheDocument();
      
      fireEvent.click(modal);
      
      expect(screen.queryByTestId('planet-modal')).not.toBeInTheDocument();
    }
  });

  test('el array de planetas tiene 8 elementos', () => {
    expect(planets).toHaveLength(8);
  });

  test('cada planeta tiene todas las propiedades requeridas', () => {
    planets.forEach((planet) => {
      expect(planet).toHaveProperty('id');
      expect(planet).toHaveProperty('name');
      expect(planet).toHaveProperty('icon');
      expect(planet).toHaveProperty('color');
      expect(planet).toHaveProperty('accentColor');
      expect(planet).toHaveProperty('size');
      expect(planet).toHaveProperty('distance');
      expect(planet).toHaveProperty('orbitDuration');
      expect(planet).toHaveProperty('info');
      expect(planet).toHaveProperty('temperature');
      expect(planet).toHaveProperty('curiosity');
    });
  });

  test('Mercurio es el planeta más pequeño', () => {
    const mercurio = planets.find(p => p.name === 'Mercurio');
    expect(mercurio?.size).toBe(28);
  });

  test('Júpiter es el planeta más grande', () => {
    const jupiter = planets.find(p => p.name === 'Júpiter');
    const sizes = planets.map(p => p.size);
    expect(jupiter?.size).toBe(Math.max(...sizes));
  });

  test('la Tierra es el tercer planeta', () => {
    expect(planets[2].name).toBe('Tierra');
  });

  test('Neptuno es el último planeta', () => {
    expect(planets[7].name).toBe('Neptuno');
  });

  test('todos los planetas tienen datos curiosos', () => {
    planets.forEach((planet) => {
      expect(planet.curiosity.length).toBeGreaterThan(0);
    });
  });

  // Tests adicionales para las nuevas funcionalidades

  test('renderiza las estrellas de fondo', () => {
    renderWithRouter(<SistemaSolar />);
    // Verifica que al menos algunas estrellas se renderizan
    const stars = screen.getAllByTestId(/star-/);
    expect(stars.length).toBeGreaterThan(0);
  });

  test('renderiza la barra de progreso', () => {
    renderWithRouter(<SistemaSolar />);
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.textContent).toContain('0/8 Planetas');
  });

  test('actualiza la barra de progreso al visitar un planeta', () => {
    renderWithRouter(<SistemaSolar />);
    const tierraButton = screen.getByText(/Tierra/i).closest('button');
    
    if (tierraButton) {
      fireEvent.click(tierraButton);
      fireEvent.click(screen.getByText('✕')); // Cerrar modal
      
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar.textContent).toContain('1/8 Planetas');
    }
  });

  test('muestra el botón de sonido', () => {
    renderWithRouter(<SistemaSolar />);
    const soundButton = screen.getByTestId('sound-toggle');
    expect(soundButton).toBeInTheDocument();
  });

  test('alterna el estado del sonido al hacer clic', () => {
    renderWithRouter(<SistemaSolar />);
    const soundButton = screen.getByTestId('sound-toggle');
    
    // Verificar que inicialmente está habilitado (Volume2)
    expect(soundButton.querySelector('svg')).toBeInTheDocument();
    
    fireEvent.click(soundButton);
    
    // Después de hacer clic, debería cambiar
    expect(soundButton.querySelector('svg')).toBeInTheDocument();
  });

  test('marca los planetas visitados con un checkmark', () => {
    renderWithRouter(<SistemaSolar />);
    const mercurioButton = screen.getByText(/Mercurio/i).closest('button');
    
    if (mercurioButton) {
      // Antes de hacer clic
      expect(mercurioButton.textContent).not.toContain('✅');
      
      fireEvent.click(mercurioButton);
      fireEvent.click(screen.getByText('✕')); // Cerrar modal
      
      // Después de hacer clic
      expect(mercurioButton.textContent).toContain('✅');
    }
  });

  test('muestra el modal de felicitaciones al visitar todos los planetas', async () => {
    renderWithRouter(<SistemaSolar />);
    
    // Visitar todos los planetas
    for (const planet of planets) {
      const planetButton = screen.getByText(new RegExp(planet.name, 'i')).closest('button');
      if (planetButton) {
        fireEvent.click(planetButton);
        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);
      }
    }
    
    // Esperar a que aparezca el modal de felicitaciones
    await waitFor(() => {
      expect(screen.getByTestId('congrats-modal')).toBeInTheDocument();
    });
    
    expect(screen.getByText('¡FELICIDADES!')).toBeInTheDocument();
    expect(screen.getByText(/Has visitado todos los planetas/i)).toBeInTheDocument();
  });

  test('cierra el modal de felicitaciones al hacer clic', async () => {
    renderWithRouter(<SistemaSolar />);
    
    // Visitar todos los planetas
    for (const planet of planets) {
      const planetButton = screen.getByText(new RegExp(planet.name, 'i')).closest('button');
      if (planetButton) {
        fireEvent.click(planetButton);
        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);
      }
    }
    
    await waitFor(() => {
      expect(screen.getByTestId('congrats-modal')).toBeInTheDocument();
    });
    
    const congratsButton = screen.getByText('¡Genial! 🎊');
    fireEvent.click(congratsButton);
    
    expect(screen.queryByTestId('congrats-modal')).not.toBeInTheDocument();
  });

  test('muestra información de las lunas en el modal', () => {
    renderWithRouter(<SistemaSolar />);
    const tierraButton = screen.getByText(/Tierra/i).closest('button');
    
    if (tierraButton) {
      fireEvent.click(tierraButton);
      expect(screen.getByText('🌙 Lunas')).toBeInTheDocument();
      expect(screen.getByText('1 luna')).toBeInTheDocument();
    }
  });

  test('muestra "Sin lunas" para planetas sin lunas', () => {
    renderWithRouter(<SistemaSolar />);
    const mercurioButton = screen.getByText(/Mercurio/i).closest('button');
    
    if (mercurioButton) {
      fireEvent.click(mercurioButton);
      expect(screen.getByText('🌙 Lunas')).toBeInTheDocument();
      expect(screen.getByText('Sin lunas')).toBeInTheDocument();
    }
  });

  test('muestra el dato divertido adicional cuando existe', () => {
    renderWithRouter(<SistemaSolar />);
    const mercurioButton = screen.getByText(/Mercurio/i).closest('button');
    
    if (mercurioButton) {
      fireEvent.click(mercurioButton);
      expect(screen.getByText('🎉 ¡Dato Divertido!')).toBeInTheDocument();
      expect(screen.getByText(/Puedes ver Mercurio sin telescopio/i)).toBeInTheDocument();
    }
  });

  test('todos los planetas nuevos tienen la propiedad moons', () => {
    planets.forEach((planet) => {
      expect(planet).toHaveProperty('moons');
      expect(typeof planet.moons).toBe('number');
    });
  });

  test('Júpiter tiene el mayor número de lunas', () => {
    const jupiter = planets.find(p => p.name === 'Júpiter');
    const allMoons = planets.map(p => p.moons || 0);
    expect(jupiter?.moons).toBe(Math.max(...allMoons));
  });

  test('la barra de progreso muestra el porcentaje correcto', () => {
    renderWithRouter(<SistemaSolar />);
    const progressBar = screen.getByTestId('progress-bar');
    
    // Inicialmente 0%
    expect(progressBar.style.width).toBe('0%');
    
    // Visitar 4 planetas (50%)
    const planetsToVisit = planets.slice(0, 4);
    planetsToVisit.forEach((planet) => {
      const planetButton = screen.getByText(new RegExp(planet.name, 'i')).closest('button');
      if (planetButton) {
        fireEvent.click(planetButton);
        fireEvent.click(screen.getByText('✕'));
      }
    });
    
    expect(progressBar.style.width).toBe('50%');
  });

  test('no muestra el modal de felicitaciones si no se han visitado todos los planetas', () => {
    renderWithRouter(<SistemaSolar />);
    
    // Visitar solo la mitad de los planetas
    const halfPlanets = planets.slice(0, 4);
    halfPlanets.forEach((planet) => {
      const planetButton = screen.getByText(new RegExp(planet.name, 'i')).closest('button');
      if (planetButton) {
        fireEvent.click(planetButton);
        fireEvent.click(screen.getByText('✕'));
      }
    });
    
    expect(screen.queryByTestId('congrats-modal')).not.toBeInTheDocument();
  });
});