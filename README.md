# 🛒 SmartCart: Ideas de Recetas para Mamá

SmartCart es una aplicación de planificación de comidas diseñada para simplificar la organización semanal. Permite gestionar un catálogo de recetas, planificarlas en un calendario interactivo y generar automáticamente listas de la compra.

## ✨ Características actuales

- **📅 Planificador Semanal**: Calendario interactivo (7 días x 3 comidas) con soporte para Drag & Drop.
- **✨ Auto-planificación**: Algoritmo inteligente que genera un menú semanal variado a partir de más de 190 recetas pre-cargadas.
- **📖 Catálogo de Recetas**: Base de datos de casi 200 recetas españolas e internacionales con ingredientes y tiempos de preparación.
- **🛒 Lista de la Compra**: Generación automática de listas agregando cantidades y agrupando por categorías.
- **📱 Responsive Design**: Interfaz optimizada para móviles (UX premium en modo oscuro).
- **🛠️ Stack Tecnológico**: React (Vite), Node.js (Express), Prisma y SQLite.

## 🚀 Próximamente: Versión Serverless

Estamos trabajando en una versión 100% Frontend que funcionará directamente en el navegador (LocalStorage), eliminando la necesidad de un backend y permitiendo el despliegue instantáneo en plataformas como Netlify.

## 🛠️ Instalación Local

### Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---
*Desarrollado con ❤️ para organizar la cocina familiar.*
