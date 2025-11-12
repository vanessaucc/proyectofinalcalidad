// Views/SistemaSolarView.tsx
import SistemaSolar from '../components/SistemaSolar';

export default function SistemaSolarView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black overflow-hidden relative">
      {/* Fondo de estrellas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Componente Sistema Solar - ya incluye su propio header */}
      <div className="relative z-10">
        <SistemaSolar />
      </div>
    </div>
  );
}