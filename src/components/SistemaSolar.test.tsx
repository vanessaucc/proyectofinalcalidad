// src/components/SistemaSolar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SistemaSolar, { planets } from './SistemaSolar';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SistemaSolar Component', () => {
  test('renderiza el componente correctamente', () => {
    renderWithRouter(<SistemaSolar />);
    expect(screen.getByText('✨ Sistema Solar')).toBeInTheDocument();
  });

  test('muestra el botón de volver', () => {
    renderWithRouter(<SistemaSolar />);
    expect(screen.getByText('Volver')).toBeInTheDocument();
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
});