import { Link } from 'react-router-dom';
import { FaSolarPanel, FaGlobeAmericas, FaShapes } from 'react-icons/fa';

export default function Home() {
  const modules = [
    { id: 1, title: 'Sistema Solar', description: 'Explora los planetas que giran alrededor del Sol', icon: FaSolarPanel, path: '/sistema-solar' },
    { id: 2, title: 'Globo Terráqueo', description: 'Descubre países y continentes del mundo', icon: FaGlobeAmericas, path: '/globo-terraqueo' },
    { id: 3, title: 'Simetría', description: 'Aprende sobre figuras simétricas jugando', icon: FaShapes, path: '/simetria' }
  ];

  return (
    <div className="min-h-screen p-8 bg-white/60">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🎓 Interacción a la Creación</h1>
          <p className="text-xl text-gray-600">Colegio Mentes Creativas - 4° y 5° Grado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((module) => {
            const Icon = module.icon as any;
            return (
              <Link key={module.id} to={module.path} className="rounded-3xl shadow-xl p-8 hover:scale-105 transition-transform bg-white">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full p-6 shadow-lg bg-slate-50">
                      <Icon className="text-5xl text-slate-700" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                  <p className="text-base text-gray-600">{module.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12 text-gray-700">
          <p className="text-sm">✨ Aprende explorando, observando y creando ✨</p>
        </div>
      </div>
    </div>
  );
}