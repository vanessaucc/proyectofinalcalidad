// Views/GloboTerraqueoView.jsx
import GloboTerraqueo from '../Componentes/GloboTerraqueo';

export default function GloboTerraqueoView() {
  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-3 bg-gradient-to-r from-yellow-300 to-yellow-500 
                     text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg border-2 border-yellow-200"
        >
          <span className="text-2xl">←</span>
          <span>Volver al Inicio</span>
        </button>
      </div>

      <h1 className="text-5xl font-bold text-white text-center mb-8">
        🌍 Aventura por el Mundo 🌍
      </h1>

      <div className="max-w-5xl mx-auto mb-8">
        <GloboTerraqueo onGoBack={handleGoBack} />
      </div>
    </div>
  );
}