# Copilot Instructions - Bankroll ARG

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a 2D Monopoly-style board game with Argentine theme called "Bankroll ARG". The game features:

- 28 board spaces representing current Argentine locations, companies, and situations
- Argentine peso currency system
- Modern Argentine economic and cultural references (excluding entertainment/celebrity themes)
- Canvas-based 2D graphics
- Turn-based gameplay mechanics

## Technical Stack

- **Frontend**: Vanilla JavaScript with HTML5 Canvas
- **Build Tool**: Vite
- **Styling**: CSS3
- **Game Logic**: Object-oriented JavaScript

## Code Style Guidelines

- Use ES6+ features and modern JavaScript
- Implement game states and components as classes
- Use descriptive Spanish variable names for game elements (jugador, tablero, propiedades)
- Keep English for technical terms (canvas, context, gameLoop)
- Comment in Spanish for game logic, English for technical implementation

## Game Structure

- `src/game/` - Core game logic
- `src/board/` - Board and space definitions
- `src/player/` - Player management
- `src/ui/` - User interface components
- `src/assets/` - Images and sounds
- `src/utils/` - Utility functions

## Argentine Theme Guidelines

- Use current Argentine companies, places, and economic situations
- Include references to modern Argentine culture and geography
- Avoid celebrity/entertainment references
- Use Argentine Spanish terminology
- Include economic events like inflation, devaluation, etc.

## Game Flow (Flujo de Juego)

### Inicio del Juego

- Todos los jugadores se colocan en la posición inicial (casilla "LARGADA")
- El juego comienza con el Jugador 1
- Cada jugador inicia con $1.500.000 pesos argentinos

### Mecánica de Turnos

1. **Tirar Dados**: La aplicación pide al jugador actual que tire los dados (1-6 cada uno)
2. **Movimiento**: Se mueve el cursor/token del jugador según la suma de los dados
3. **Llegada a Casilla**: Dependiendo del tipo de casilla:
   - **Propiedad Libre**: Si tiene dinero suficiente y nadie la ha comprado, se le pregunta si desea adquirirla
     - Si dice "Sí": Se descuenta el dinero y adquiere la propiedad
     - Si dice "No": Pasa el turno al siguiente jugador
   - **Propiedad Ocupada**: Se descuenta automáticamente el dinero del alquiler y se suma al propietario
   - **Casillas Especiales**: Aplicar efectos según el tipo (impuestos, cartas, cárcel, etc.)

### Condiciones de Victoria/Derrota

- **Victoria**: Conseguir $7.500.000 o más
- **Bancarrota**: Tener -$1.000.000 o menos
- **Eliminación**: Los jugadores en bancarrota no pueden jugar más turnos
- **Final del Juego**: Continúa hasta que quede solo un jugador activo o alguien alcance la meta de victoria

### Flujo de Iteración

- El juego debe iterar este proceso turno por turno
- Verificar condiciones de fin de juego después de cada turno
- Mantener el orden de turnos entre jugadores activos (no eliminados)
- El último jugador en pie es el ganador

### Reglas Especiales

- Cobrar $200.000 cada vez que se pasa por "LARGADA"
- Sistema de cárcel con opciones de salida
- Cartas de eventos que pueden cambiar la situación del jugador
- Cálculo automático de alquileres según propiedades poseídas
