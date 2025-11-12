// src/components/GloboTerraqueo.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

export interface Country {
  id: number;
  name: string;
  capital: string;
  continent: string;
  flag: string;
  population: string;
  color: string;
}

export const countries: Country[] = [
  { id: 1, name: 'México', capital: 'Ciudad de México', continent: 'América del Norte', flag: '🇲🇽', population: '128 millones', color: '#FF6B9D' },
  { id: 2, name: 'Estados Unidos', capital: 'Washington D.C.', continent: 'América del Norte', flag: '🇺🇸', population: '331 millones', color: '#4A90E2' },
  { id: 3, name: 'Colombia', capital: 'Bogotá', continent: 'América del Sur', flag: '🇨🇴', population: '51 millones', color: '#FFD700' },
  { id: 4, name: 'Brasil', capital: 'Brasília', continent: 'América del Sur', flag: '🇧🇷', population: '215 millones', color: '#00FF00' },
  { id: 5, name: 'Francia', capital: 'París', continent: 'Europa', flag: '🇫🇷', population: '67 millones', color: '#4169E1' },
  { id: 6, name: 'Italia', capital: 'Roma', continent: 'Europa', flag: '🇮🇹', population: '60 millones', color: '#E91E63' },
  { id: 7, name: 'Egipto', capital: 'El Cairo', continent: 'África', flag: '🇪🇬', population: '104 millones', color: '#FFA500' },
  { id: 8, name: 'Kenia', capital: 'Nairobi', continent: 'África', flag: '🇰🇪', population: '54 millones', color: '#8BC34A' },
  { id: 9, name: 'China', capital: 'Pekín', continent: 'Asia', flag: '🇨🇳', population: '1,400 millones', color: '#F44336' },
  { id: 10, name: 'Japón', capital: 'Tokio', continent: 'Asia', flag: '🇯🇵', population: '125 millones', color: '#FF1493' },
  { id: 11, name: 'Australia', capital: 'Canberra', continent: 'Oceanía', flag: '🇦🇺', population: '26 millones', color: '#FF69B4' },
  { id: 12, name: 'Nueva Zelanda', capital: 'Wellington', continent: 'Oceanía', flag: '🇳🇿', population: '5 millones', color: '#00BCD4' }
];

interface Continent {
  name: string;
  color: string;
  icon: string;
  countries: Country[];
}

const continentData: Continent[] = [
  { name: 'América del Norte', color: '#3a9d5d', icon: '🏔', countries: countries.filter(c => c.continent === 'América del Norte') },
  { name: 'América del Sur', color: '#2d7a3e', icon: '🌴', countries: countries.filter(c => c.continent === 'América del Sur') },
  { name: 'Europa', color: '#52a86f', icon: '🏰', countries: countries.filter(c => c.continent === 'Europa') },
  { name: 'África', color: '#b8905a', icon: '🦁', countries: countries.filter(c => c.continent === 'África') },
  { name: 'Asia', color: '#4d9463', icon: '🏯', countries: countries.filter(c => c.continent === 'Asia') },
  { name: 'Oceanía', color: '#67b584', icon: '🏝', countries: countries.filter(c => c.continent === 'Oceanía') }
];

function GloboTerraqueo() {
  const navigate = useNavigate();
  const [selectedContinent, setSelectedContinent] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [visitedCountries, setVisitedCountries] = useState<Set<number>>(new Set());
  const [points, setPoints] = useState(0);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec3 oceanBlue = vec3(0.05, 0.35, 0.75);
          vec3 deepOcean = vec3(0.0, 0.15, 0.45);
          vec3 landGreen = vec3(0.2, 0.7, 0.25);
          vec3 forestGreen = vec3(0.1, 0.5, 0.15);
          vec3 desertBrown = vec3(0.76, 0.7, 0.5);
          
          float pattern = sin(vUv.x * 15.0 + time * 0.3) * cos(vUv.y * 10.0 - time * 0.2);
          float detail = sin(vUv.x * 30.0) * sin(vUv.y * 20.0) * 0.3;
          pattern = pattern + detail;
          pattern = smoothstep(-0.4, 0.4, pattern);
          
          float latitude = abs(vUv.y - 0.5);
          vec3 terrain = mix(landGreen, forestGreen, sin(vUv.x * 25.0) * 0.5 + 0.5);
          terrain = mix(terrain, desertBrown, smoothstep(0.3, 0.45, latitude));
          
          vec3 ocean = mix(deepOcean, oceanBlue, sin(vUv.x * 20.0 + time) * 0.3 + 0.7);
          vec3 baseColor = mix(ocean, terrain, pattern);
          
          vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
          float diff = max(dot(vNormal, lightDir), 0.0);
          float spec = pow(max(dot(reflect(-lightDir, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
          
          vec3 finalColor = baseColor * (0.4 + diff * 0.8) + vec3(1.0) * spec * 0.3 * (1.0 - pattern);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const atmoGeom = new THREE.SphereGeometry(1.12, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        void main() {
          vec3 glowColor = vec3(0.4, 0.7, 1.0);
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          intensity *= (1.0 + sin(time * 2.0) * 0.15);
          gl_FragColor = vec4(glowColor, intensity * 0.7);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmo = new THREE.Mesh(atmoGeom, atmoMat);
    scene.add(atmo);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(5, 3, 5);
    scene.add(light);

    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.01;
      globe.rotation.y += 0.003;
      atmo.rotation.y += 0.0025;
      material.uniforms.time.value = time;
      atmoMat.uniforms.time.value = time;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      atmoGeom.dispose();
      atmoMat.dispose();
      renderer.dispose();
    };
  }, []);

  const createStars = (x: number, y: number) => {
    const newStars = [];
    for (let i = 0; i < 15; i++) {
      newStars.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 200,
        y: y + (Math.random() - 0.5) * 200,
        size: Math.random() * 30 + 20
      });
    }
    setStars(newStars);
    setTimeout(() => setStars([]), 2000);
  };

  const filterCountries = (continent: string) => {
    setSelectedContinent(continent);
    const continentObj = continentData.find(c => c.name === continent);
    setFilteredCountries(continentObj ? continentObj.countries : []);
    setSelectedCountry(null);
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    if (!visitedCountries.has(country.id)) {
      setVisitedCountries(new Set(visitedCountries).add(country.id));
      setPoints(prev => prev + 10);
      createStars(window.innerWidth / 2, window.innerHeight / 2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4 md:p-8 relative overflow-hidden">
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-icon {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
      `}</style>

      {/* Estrellas animadas */}
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute pointer-events-none animate-ping"
          style={{ left: s.x, top: s.y, fontSize: s.size }}
        >
          ⭐
        </div>
      ))}

      {/* Panel de puntos */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl px-6 md:px-8 py-3 md:py-4 shadow-2xl border-4 border-white">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-3xl md:text-5xl">🌟</span>
            <div>
              <p className="text-white text-xs md:text-sm font-bold">PUNTOS</p>
              <p className="text-white text-2xl md:text-4xl font-black">{points}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl px-4 md:px-6 py-2 md:py-3 shadow-xl border-4 border-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🗺</span>
            <div>
              <p className="text-white text-xs font-bold">VISITADOS</p>
              <p className="text-white text-xl md:text-2xl font-black">
                {visitedCountries.size}/{countries.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-gray-900 font-bold py-2 md:py-3 px-4 md:px-6 rounded-full shadow-lg border-2 border-yellow-200 hover:from-yellow-400 hover:to-yellow-600 hover:scale-110 transition-all duration-300"
        >
          <span className="text-xl md:text-2xl">←</span>
          <span className="text-sm md:text-base">Volver al Inicio</span>
        </button>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 md:mb-8">
        🌍 Aventura por el Mundo 🌍
      </h1>

      {/* Globo 3D */}
      <div className="max-w-5xl mx-auto mb-6 md:mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-8 shadow-2xl border-2 border-white/20">
          <div
            ref={mountRef}
            className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl"
          />
          <p className="text-white text-center mt-4 text-sm md:text-lg font-semibold">
            🌍 Explora el globo terráqueo interactivo 🌎
          </p>
        </div>
      </div>

      {/* Selector de Continentes */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {continentData.map((cont, index) => (
            <button
              key={cont.name}
              data-testid={`continent-${cont.name}`}
              onClick={() => filterCountries(cont.name)}
              className="text-center p-4 md:p-6 rounded-3xl shadow-2xl hover:scale-110 transition-all border-4 border-white relative"
              style={{
                background: `linear-gradient(135deg, ${cont.color}, ${cont.color}99)`,
                animation: `bounce-slow 3s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="text-4xl md:text-6xl mb-2 md:mb-3" style={{ animation: 'bounce-icon 2s ease-in-out infinite' }}>
                {cont.icon}
              </div>
              <p className="text-lg md:text-2xl font-black text-white mb-1 md:mb-2">{cont.name}</p>
              <p className="text-sm md:text-lg text-white font-bold">{cont.countries.length} países</p>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Países */}
      {filteredCountries.length > 0 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-3xl shadow-2xl max-w-4xl w-full p-6 md:p-8 border-4 border-white max-h-[90vh] overflow-y-auto"
            style={{
              background: `linear-gradient(135deg, ${continentData.find(c => c.name === selectedContinent)?.color}, ${continentData.find(c => c.name === selectedContinent)?.color}99)`
            }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 text-center">
              Bienvenido a {selectedContinent}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-6 md:mb-8">
              {filteredCountries.map((country) => (
                <button
                  key={country.id}
                  data-testid={`country-${country.name}`}
                  onClick={() => selectCountry(country)}
                  className="bg-white p-4 md:p-6 rounded-3xl hover:scale-110 transition-all shadow-2xl relative"
                >
                  {visitedCountries.has(country.id) && (
                    <div className="absolute -top-2 -right-2 text-2xl md:text-4xl">✅</div>
                  )}
                  <div className="text-5xl md:text-7xl mb-2 md:mb-3">{country.flag}</div>
                  <p className="text-lg md:text-2xl font-black text-gray-800">{country.name}</p>
                  <p className="text-xs md:text-base text-gray-600">📍 {country.capital}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedContinent('');
                setFilteredCountries([]);
              }}
              className="bg-gray-800 text-white font-bold text-lg md:text-xl py-3 md:py-4 px-8 md:px-10 rounded-full w-full hover:bg-gray-700 transition-all"
            >
              🔄 Volver
            </button>
          </div>
        </div>
      )}

      {/* Información del País Seleccionado */}
      {selectedCountry && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div
            data-testid="country-info"
            className="rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border-4 border-white max-h-[90vh] overflow-y-auto"
            style={{ background: selectedCountry.color }}
          >
            <div className="text-center">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4">{selectedCountry.flag}</div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 md:mb-6">
                {selectedCountry.name}
              </h2>
              <div className="bg-white rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                <p className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                  Capital: {selectedCountry.capital}
                </p>
                <p className="text-base md:text-lg text-gray-700 mb-2 md:mb-3">
                  Continente: {selectedCountry.continent}
                </p>
                <p className="text-base md:text-lg text-gray-700">
                  Población: {selectedCountry.population}
                </p>
              </div>
              <button
                onClick={() => setSelectedCountry(null)}
                className="bg-purple-500 text-white font-bold text-base md:text-lg py-2 md:py-3 px-6 md:px-8 rounded-full w-full mb-2 hover:bg-purple-600 transition-all"
              >
                🔙 Volver al Continente
              </button>
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setSelectedContinent('');
                  setFilteredCountries([]);
                }}
                className="bg-yellow-500 text-gray-800 font-bold text-sm md:text-base py-2 px-4 md:px-6 rounded-full w-full hover:bg-yellow-600 transition-all"
              >
                ← Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje inicial */}
      {!selectedContinent && (
        <div className="text-center text-white mt-8">
          <p className="text-lg md:text-xl font-semibold bg-white/10 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto">
            👆 Selecciona un continente para explorar sus países
          </p>
        </div>
      )}
    </div>
  );
}

// ⭐ ESTO ES LO QUE FALTABA ⭐
export default GloboTerraqueo;