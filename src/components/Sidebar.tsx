import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCube,
  FaColumns,
  FaMicrophone,
  FaShapes,
  FaCalculator,
  FaRuler,
  FaKey,
  FaMouse,
  FaList,
  FaClock,
  FaHourglassHalf,
  FaPalette,
  FaSearch,
} from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const mainItems: SidebarItem[] = [
  { label: "Inicio", route: "/", icon: <FaHome /> },
  { label: "Three.js Demo", route: "/three", icon: <FaCube /> },
  { label: "Responsive Layouts", route: "/layouts", icon: <FaColumns /> },
  { label: "Text-to-Speech", route: "/tts", icon: <FaMicrophone /> },
  { label: "Figuras Geométricas", route: "/three_2", icon: <FaShapes /> },
];

const exerciseItems: SidebarItem[] = [
  { label: "Tablas de Multiplicar", route: "/tablasmul", icon: <FaCalculator /> },
  { label: "Conversor de Unidades", route: "/conversorunid", icon: <FaRuler /> },
  { label: "Validador de Contraseñas", route: "/validcontrasena", icon: <FaKey /> },
  { label: "Contador de Clics", route: "/contadorclics", icon: <FaMouse /> },
  { label: "Lista de Tareas", route: "/listareas", icon: <FaList /> },
  { label: "Reloj Digital", route: "/relojdigital", icon: <FaClock /> },
  { label: "Contador Regresivo", route: "/contadorregresivo", icon: <FaHourglassHalf /> },
  { label: "Selector de Colores", route: "/selectorcolores", icon: <FaPalette /> },
  { label: "Buscador en Lista", route: "/buscadorlista", icon: <FaSearch /> },
];

export default function Sidebar() {
  const [openMain, setOpenMain] = useState(true);
  const [openExercises, setOpenExercises] = useState(true);

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        `relative w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
         hover:bg-slate-100 dark:hover:bg-slate-800
         ${isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium" : "text-slate-700 dark:text-slate-300"}`
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[260px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-4 space-y-2">
        {/* Menú Principal */}
        <button
          onClick={() => setOpenMain(!openMain)}
          className="w-full flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          Menú Principal
          <span>{openMain ? "▲" : "▼"}</span>
        </button>
        {openMain && <div className="pl-3 space-y-1">{mainItems.map(renderNavItem)}</div>}

        {/* Ejercicios */}
        <button
          onClick={() => setOpenExercises(!openExercises)}
          className="w-full flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          Ejercicios
          <span>{openExercises ? "▲" : "▼"}</span>
        </button>
        {openExercises && <div className="pl-3 space-y-1">{exerciseItems.map(renderNavItem)}</div>}
      </div>
    </aside>
  );
}
