# 🎵 Sistema de Sonidos - Bankroll ARG

## Funcionalidades Implementadas

### 🔊 **Efectos de Sonido de Caja Registradora**

El juego ahora incluye efectos de sonido realistas de caja registradora que se reproducen automáticamente en todas las transacciones monetarias:

#### **Cuándo se Reproduce:**

- ✅ **Compra de Propiedades**: Al comprar terrenos, ferrocarriles o servicios públicos
- 💸 **Pago de Alquileres**: Cuando pagas alquiler a otros jugadores
- 🏠 **Pago por Ferrocarriles**: Al usar estaciones de tren de otros jugadores
- ⚡ **Pago por Servicios**: Al usar compañías de servicios públicos de otros jugadores
- 📋 **Pago de Impuestos**: Al caer en casillas de impuestos
- 💰 **Cobro de Salario**: Al pasar por LARGADA y cobrar $200.000
- 🎴 **Cartas Especiales**: Al recibir o pagar dinero por cartas de Comunidad/Suerte

### 🎛️ **Control de Sonido**

#### **Botón de Toggle**

- **Ubicación**: Esquina superior derecha del header
- **Estados**:
  - 🔊 **Activado** (azul): Los sonidos están habilitados
  - 🔇 **Desactivado** (gris): Los sonidos están silenciados
- **Feedback**: Al activar sonidos, reproduce un sonido de confirmación

### ⚙️ **Características Técnicas**

#### **Web Audio API**

- Utiliza **Web Audio API** para generar sonidos sintéticos de alta calidad
- **No requiere archivos de audio externos**
- Sonido de caja registradora con múltiples tonos: "Cha-ching" + campana final
- Fallback a sonido simple para mayor compatibilidad

#### **Controles de Sonido**

- **Volumen**: Configurado al 70% por defecto
- **Habilitación**: Los usuarios pueden activar/desactivar fácilmente
- **Persistencia**: El estado se mantiene durante la sesión de juego

### 🎚️ **Configuración**

Los sonidos pueden ser controlados programáticamente:

```javascript
// Acceder al administrador de sonidos
const soundManager = game.soundManager;

// Habilitar/deshabilitar sonidos
soundManager.setEnabled(true / false);

// Configurar volumen (0.0 a 1.0)
soundManager.setVolume(0.7);

// Reproducir sonidos específicos
soundManager.playPurchase(); // Para compras/cobros
soundManager.playPayment(); // Para pagos
soundManager.playCoin(); // Sonido alternativo
```

### 🔧 **Implementación**

#### **Archivos Modificados:**

- `src/utils/SoundManager.js` - ✨ **NUEVO**: Clase principal de administración de sonidos
- `src/game/Game.js` - 🔄 **MODIFICADO**: Integración de sonidos en transacciones
- `src/ui/GameUI.js` - 🔄 **MODIFICADO**: Control de UI para sonidos
- `index.html` - 🔄 **MODIFICADO**: Botón de toggle de sonidos
- `src/style.css` - 🔄 **MODIFICADO**: Estilos para botón de sonido

#### **Sonidos Integrados en:**

- Compra de propiedades (`buyProperty()`)
- Pago de alquileres (propiedades, ferrocarriles, servicios)
- Pago de impuestos (`handleTaxLanding()`)
- Cartas especiales (`processCard()`)
- Cobro de salario por LARGADA

### 🎮 **Experiencia de Usuario**

Los sonidos mejoran significativamente la experiencia de juego:

- **Feedback inmediato** para todas las transacciones
- **Inmersión** similar al Monopoly físico
- **Claridad** auditiva de las acciones monetarias
- **Control total** sobre la experiencia sonora

---

**¡Disfruta de la nueva experiencia auditiva en Bankroll ARG! 🎉**
