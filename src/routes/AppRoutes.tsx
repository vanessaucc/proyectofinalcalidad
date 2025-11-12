// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import SistemaSolar from '../components/SistemaSolar';
import GloboTerraqueo from '../components/GloboTerraqueo';
import Simetria from '../components/Simetria';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sistema-solar" element={<SistemaSolar />} />
      <Route path="/globo-terraqueo" element={<GloboTerraqueo />} />
      <Route path="/simetria" element={<Simetria />} />
    </Routes>
  );
}