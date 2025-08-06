import './style.css';
import { Game } from './game/Game.js';
import { GameUI } from './ui/GameUI.js';

// Inicializar el juego cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  
  if (!canvas) {
    console.error('No se encontró el canvas del juego');
    return;
  }
  
  // Crear la instancia del juego
  const game = new Game(canvas);
  
  // Crear la interfaz de usuario
  const gameUI = new GameUI(game);
  
  // Loop de renderizado del juego
  function gameLoop() {
    game.draw();
    requestAnimationFrame(gameLoop);
  }
  
  // Iniciar el loop de renderizado
  gameLoop();
  
  // Hacer el canvas responsive
  function resizeCanvas() {
    const container = canvas.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Mantener proporción cuadrada con más margen para el tablero
    const maxSize = Math.min(containerRect.width - 40, containerRect.height - 40, 650);
    canvas.width = maxSize;
    canvas.height = maxSize;
    
    // Recrear el tablero con las nuevas dimensiones
    import('./board/Board.js').then(module => {
      game.board = new module.Board(canvas, canvas.getContext('2d'));
      
      // Reposicionar jugadores
      game.players.forEach(player => {
        player.updateVisualPosition(game.board);
      });
    });
  }
  
  // Ajustar canvas al cargar y al redimensionar
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Agregar controles de teclado
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case ' ': // Barra espaciadora para tirar dados
        event.preventDefault();
        if (game.canRollDice) {
          const dice = game.rollDice();
          gameUI.updateDiceDisplay(dice[0], dice[1]);
        }
        break;
      case 'b': // B para comprar propiedad
      case 'B':
        if (game.canBuyProperty) {
          game.buyProperty();
        }
        break;
      case 'Enter': // Enter para terminar turno
        if (game.canEndTurn) {
          game.endTurn();
        }
        break;
      case 'n': // N para nuevo juego
      case 'N':
        if (event.ctrlKey) {
          event.preventDefault();
          game.newGame();
        }
        break;
    }
  });
  
  // Mostrar controles en consola
  console.log('🎮 Controles del juego:');
  console.log('Barra espaciadora: Tirar dados');
  console.log('B: Comprar propiedad');
  console.log('Enter: Terminar turno');
  console.log('Ctrl+N: Nueva partida');
  
  // Agregar información del juego a la ventana global para debug
  if (typeof window !== 'undefined') {
    window.bankrollGame = game;
    window.bankrollUI = gameUI;
  }
});
