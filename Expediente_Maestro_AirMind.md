# Documentación Técnica y Funcional: AirMind - Autonomous Edition

Este documento detalla exhaustivamente la arquitectura, funcionamiento y modelo del proyecto **AirMind**, basándose de forma estricta en el código fuente, la interfaz y las funcionalidades contenidas en el repositorio actual.

---

## 1. Documentación Técnica y del *Know-How* (La Solución)

AirMind es una aplicación web y panel de control (Dashboard) diseñada para gestionar y monitorear un sistema autónomo de agricultura de precisión indoor (hidroponía/aeroponía).

### 1.1 Especificaciones Técnicas y Arquitectura de Software
La aplicación está construida sobre un stack moderno enfocado en la interactividad y el rendimiento:

*   **Stack Tecnológico (Capa Frontend):**
    *   **React 18 & TypeScript:** Estructuración de componentes tipados para garantizar la integridad de los datos de los sensores y cultivos.
    *   **Vite:** Empaquetador para un entorno de desarrollo ultrarrápido y construcción optimizada.
    *   **Tailwind CSS & Lucide React:** Sistema de utilidades CSS para crear una interfaz *Glassmorphism* avanzada (fondos oscuros translúcidos, desenfoques, gradientes) e iconografía vectorizada.

*   **Estructura de Componentes Clave (`App.tsx`):**
    *   **Gemelo Digital 3D:** Una representación visual reactiva de la torre de cultivo. Responde a las variables de tiempo (días de crecimiento) y al estado del sistema (Autónomo vs Pausado), alterando colores y animaciones.
    *   **Motor de Sensores (Simulado):** Un loop de ejecución (`useEffect`) que simula la lectura en tiempo real de pH, Conductividad Eléctrica (EC) y Temperatura, inyectando variaciones aleatorias para imitar el comportamiento del agua.
    *   **Módulo de Signos Vitales:** Tarjetas de métricas (`MetricCard`) que evalúan dinámicamente si los parámetros están dentro de un rango "Óptimo" o requieren "Atención" (ej. alertas si el pH fluctúa ±0.2 del valor ideal).

*   **Lógica Funcional ("Piloto Automático"):**
    *   **Bio-Biblioteca:** Base de datos estática (`CROP_LIBRARY`) que contiene los parámetros ideales de distintas plantas (Lechuga, Albahaca, Petunia, Capuchina, Fresas). Al seleccionar un cultivo, el sistema asume los valores objetivo (Días de ciclo, pH, EC).
    *   **Brotes AI:** Un asistente virtual (chatbot) integrado en la interfaz. Provee respuestas contextuales simuladas sobre el estado de salud de las plantas, consejos de uso y notificaciones del sistema autónomo.

### 1.2 Manuales de Operación de la Interfaz
*   **Selección de Cultivo:** A través de la pestaña "Cultivos" (Bio-Biblioteca), el usuario selecciona la planta deseada. La aplicación reinicia el ciclo a "Día 1" y ajusta los umbrales de alerta de pH y EC en el monitor principal.
*   **Gestión del Sistema:** Uso del botón de "Pausa / Reanudar" para detener las simulaciones visuales (luces y flujo), indicando modos de mantenimiento o limpieza.
*   **Módulo Científico (*Data Logger*):** Función desplegable en el encabezado que permite (a nivel UI) visualizar gráficas y exportar registros históricos de la química del agua.

### 1.3 Diseño Industrial (UI/UX)
*   **Interfaz de Usuario (UI):** Diseño en modo oscuro (`#0B1021`) con elementos "Glassmorphism" (`backdrop-filter: blur`), animaciones de pulso y flotación por CSS (`animate-float`, `animate-pulse-glow`) para transmitir la sensación de un sistema "vivo" y futurista.

---

## 2. Documentación de Validación y Prototipado (Software)

Basado en la estructura del código, el estado actual refleja un **Prototipo Funcional de Alta Fidelidad**:

*   **Ciclo de Funcionalidad (Crear-Medir-Aprender en UI):**
    *   El panel demuestra cómo el usuario interactuará con los datos complejos de la hidroponía de manera simplificada mediante alertas por color (Verde/Amarillo).
    *   La funcionalidad del chat "Brotes AI" valida la hipótesis de que los usuarios sin conocimiento técnico requerirán de un asistente conversacional para comprender el estado de su cultivo.
*   **Métricas Simuladas:** El entorno de desarrollo actual demuestra la capacidad de la aplicación de procesar y renderizar flujos de datos continuos (actualizaciones de sensores cada 2 segundos) sin perder rendimiento en la interfaz.

---

## 3. Escalamiento Operativo (A Nivel de Software)

Pensando en la evolución del código actual de AirMind hacia una aplicación en producción:

*   **De Simulación a IoT Real:** Reemplazar el generador de números aleatorios en `App.tsx` por integraciones de WebSockets o APIs RESTful que consuman los datos directamente de los microcontroladores (ESP32) instalados en torres físicas reales.
*   **Backend y Persistencia:** Integrar una base de datos real (ej. PostgreSQL o Firebase) para el módulo *Data Logger*, almacenando el historial de métricas para aplicar Machine Learning a largo plazo.
*   **Gestión de Usuarios:** Implementar autenticación para que múltiples usuarios puedan gestionar múltiples torres AirMind desde una sola cuenta.

---

## 4. Gestión del Proyecto Técnico

El desarrollo del proyecto está estructurado alrededor de los siguientes hitos a nivel de software:

*   **Hito 1 (Completado):** Construcción del *Dashboard* central, maquetación del Gemelo Digital y simulación de la lógica de sensores.
*   **Hito 2 (En Curso):** Expansión de la "Bio-Biblioteca" y enriquecimiento del modelo de respuestas de "Brotes AI".
*   **Hito 3 (Futuro):** Implementación de la capa de conexión remota (APIs) para comunicarse con el hardware real.

---

## 5. El *Pitch Deck* (Enfoque en el Producto Digital)

Estructura para presentar AirMind basado en la aplicación actual:

1.  **El Problema:** El cultivo automatizado *indoor* produce interfaces llenas de datos complejos ininteligibles para el consumidor promedio.
2.  **La Solución (AirMind):** Un *Dashboard* gamificado y simplificado que traduce la química del agua en estados de "Óptimo/Atención" mediante alertas visuales claras.
3.  **Demo Técnica (La App):**
    *   Mostrar la selección fluida de cultivos (Lechuga vs Fresas).
    *   Demostrar cómo la UI alerta cuando los valores fluctúan simuladamente.
    *   Mostrar la interacción conversacional con el asistente "Brotes AI".
4.  **Diferenciador Visual:** Destacar la interfaz "Glassmorphism", el gemelo digital animado en 3D (CSS puro) y la arquitectura rápida montada en Vite/React.
5.  **Siguientes Pasos:** Conectar esta interfaz validada con los prototipos de hardware (torres y sensores reales).
