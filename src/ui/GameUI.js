export class GameUI {
  constructor(game) {
    this.game = game;
    this.elements = {
      currentPlayer: document.getElementById('current-player'),
      playerMoney: document.getElementById('player-money'),
      playerProperties: document.getElementById('player-properties'),
      allPlayersInfo: document.getElementById('all-players-info'),
      rollDiceBtn: document.getElementById('roll-dice-btn'),
      buyPropertyBtn: document.getElementById('buy-property-btn'),
      endTurnBtn: document.getElementById('end-turn-btn'),
      newGameBtn: document.getElementById('new-game-btn'),
      pauseBtn: document.getElementById('pause-btn'),
      rulesBtn: document.getElementById('rules-btn'),
      dice1: document.getElementById('dice1'),
      dice2: document.getElementById('dice2'),
      logMessages: document.getElementById('log-messages'),
      
      // Modales
      gameSetupModal: document.getElementById('game-setup-modal'),
      gameOverModal: document.getElementById('game-over-modal'),
      gameOverContent: document.getElementById('game-over-content'),
      
      // Botones del modal de setup
      playerCountBtns: document.querySelectorAll('.player-count-btn'),
      startGameBtn: document.getElementById('start-game-btn'),
      cancelSetupBtn: document.getElementById('cancel-setup-btn'),
      
      // Botones del modal de game over
      playAgainBtn: document.getElementById('play-again-btn'),
      closeGameOverBtn: document.getElementById('close-game-over-btn')
    };
    
    this.setupEventListeners();
    this.game.onGameStateChange = this.updateUI.bind(this);
    this.game.onLogMessage = this.addLogMessage.bind(this);
    this.game.onGameSetup = this.showGameSetup.bind(this);
    this.game.onGameOver = this.showGameOver.bind(this);
  }
  
  setupEventListeners() {
    this.elements.rollDiceBtn.addEventListener('click', () => {
      const dice = this.game.rollDice();
      this.updateDiceDisplay(dice[0], dice[1]);
    });
    
    this.elements.buyPropertyBtn.addEventListener('click', () => {
      this.game.buyProperty();
    });
    
    this.elements.endTurnBtn.addEventListener('click', () => {
      this.game.endTurn();
    });
    
    this.elements.newGameBtn.addEventListener('click', () => {
      this.game.newGame();
    });
    
    this.elements.pauseBtn.addEventListener('click', () => {
      // TODO: Implementar pausa
      alert('Función de pausa en desarrollo');
    });
    
    this.elements.rulesBtn.addEventListener('click', () => {
      this.showRules();
    });
    
    // Event listeners para el modal de setup
    this.elements.playerCountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectPlayerCount(btn);
      });
    });
    
    this.elements.startGameBtn.addEventListener('click', () => {
      this.startGame();
    });
    
    this.elements.cancelSetupBtn.addEventListener('click', () => {
      this.hideGameSetup();
    });
    
    // Event listeners para el modal de game over
    this.elements.playAgainBtn.addEventListener('click', () => {
      this.hideGameOver();
      this.game.newGame();
    });
    
    this.elements.closeGameOverBtn.addEventListener('click', () => {
      this.hideGameOver();
    });
    
    // Cerrar modales al hacer clic fuera
    this.elements.gameSetupModal.addEventListener('click', (e) => {
      if (e.target === this.elements.gameSetupModal) {
        this.hideGameSetup();
      }
    });
    
    this.elements.gameOverModal.addEventListener('click', (e) => {
      if (e.target === this.elements.gameOverModal) {
        this.hideGameOver();
      }
    });
  }
  
  updateUI(gameState) {
    const { currentPlayer, canRollDice, canBuyProperty, canEndTurn, players, gamePhase } = gameState;
    
    if (gamePhase === 'SETUP') {
      return; // No actualizar UI durante setup
    }
    
    // Actualizar información del jugador actual
    this.updateCurrentPlayerInfo(currentPlayer);
    
    // Actualizar información de todos los jugadores
    this.updateAllPlayersInfo(players, currentPlayer);
    
    // Actualizar estado de los botones
    this.elements.rollDiceBtn.disabled = !canRollDice;
    this.elements.buyPropertyBtn.disabled = !canBuyProperty;
    this.elements.endTurnBtn.disabled = !canEndTurn;
    
    // Actualizar texto de los botones
    if (currentPlayer && currentPlayer.isInJail) {
      this.elements.rollDiceBtn.textContent = 'Tirar para Salir de Cárcel';
    } else {
      this.elements.rollDiceBtn.textContent = 'Tirar Dados';
    }
    
    if (canBuyProperty && currentPlayer) {
      const space = this.game.board.getSpace(currentPlayer.position);
      this.elements.buyPropertyBtn.textContent = `Comprar ${space.name} ($${space.price.toLocaleString()})`;
    } else {
      this.elements.buyPropertyBtn.textContent = 'Comprar Propiedad';
    }
  }
  
  updateCurrentPlayerInfo(player) {
    if (!player) return;
    
    // Información básica del jugador
    this.elements.currentPlayer.innerHTML = `
      <div class="player-name" style="color: ${player.color}">
        <strong>${player.name}</strong>
        ${player.isInJail ? ' 🔒' : ''}
      </div>
    `;
    
    // Dinero del jugador
    this.elements.playerMoney.innerHTML = `
      <div class="money-display">
        <span class="money">$${player.money.toLocaleString()}</span>
      </div>
      <div class="wealth-display">
        Patrimonio total: <span class="money">$${player.totalWealth.toLocaleString()}</span>
      </div>
    `;
    
    // Propiedades del jugador
    const propertiesCount = player.properties + player.railroads + player.utilities;
    this.elements.playerProperties.innerHTML = `
      <div class="properties-summary">
        <div>Propiedades: ${player.properties}</div>
        <div>Transportes: ${player.railroads}</div>
        <div>Servicios: ${player.utilities}</div>
        <div><strong>Total: ${propertiesCount}</strong></div>
      </div>
    `;
    
    // Estado especial
    if (player.isInJail) {
      this.elements.playerProperties.innerHTML += `
        <div class="jail-status">
          En la cárcel (turno ${player.jailTurns}/3)
        </div>
      `;
    }
  }
  
  updateDiceDisplay(dice1, dice2) {
    this.elements.dice1.textContent = dice1 || '?';
    this.elements.dice2.textContent = dice2 || '?';
    
    // Animación de dados
    if (dice1 && dice2) {
      this.animateDice();
    }
  }
  
  animateDice() {
    const diceElements = [this.elements.dice1, this.elements.dice2];
    
    diceElements.forEach(dice => {
      dice.style.transform = 'rotate(360deg) scale(1.2)';
      dice.style.transition = 'transform 0.5s ease';
      
      setTimeout(() => {
        dice.style.transform = 'rotate(0deg) scale(1)';
      }, 500);
    });
  }
  
  updateAllPlayersInfo(players, currentPlayer) {
    if (!this.elements.allPlayersInfo || !players) return;
    
    this.elements.allPlayersInfo.innerHTML = '';
    
    // Ordenar jugadores por dinero (descendente)
    const sortedPlayers = [...players].sort((a, b) => b.money - a.money);
    
    sortedPlayers.forEach((player, index) => {
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player-summary';
      
      if (currentPlayer && player.name === currentPlayer.name) {
        playerDiv.classList.add('current');
      }
      
      // Determinar el estado del jugador
      let status = '';
      if (player.money >= 7500000) {
        status = '🏆 ¡GANADOR!';
      } else if (player.money <= -1000000) {
        status = '💸 En Bancarrota';
      } else if (player.isInJail) {
        status = '🔒 En la Cárcel';
      }
      
      playerDiv.innerHTML = `
        <div class="player-name" style="color: ${this.getPlayerColor(player.name)}">${player.name} ${status}</div>
        <div class="player-stats">
          <div>💰 $${player.money.toLocaleString()}</div>
          <div>🏢 ${player.properties + player.railroads + player.utilities} propiedades</div>
        </div>
      `;
      
      this.elements.allPlayersInfo.appendChild(playerDiv);
    });
  }
  
  getPlayerColor(playerName) {
    const colors = {
      'Rojo': '#FF0000',
      'Azul': '#0000FF',
      'Verde': '#00FF00',
      'Amarillo': '#FFFF00',
      'Magenta': '#FF00FF'
    };
    return colors[playerName] || '#000000';
  }
  
  showGameSetup() {
    this.elements.gameSetupModal.classList.add('show');
  }
  
  hideGameSetup() {
    this.elements.gameSetupModal.classList.remove('show');
  }
  
  selectPlayerCount(selectedBtn) {
    // Remover selección anterior
    this.elements.playerCountBtns.forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Seleccionar el botón clickeado
    selectedBtn.classList.add('selected');
    
    // Habilitar botón de inicio
    this.elements.startGameBtn.disabled = false;
    
    // Guardar la selección
    const count = parseInt(selectedBtn.dataset.count);
    this.game.setPlayerCount(count);
  }
  
  startGame() {
    this.hideGameSetup();
    this.clearLog();
    this.game.initializeGame();
  }
  
  showGameOver(player, type) {
    let content = '';
    
    if (type === 'WIN') {
      content = `
        <h2>🎉 ¡VICTORIA!</h2>
        <div class="winner">
          <h3>${player.name} ha ganado la partida!</h3>
          <p>💰 Dinero final: $${player.money.toLocaleString()}</p>
          <p>🏆 ¡Felicitaciones! Has conquistado Argentina económicamente!</p>
        </div>
        <div class="game-stats">
          <h4>Estadísticas Finales:</h4>
          <ul>
            <li>🏢 Propiedades: ${player.properties.length || 0}</li>
            <li>🚂 Transportes: ${player.railroads.length || 0}</li>
            <li>⚡ Servicios: ${player.utilities.length || 0}</li>
            <li>💎 Patrimonio: $${(player.getTotalWealth ? player.getTotalWealth() : player.money).toLocaleString()}</li>
          </ul>
        </div>
      `;
    } else if (type === 'BANKRUPTCY') {
      content = `
        <h2>💸 BANCARROTA</h2>
        <div class="bankrupt">
          <h3>${player.name} ha quedado en bancarrota!</h3>
          <p>💀 Dinero final: $${player.money.toLocaleString()}</p>
          <p>📉 La crisis económica argentina te ha derrotado...</p>
        </div>
        <div class="bankruptcy-message">
          <p>🎯 <strong>Consejo:</strong> En el próximo juego, maneja mejor tu dinero y diversifica tus inversiones.</p>
        </div>
      `;
    }
    
    this.elements.gameOverContent.innerHTML = content;
    this.elements.gameOverModal.classList.add('show');
  }
  
  hideGameOver() {
    this.elements.gameOverModal.classList.remove('show');
  }
  
  showRules() {
    const rulesContent = `
      <div class="modal-content">
        <h2>📋 Reglas del Juego</h2>
        <div class="rules-section">
          <h3>🎯 Objetivo del Juego</h3>
          <ul>
            <li>🏆 <strong>Ganar:</strong> Conseguir $7.500.000</li>
            <li>💸 <strong>Perder:</strong> Llegar a -$1.000.000 (bancarrota)</li>
          </ul>
        </div>
        
        <div class="rules-section">
          <h3>🎮 Cómo Jugar</h3>
          <ol>
            <li>Cada jugador comienza con $1.500.000</li>
            <li>Tira los dados para moverte por el tablero</li>
            <li>Compra propiedades cuando caigas en ellas</li>
            <li>Cobra alquiler cuando otros jugadores caigan en tus propiedades</li>
            <li>Cobra $200.000 cada vez que pases por LARGADA</li>
          </ol>
        </div>
        
        <div class="rules-section">
          <h3>🃏 Cartas de Eventos</h3>
          <ul>
            <li><strong>Caja Comunitaria:</strong> Eventos gubernamentales y sociales</li>
            <li><strong>Destino:</strong> Situaciones económicas y políticas</li>
          </ul>
        </div>
        
        <div class="rules-section">
          <h3>⌨️ Controles</h3>
          <ul>
            <li><strong>Barra espaciadora:</strong> Tirar dados</li>
            <li><strong>B:</strong> Comprar propiedad</li>
            <li><strong>Enter:</strong> Terminar turno</li>
            <li><strong>Ctrl+N:</strong> Nueva partida</li>
          </ul>
        </div>
        
        <div class="modal-actions">
          <button onclick="this.closest('.modal').classList.remove('show')">Cerrar</button>
        </div>
      </div>
    `;
    
    // Crear modal temporal para las reglas
    const rulesModal = document.createElement('div');
    rulesModal.className = 'modal show';
    rulesModal.innerHTML = rulesContent;
    document.body.appendChild(rulesModal);
    
    // Remover modal al hacer clic fuera
    rulesModal.addEventListener('click', (e) => {
      if (e.target === rulesModal) {
        document.body.removeChild(rulesModal);
      }
    });
  }
  
  addLogMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'log-entry';
    
    // Clasificar mensajes por tipo
    if (message.includes('GANA') || message.includes('Felicitaciones')) {
      messageElement.classList.add('success');
    } else if (message.includes('bancarrota') || message.includes('no puede pagar')) {
      messageElement.classList.add('danger');
    } else if (message.includes('compra') || message.includes('cobra') || message.includes('dobles')) {
      messageElement.classList.add('important');
    }
    
    messageElement.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    
    this.elements.logMessages.appendChild(messageElement);
    
    // Scroll al final
    this.elements.logMessages.scrollTop = this.elements.logMessages.scrollHeight;
    
    // Limitar el número de mensajes (mantener solo los últimos 50)
    while (this.elements.logMessages.children.length > 50) {
      this.elements.logMessages.removeChild(this.elements.logMessages.firstChild);
    }
  }
  
  clearLog() {
    this.elements.logMessages.innerHTML = '';
  }
  
  showPropertyDetails(space) {
    let details = `
      <div class="property-details-modal">
        <h3>${space.name}</h3>
        <p>${space.description || ''}</p>
    `;
    
    if (space.price) {
      details += `<p><strong>Precio:</strong> $${space.price.toLocaleString()}</p>`;
    }
    
    if (space.rent) {
      details += `
        <div class="rent-info">
          <h4>Alquileres:</h4>
          <ul>
            <li>Terreno solo: $${space.rent[0].toLocaleString()}</li>
            <li>Con 1 casa: $${space.rent[1].toLocaleString()}</li>
            <li>Con 2 casas: $${space.rent[2].toLocaleString()}</li>
            <li>Con 3 casas: $${space.rent[3].toLocaleString()}</li>
            <li>Con 4 casas: $${space.rent[4].toLocaleString()}</li>
            <li>Con hotel: $${space.rent[5].toLocaleString()}</li>
          </ul>
        </div>
      `;
    }
    
    details += '</div>';
    
    // TODO: Mostrar modal con detalles
    console.log(details);
  }
  
  showPlayerRanking() {
    const players = this.game.players.map(p => p.getInfo())
      .sort((a, b) => b.totalWealth - a.totalWealth);
    
    let ranking = '<div class="player-ranking"><h3>Clasificación de Jugadores</h3><ol>';
    
    players.forEach((player, index) => {
      ranking += `
        <li>
          <strong>${player.name}</strong><br>
          Dinero: $${player.money.toLocaleString()}<br>
          Patrimonio: $${player.totalWealth.toLocaleString()}<br>
          Propiedades: ${player.properties + player.railroads + player.utilities}
        </li>
      `;
    });
    
    ranking += '</ol></div>';
    
    // TODO: Mostrar modal con ranking
    console.log(ranking);
  }
  
  // Funciones de utilidad para formatear valores
  formatMoney(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  formatNumber(number) {
    return new Intl.NumberFormat('es-AR').format(number);
  }
}
