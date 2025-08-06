# 🇦🇷 Bankroll ARG - Monopoly Argentino

Un juego de mesa digital estilo Monopoly con temática argentina actual. Recorre los lugares más emblemáticos de Argentina, compra propiedades, y conviértete en el magnate más exitoso del país.

## 🎮 Características del Juego

- **28 casilleros** con lugares reales de Argentina
- **Temática 100% argentina** con empresas y lugares actuales
- **Moneda en pesos argentinos** con valores realistas
- **Cartas de eventos** con situaciones económicas argentinas
- **Gráficos 2D** renderizados en Canvas HTML5
- **Interfaz responsiva** que se adapta a cualquier pantalla

## 🗺️ Lugares del Tablero

### Propiedades por Región:

- **Barrios de Buenos Aires**: Palermo, Villa Crespo, Puerto Madero, Recoleta, Belgrano, Núñez
- **Ciudades Principales**: Córdoba, Rosario, Mendoza, Bariloche, Salta
- **Destinos Turísticos**: Mar del Plata, Villa Carlos Paz, Ushuaia

### Transportes:

- Aeropuerto Ezeiza
- Terminal Retiro
- Subte Línea D
- Tren a Tigre

### Servicios:

- YPF (Petrolera)
- Edesur (Electricidad)

## 🎯 Cómo Jugar

### Controles:

- **Barra espaciadora**: Tirar dados
- **B**: Comprar propiedad
- **Enter**: Terminar turno
- **Ctrl+N**: Nueva partida

### Botones de la Interfaz:

- **Tirar Dados**: Lanza los dados para moverte
- **Comprar Propiedad**: Adquiere la propiedad donde caíste
- **Terminar Turno**: Pasa el turno al siguiente jugador

### Reglas Básicas:

1. Cada jugador comienza con $1.500.000
2. Cobra $200.000 cada vez que pasa por LARGADA
3. Compra propiedades para cobrar alquiler a otros jugadores
4. Las cartas de eventos pueden cambiar tu suerte
5. Evita ir a la cárcel y gestiona bien tu dinero

## 🃏 Cartas de Eventos

### Caja Comunitaria:

- Bonos fiscales y ayudas del gobierno
- Multas y contribuciones
- Programas sociales (Procrear, Tarjeta Alimentar)

### Destino:

- Crisis económicas y devaluaciones
- Boom de commodities (soja, litio, Vaca Muerta)
- Eventos deportivos y culturales
- Situaciones políticas y económicas

## 🛠️ Tecnologías Utilizadas

- **JavaScript ES6+**: Lógica del juego
- **HTML5 Canvas**: Renderizado gráfico
- **CSS3**: Estilos e interfaz
- **Vite**: Herramienta de desarrollo

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── board/          # Definición del tablero y cartas
│   ├── Board.js    # Clase principal del tablero
│   ├── spaces.js   # Definición de casilleros
│   └── cards.js    # Cartas de eventos
├── game/           # Lógica principal del juego
│   └── Game.js     # Motor del juego
├── player/         # Gestión de jugadores
│   └── Player.js   # Clase de jugador
├── ui/             # Interfaz de usuario
│   └── GameUI.js   # Manejo de la UI
└── main.js         # Punto de entrada
```

## 🎨 Características Visuales

- **Colores patrios**: Celeste, blanco y dorado
- **Bandera argentina** en el centro del tablero
- **Tokens de jugadores** con colores distintivos
- **Animaciones suaves** para movimientos
- **Diseño responsivo** para móviles y desktop

## 🇦🇷 Temática Argentina

El juego incorpora elementos distintivos de la Argentina actual:

- **Lugares reales** y reconocibles
- **Empresas argentinas** (YPF, Mercado Libre)
- **Situaciones económicas** actuales (inflación, cepo cambiario)
- **Referencias culturales** (fútbol, turismo)
- **Jerga y expresiones** típicamente argentinas

## 🔄 Próximas Funcionalidades

- [ ] Sistema de casas y hoteles
- [ ] Modo multijugador online
- [ ] Personalización de jugadores
- [ ] Efectos de sonido
- [ ] Animaciones mejoradas
- [ ] Sistema de logros
- [ ] Diferentes niveles de dificultad

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si querés mejorar el juego:

1. Fork del repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Contacto

¿Tenés ideas para mejorar el juego? ¿Encontraste un bug? ¡Abrí un issue!

---

**¡Que empiece el juego! 🎲🇦🇷**
# Bankroll-ARG
