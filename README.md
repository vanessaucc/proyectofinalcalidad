# 🎓 Interacción a la Creación - Colegio Mentes Creativas

## 📋 Descripción del Proyecto

Aplicación educativa interactiva desarrollada con **React + Vite + TypeScript** para estudiantes de 4° y 5° grado, enfocada en tres áreas temáticas:

1. **🌌 Sistema Solar Interactivo** (Ciencias Naturales)
2. **🌍 Globo Terráqueo Interactivo** (Ciencias Sociales)
3. **🎨 Simetría en Objetos** (Matemáticas)

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── SistemaSolar.tsx
│   ├── GloboTerraqueo.tsx
│   ├── Simetria.tsx
│   └── __tests__/
│       ├── SistemaSolar.test.tsx
│       ├── GloboTerraqueo.test.tsx
│       └── Simetria.test.tsx
├── views/
│   ├── Home.tsx
│   └── __tests__/
│       └── Home.test.tsx
├── routes/
│   └── AppRoutes.tsx
├── App.tsx
└── main.tsx
```

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/guswill24/integracion_continua.git
cd integracion_continua
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Copiar los archivos proporcionados

#### Configuración:
- `tailwind.config.ts` → Raíz del proyecto

#### Vistas:
- `Home.tsx` → `src/views/`

#### Componentes:
- `SistemaSolar.tsx` → `src/components/`
- `GloboTerraqueo.tsx` → `src/components/`
- `Simetria.tsx` → `src/components/`

#### Rutas:
- `AppRoutes.tsx` → `src/routes/`

#### Pruebas:
- `Home.test.tsx` → `src/views/__tests__/`
- `SistemaSolar.test.tsx` → `src/components/__tests__/`
- `GloboTerraqueo.test.tsx` → `src/components/__tests__/`
- `Simetria.test.tsx` → `src/components/__tests__/`

---

## 🎨 Paleta de Colores Pasteles

Los colores están configurados en `tailwind.config.ts`:

| Color | Clase | Valor Hex |
|-------|-------|-----------|
| Azul pastel | `bg-pastel-blue` | #A8D8EA |
| Rosa pastel | `bg-pastel-pink` | #FFB6D9 |
| Amarillo pastel | `bg-pastel-yellow` | #FFF5BA |
| Verde pastel | `bg-pastel-green` | #B5EAD7 |
| Morado pastel | `bg-pastel-purple` | #C7CEEA |
| Naranja pastel | `bg-pastel-orange` | #FFDAB9 |

---

## 🧪 Ejecutar Pruebas Unitarias

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar en modo watch
npm test -- --watch

# Ver cobertura
npm test -- --coverage
```

### Cobertura esperada: ≥ 80%

---

## 🛠️ Scripts Disponibles

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview

# Linter
npm run lint

# Type checking
npm run type-check

# Formatear código
npm run format
```

---

## 📊 Requisitos Funcionales Implementados

### RF-NAT-001: Sistema Solar Interactivo
✅ Visualización de 8 planetas orbitando el Sol  
✅ Interacción por clic en cada planeta  
✅ Modal informativo con datos (distancia, órbita, temperatura)  
✅ Animaciones suaves y colores diferenciados  

### RF-SOC-002: Globo Terráqueo Interactivo
✅ Visualización de 8 países de diferentes continentes  
✅ Banderas emoji representativas  
✅ Información completa (capital, población, idioma, dato curioso)  
✅ Diseño colorido y atractivo para niños  

### RF-MAT-003: Simetría en Objetos
✅ Canvas interactivo para dibujar  
✅ 3 figuras seleccionables (Mariposa, Estrella, Corazón)  
✅ Reflejo automático en tiempo real  
✅ Ejemplos de simetría en la naturaleza  

---

## 🎯 Atributos de Calidad (ISO/IEC 25010)

### Característica: **Usabilidad**

#### Subatributo 1: Estética de la Interfaz de Usuario
- ✅ Colores pasteles adaptados para niños
- ✅ Tipografía legible y redondeada
- ✅ Íconos grandes y espaciados
- ✅ Animaciones suaves (`animate-float`, `animate-spin-slow`)
- ✅ Diseño coherente entre módulos

#### Subatributo 2: Aprendibilidad
- ✅ Navegación simple (máximo 3 clics)
- ✅ Instrucciones visuales claras
- ✅ Estructura jerárquica intuitiva
- ✅ Elementos representativos y reconocibles
- ✅ Diseño autoexplicativo

---

## 🌐 Despliegue en Vercel

### Pasos:
1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repositorio de GitHub
3. Configurar proyecto:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy automático

---

## ✅ Checklist de Aceptación

| ID | Criterio | Estado |
|----|----------|--------|
| 1 | Sitio desplegado en Vercel sin errores | ✅ |
| 2 | Carga en menos de 3 segundos | ✅ |
| 3 | Navegación fluida | ✅ |
| 4 | Sin errores en consola | ✅ |
| 5 | Pruebas unitarias pasan en CI/CD | ✅ |

---

## 👥 Integrantes

- Julieth Vanessa Mena Ortega
- Valeria Estefanía Góngora Torres

---

## 📚 Referencias

- [Documentación React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Testing Library](https://testing-library.com/)
- [ISO/IEC 25010](https://iso25000.com/index.php/normas-iso-25000/iso-25010)
- [Material del curso](https://asigcalidadsoftware.vercel.app/)

---

## 📞 Contacto

**Profesor:** Mg. Gustavo Sánchez Rodríguez  
**Universidad:** Cooperativa de Colombia  
**Campus:** Pasto  
**Fecha:** Noviembre 2025