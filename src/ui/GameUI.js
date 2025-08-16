export class GameUI {
  constructor(game) {
    this.game = game;
    this.turnTimer = null;
    this.currentTurnTime = 15;
    this.timerPhase = 'ROLL_DICE'; // 'ROLL_DICE' o 'DECISION'
    this.selectedPlayerCount = 0;
    this.selectedWinAmount = 7500000; // Valor por defecto
    
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
      
      // Elementos del centro del tablero
      currentTurnPlayer: document.getElementById('current-turn-player'),
      timerSeconds: document.getElementById('timer-seconds'),
      turnStatus: document.getElementById('turn-status'),
      centerLogMessages: document.getElementById('center-log-messages'),
      centerDice1: document.getElementById('center-dice1'),
      centerDice2: document.getElementById('center-dice2'),
      
      // Modales
      gameSetupModal: document.getElementById('game-setup-modal'),
      gameOverModal: document.getElementById('game-over-modal'),
      gameOverContent: document.getElementById('game-over-content'),
      
      // Elementos del modal de setup
      playerCountBtns: document.querySelectorAll('.player-count-btn'),
      winAmountBtns: document.querySelectorAll('.win-amount-btn'),
      customWinAmountInput: document.getElementById('custom-win-amount'),
      setCustomAmountBtn: document.getElementById('set-custom-amount-btn'),
      startGameBtn: document.getElementById('start-game-btn'),
      cancelSetupBtn: document.getElementById('cancel-setup-btn'),
      
      // Elementos de resumen
      summaryPlayers: document.getElementById('summary-players'),
      summaryWinAmount: document.getElementById('summary-win-amount'),
      summaryDuration: document.getElementById('summary-duration'),
      
      // Botones del modal de game over
      playAgainBtn: document.getElementById('play-again-btn'),
      closeGameOverBtn: document.getElementById('close-game-over-btn'),
      
      // Modal de negociación
      negotiationModal: document.getElementById('negotiation-modal'),
      currentPlayerName: document.getElementById('current-player-name'),
      currentPlayerProperties: document.getElementById('current-player-properties'),
      otherPlayersList: document.getElementById('other-players-list'),
      closeNegotiationBtn: document.getElementById('close-negotiation-btn'),
      
      // Modal de opciones de cárcel
      jailOptionsModal: document.getElementById('jail-options-modal'),
      jailPlayerName: document.getElementById('jail-player-name'),
      jailPayBtn: document.getElementById('jail-pay-btn'),
      jailAcceptBtn: document.getElementById('jail-accept-btn')
    };
    
    this.setupEventListeners();
    this.game.onGameStateChange = this.updateUI.bind(this);
    this.game.onLogMessage = this.addLogMessage.bind(this);
    this.game.onGameSetup = this.showGameSetup.bind(this);
    this.game.onGameOver = this.showGameOver.bind(this);
    this.game.onNegotiationStart = this.showNegotiation.bind(this);
    
    // Validar elementos críticos
    this.validateElements();
  }
  
  validateElements() {
    const criticalElements = [
      'centerLogMessages',
      'currentTurnPlayer',
      'gameSetupModal',
      'startGameBtn'
    ];
    
    criticalElements.forEach(elementKey => {
      if (!this.elements[elementKey]) {
        console.warn(`Elemento crítico no encontrado: ${elementKey}`);
      }
    });
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
    
    this.elements.winAmountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectWinAmount(btn);
      });
    });
    
    this.elements.setCustomAmountBtn.addEventListener('click', () => {
      this.setCustomWinAmount();
    });
    
    this.elements.customWinAmountInput.addEventListener('input', () => {
      this.validateCustomAmount();
    });
    
    this.elements.customWinAmountInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.setCustomWinAmount();
      }
    });
    
    this.elements.startGameBtn.addEventListener('click', () => {
      this.startGame();
    });
    
    if (this.elements.cancelSetupBtn) {
      this.elements.cancelSetupBtn.addEventListener('click', () => {
        this.hideGameSetup();
      });
    }
    
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

    // Event listeners para el modal de negociación
    this.elements.closeNegotiationBtn.addEventListener('click', () => {
      this.hideNegotiation();
    });

    this.elements.negotiationModal.addEventListener('click', (e) => {
      if (e.target === this.elements.negotiationModal) {
        this.hideNegotiation();
      }
    });

    // Event listeners para el modal de opciones de cárcel
    this.elements.jailPayBtn.addEventListener('click', () => {
      this.game.handleJailPayment();
    });

    this.elements.jailAcceptBtn.addEventListener('click', () => {
      this.game.handleJailAcceptance();
    });

    this.elements.jailOptionsModal.addEventListener('click', (e) => {
      if (e.target === this.elements.jailOptionsModal) {
        // No permitir cerrar el modal haciendo clic fuera, el jugador debe elegir
      }
    });
  }
  
  updateUI(gameState) {
    const { currentPlayer, canRollDice, canBuyProperty, canEndTurn, players, gamePhase, waitingForBuyDecision } = gameState;
    
    if (gamePhase === 'SETUP') {
      this.stopTurnTimer();
      return; // No actualizar UI durante setup
    }
    
    // Actualizar información del jugador actual
    this.updateCurrentPlayerInfo(currentPlayer);
    
    // Actualizar información de todos los jugadores
    this.updateAllPlayersInfo(players, currentPlayer);
    
    // Actualizar centro del tablero
    this.updateBoardCenter(currentPlayer, canRollDice, canBuyProperty, canEndTurn, waitingForBuyDecision);
    
    // Actualizar estado de los botones
    this.elements.rollDiceBtn.disabled = !canRollDice;
    this.elements.buyPropertyBtn.disabled = !canBuyProperty;
    // Habilitar el botón de terminar turno si puede terminar O si está esperando decisión de compra
    this.elements.endTurnBtn.disabled = !(canEndTurn || waitingForBuyDecision);
    
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
    
    // Actualizar texto del botón de terminar turno
    if (waitingForBuyDecision) {
      this.elements.endTurnBtn.textContent = 'Pasar Turno (No Comprar)';
    } else {
      this.elements.endTurnBtn.textContent = 'Terminar Turno';
    }
    
    // Reiniciar temporizador si es el turno de un jugador nuevo
    if (gamePhase === 'PLAYING' && canRollDice) {
      this.startTurnTimer();
    }
  }
  
  updateBoardCenter(currentPlayer, canRollDice, canBuyProperty, canEndTurn, waitingForBuyDecision) {
    if (!currentPlayer) return;
    
    // Actualizar nombre del jugador actual
    this.elements.currentTurnPlayer.textContent = `Turno de ${currentPlayer.name}`;
    this.elements.currentTurnPlayer.style.color = this.getPlayerColor(currentPlayer.name);
    
    // Actualizar estado del turno
    let statusMessage = '';
    if (waitingForBuyDecision) {
      statusMessage = '🏠 ¿Comprar propiedad? (B = Sí, Enter = No)';
    } else if (canRollDice) {
      statusMessage = '🎲 Presiona ESPACIO para tirar dados';
    } else if (canBuyProperty) {
      statusMessage = '🏠 Presiona B para comprar propiedad';
    } else if (canEndTurn) {
      statusMessage = '✅ Presiona ENTER para terminar turno';
    } else {
      statusMessage = '⏳ Esperando...';
    }
    
    this.elements.turnStatus.textContent = statusMessage;
  }
  
  startTurnTimer(phase = 'ROLL_DICE') {
    // Detener temporizador anterior si existe
    this.stopTurnTimer();
    
    // Configurar fase del temporizador
    this.timerPhase = phase;
    
    // Reiniciar tiempo a 15 segundos
    this.currentTurnTime = 15;
    this.elements.timerSeconds.textContent = this.currentTurnTime;
    
    // Remover clases de estado
    const timerCircle = document.querySelector('.timer-circle');
    timerCircle.classList.remove('warning', 'danger');
    
    // Mostrar mensaje según la fase
    if (phase === 'ROLL_DICE') {
      this.addLogMessage('🎲 Tienes 15 segundos para tirar los dados');
    } else if (phase === 'DECISION') {
      this.addLogMessage('⏰ Tienes 15 segundos para decidir');
    }
    
    // Iniciar nuevo temporizador
    this.turnTimer = setInterval(() => {
      this.currentTurnTime--;
      this.elements.timerSeconds.textContent = this.currentTurnTime;
      
      // Actualizar progreso visual
      const progress = (15 - this.currentTurnTime) / 15 * 360;
      timerCircle.style.background = `conic-gradient(var(--primary-yellow) ${progress}deg, transparent ${progress}deg)`;
      
      // Estados de alerta
      if (this.currentTurnTime <= 3) {
        timerCircle.classList.add('danger');
        timerCircle.classList.remove('warning');
      } else if (this.currentTurnTime <= 7) {
        timerCircle.classList.add('warning');
        timerCircle.classList.remove('danger');
      }
      
      // Tiempo agotado
      if (this.currentTurnTime <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }
  
  stopTurnTimer() {
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
  }
  
  handleTimeUp() {
    this.stopTurnTimer();
    
    if (this.timerPhase === 'ROLL_DICE') {
      // Fase 1: Si no tiró los dados, tirarlos automáticamente
      if (this.game.canRollDice && this.game.gamePhase === 'PLAYING') {
        this.game.autoRollDice();
        
        // Después de tirar los dados, iniciar la fase de decisión
        setTimeout(() => {
          this.startDecisionPhase();
        }, 2000); // Esperar 2 segundos para que se complete la animación
      } else {
        this.game.autoEndTurn();
      }
    } else if (this.timerPhase === 'DECISION') {
      // Fase 2: Si no decidió, terminar turno automáticamente
      this.game.autoEndTurn();
    }
  }

  // Método para iniciar la fase de decisión
  startDecisionPhase() {
    if (this.game.canEndTurn || this.game.waitingForBuyDecision) {
      this.startTurnTimer('DECISION');
    }
  }

  // Método para forzar fin de turno
  updateCurrentPlayerInfo(player) {
    if (!player) return;

    // Información básica del jugador
    if (this.elements.currentPlayer) {
      this.elements.currentPlayer.innerHTML = `
        <div class="player-name" style="color: ${player.color}">
          <strong>${player.name}</strong>
          ${player.isInJail ? ' 🔒' : ''}
        </div>
      `;
    }
    
    // Dinero del jugador - con valores seguros
    if (this.elements.playerMoney) {
      const money = player.money || 0;
      const totalWealth = player.totalWealth || money;
      
      this.elements.playerMoney.innerHTML = `
        <div class="money-display">
          <span class="money">$${money.toLocaleString()}</span>
        </div>
        <div class="wealth-display">
          Patrimonio total: <span class="money">$${totalWealth.toLocaleString()}</span>
        </div>
      `;
    }
    
    // Propiedades del jugador
    const propertiesCount = player.properties + player.railroads + player.utilities;
    let propertiesHtml = `
      <div class="properties-summary">
        <div>Propiedades: ${player.properties}</div>
        <div>Transportes: ${player.railroads}</div>
        <div>Servicios: ${player.utilities}</div>
        <div><strong>Total: ${propertiesCount}</strong></div>
      </div>
    `;

    // Mostrar lista detallada de propiedades si el jugador tiene alguna
    if (propertiesCount > 0) {
      propertiesHtml += '<div class="owned-properties">';
      
      if (player.propertiesList && player.propertiesList.length > 0) {
        propertiesHtml += '<div class="property-group"><strong>🏠 Propiedades:</strong><ul>';
        player.propertiesList.forEach(prop => {
          propertiesHtml += `<li style="color: ${prop.color || '#000'}">${prop.name}</li>`;
        });
        propertiesHtml += '</ul></div>';
      }

      if (player.railroadsList && player.railroadsList.length > 0) {
        propertiesHtml += '<div class="property-group"><strong>🚂 Transportes:</strong><ul>';
        player.railroadsList.forEach(rail => {
          propertiesHtml += `<li>${rail.name}</li>`;
        });
        propertiesHtml += '</ul></div>';
      }

      if (player.utilitiesList && player.utilitiesList.length > 0) {
        propertiesHtml += '<div class="property-group"><strong>⚡ Servicios:</strong><ul>';
        player.utilitiesList.forEach(util => {
          propertiesHtml += `<li>${util.name}</li>`;
        });
        propertiesHtml += '</ul></div>';
      }
      
      propertiesHtml += '</div>';
    }

    this.elements.playerProperties.innerHTML = propertiesHtml;
    
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
    // Actualizar dados del centro del tablero
    if (this.elements.centerDice1 && this.elements.centerDice2) {
      this.elements.centerDice1.textContent = dice1 || '?';
      this.elements.centerDice2.textContent = dice2 || '?';
    }
    
    // Animación de dados
    if (dice1 && dice2) {
      this.animateCenterDice();
    }
  }
  
  animateCenterDice() {
    const diceElements = [this.elements.centerDice1, this.elements.centerDice2];
    
    diceElements.forEach(dice => {
      if (dice) {
        dice.style.transform = 'rotate(360deg) scale(1.2)';
        dice.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
          dice.style.transform = 'rotate(0deg) scale(1)';
        }, 500);
      }
    });
  }
  
  updateAllPlayersInfo(players, currentPlayer) {
    if (!this.elements.allPlayersInfo || !players) return;
    
    this.elements.allPlayersInfo.innerHTML = '';
    
    // Separar jugadores activos y en bancarrota
    const activePlayers = players.filter(p => !p.bankrupt);
    const bankruptPlayers = players.filter(p => p.bankrupt);
    
    // Ordenar jugadores activos por dinero (descendente)
    const sortedActivePlayers = [...activePlayers].sort((a, b) => b.money - a.money);
    
    // Mostrar estadísticas generales
    if (players.length > 0) {
      const statsHeader = document.createElement('div');
      statsHeader.className = 'stats-header';
      statsHeader.innerHTML = `
        <div class="game-stats">
          <div class="stat-item">
            <span class="stat-label">👥 Jugadores Activos:</span>
            <span class="stat-value">${activePlayers.length}/${players.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">💸 En Bancarrota:</span>
            <span class="stat-value danger">${bankruptPlayers.length}</span>
          </div>
        </div>
      `;
      this.elements.allPlayersInfo.appendChild(statsHeader);
    }
    
    // Mostrar jugadores activos
    if (sortedActivePlayers.length > 0) {
      const activeHeader = document.createElement('h5');
      activeHeader.textContent = '🎮 Jugadores Activos';
      activeHeader.className = 'section-header';
      this.elements.allPlayersInfo.appendChild(activeHeader);
      
      sortedActivePlayers.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-summary active-player';
        
        if (currentPlayer && player.name === currentPlayer.name) {
          playerDiv.classList.add('current');
        }
        
        // Determinar el estado del jugador
        let status = '';
        let statusClass = '';
        if (player.money >= 7500000) {
          status = '🏆 ¡GANADOR!';
          statusClass = 'winner';
        } else if (player.isInJail) {
          status = `🔒 Cárcel (${player.jailTurns}/3)`;
          statusClass = 'jailed';
        }
        
        // Calcular progreso hacia la victoria
        const progressToWin = Math.min((player.money / 7500000) * 100, 100);
        const progressToBankrupt = Math.max(0, ((player.money + 1000000) / 2500000) * 100);
        
        playerDiv.innerHTML = `
          <div class="player-header">
            <div class="player-name" style="color: ${this.getPlayerColor(player.name)}">
              <strong>${index + 1}. ${player.name}</strong> ${status}
            </div>
            <div class="player-position">Posición: ${player.position}</div>
          </div>
          <div class="player-stats">
            <div class="money-info">
              <div class="main-money">💰 <strong>$${player.money.toLocaleString()}</strong></div>
              <div class="wealth-info">
                <small>Patrimonio: $${(player.totalWealth || player.money).toLocaleString()}</small>
              </div>
            </div>
            <div class="properties-info">
              <div class="property-counts">
                � ${player.properties || 0} | 🚂 ${player.railroads || 0} | ⚡ ${player.utilities || 0}
                <span class="total-props">(Total: ${(player.properties || 0) + (player.railroads || 0) + (player.utilities || 0)})</span>
              </div>
            </div>
            <div class="progress-bars">
              <div class="progress-item">
                <label>Progreso a Victoria:</label>
                <div class="progress-bar">
                  <div class="progress-fill win" style="width: ${progressToWin}%"></div>
                </div>
                <small>${progressToWin.toFixed(1)}%</small>
              </div>
            </div>
          </div>
        `;
        
        this.elements.allPlayersInfo.appendChild(playerDiv);
      });
    }
    
    // Mostrar jugadores en bancarrota
    if (bankruptPlayers.length > 0) {
      const bankruptHeader = document.createElement('h5');
      bankruptHeader.textContent = '💸 Jugadores Eliminados';
      bankruptHeader.className = 'section-header danger';
      this.elements.allPlayersInfo.appendChild(bankruptHeader);
      
      bankruptPlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-summary bankrupt-player';
        
        playerDiv.innerHTML = `
          <div class="player-name" style="color: ${this.getPlayerColor(player.name)}">
            ${player.name} 💀 ELIMINADO
          </div>
          <div class="player-stats">
            <div class="final-money">Dinero final: $${player.money.toLocaleString()}</div>
          </div>
        `;
        
        this.elements.allPlayersInfo.appendChild(playerDiv);
      });
    }
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
    
    // Resetear selecciones
    this.selectedPlayerCount = 0;
    this.selectedWinAmount = 7500000; // Valor por defecto
    
    // Limpiar selecciones anteriores
    this.elements.playerCountBtns.forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Seleccionar monto por defecto (Clásico)
    this.elements.winAmountBtns.forEach(btn => {
      btn.classList.remove('active');
      if (parseInt(btn.dataset.amount) === 7500000) {
        btn.classList.add('active');
      }
    });
    
    // Limpiar input personalizado
    if (this.elements.customWinAmountInput) {
      this.elements.customWinAmountInput.value = '';
      this.elements.customWinAmountInput.style.borderColor = '';
    }
    
    // Actualizar resumen inicial
    this.updateGameSummary();
    
    // Verificar estado del botón de inicio
    this.checkCanStartGame();
  }
  
  hideGameSetup() {
    this.elements.gameSetupModal.classList.remove('show');
  }
  
  selectPlayerCount(selectedBtn) {
    // Remover selección anterior
    this.elements.playerCountBtns.forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Seleccionar nuevo botón
    selectedBtn.classList.add('selected');
    this.selectedPlayerCount = parseInt(selectedBtn.dataset.count);
    
    // Actualizar resumen
    this.updateGameSummary();
    
    // Verificar si se puede iniciar el juego
    this.checkCanStartGame();
  }
  
  selectWinAmount(selectedBtn) {
    // Remover selección anterior
    this.elements.winAmountBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Seleccionar nuevo botón
    selectedBtn.classList.add('active');
    this.selectedWinAmount = parseInt(selectedBtn.dataset.amount);
    
    // Limpiar input personalizado
    if (this.elements.customWinAmountInput) {
      this.elements.customWinAmountInput.value = '';
    }
    
    // Actualizar resumen
    this.updateGameSummary();
  }
  
  setCustomWinAmount() {
    const customAmount = parseInt(this.elements.customWinAmountInput.value);
    
    if (customAmount && customAmount >= 1000000 && customAmount <= 50000000) {
      // Remover selección de botones predeterminados
      this.elements.winAmountBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Establecer monto personalizado
      this.selectedWinAmount = customAmount;
      
      // Actualizar resumen
      this.updateGameSummary();
      
      // Feedback visual
      this.elements.setCustomAmountBtn.textContent = '✓ Aplicado';
      this.elements.setCustomAmountBtn.style.background = '#28a745';
      
      setTimeout(() => {
        this.elements.setCustomAmountBtn.textContent = 'Aplicar';
        this.elements.setCustomAmountBtn.style.background = '';
      }, 1500);
    } else {
      // Error feedback
      this.elements.customWinAmountInput.style.borderColor = '#dc3545';
      this.elements.setCustomAmountBtn.textContent = '❌ Error';
      this.elements.setCustomAmountBtn.style.background = '#dc3545';
      
      setTimeout(() => {
        this.elements.customWinAmountInput.style.borderColor = '';
        this.elements.setCustomAmountBtn.textContent = 'Aplicar';
        this.elements.setCustomAmountBtn.style.background = '';
      }, 1500);
    }
  }
  
  validateCustomAmount() {
    const value = parseInt(this.elements.customWinAmountInput.value);
    const isValid = value >= 1000000 && value <= 50000000;
    
    if (this.elements.customWinAmountInput.value === '') {
      this.elements.customWinAmountInput.style.borderColor = '';
      this.elements.setCustomAmountBtn.disabled = true;
    } else if (isValid) {
      this.elements.customWinAmountInput.style.borderColor = '#28a745';
      this.elements.setCustomAmountBtn.disabled = false;
    } else {
      this.elements.customWinAmountInput.style.borderColor = '#dc3545';
      this.elements.setCustomAmountBtn.disabled = true;
    }
  }
  
  updateGameSummary() {
    // Actualizar jugadores
    if (this.selectedPlayerCount > 0) {
      this.elements.summaryPlayers.textContent = `${this.selectedPlayerCount} jugadores`;
      this.elements.summaryPlayers.style.color = '#28a745';
    } else {
      this.elements.summaryPlayers.textContent = 'No seleccionado';
      this.elements.summaryPlayers.style.color = '#dc3545';
    }
    
    // Actualizar monto de victoria
    this.elements.summaryWinAmount.textContent = `$${this.selectedWinAmount.toLocaleString()}`;
    
    // Calcular duración estimada basada en jugadores y monto
    let estimatedDuration = '';
    if (this.selectedPlayerCount > 0) {
      const baseMinutes = 10 + (this.selectedPlayerCount * 5);
      const amountMultiplier = this.selectedWinAmount / 7500000;
      const totalMinutes = Math.round(baseMinutes * amountMultiplier);
      
      if (totalMinutes < 20) {
        estimatedDuration = `${totalMinutes}-${totalMinutes + 10} minutos (Rápido)`;
      } else if (totalMinutes < 40) {
        estimatedDuration = `${totalMinutes}-${totalMinutes + 15} minutos (Moderado)`;
      } else {
        estimatedDuration = `${totalMinutes}-${totalMinutes + 20} minutos (Épico)`;
      }
    } else {
      estimatedDuration = 'Selecciona jugadores';
    }
    
    this.elements.summaryDuration.textContent = estimatedDuration;
  }
  
  checkCanStartGame() {
    const canStart = this.selectedPlayerCount >= 2 && this.selectedPlayerCount <= 5 && this.selectedWinAmount >= 1000000;
    this.elements.startGameBtn.disabled = !canStart;
  }
  
  startGame() {
    // Configurar el juego con las opciones seleccionadas
    this.game.setPlayerCount(this.selectedPlayerCount);
    this.game.setWinLimit(this.selectedWinAmount);
    
    this.hideGameSetup();
    this.clearLog();
    this.game.initializeGame();
  }
  
  showGameOver(player, type) {
    this.stopTurnTimer(); // Parar temporizador cuando termine el juego
    
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

  showNegotiation(data) {
    const { currentPlayer, otherPlayers } = data;
    
    // Actualizar título con nombre del jugador
    this.elements.currentPlayerName.textContent = `${currentPlayer.name} - Tu inventario`;
    
    // Mostrar propiedades del jugador actual
    this.elements.currentPlayerProperties.innerHTML = this.renderPlayerProperties(currentPlayer);
    
    // Mostrar otros jugadores
    this.elements.otherPlayersList.innerHTML = otherPlayers.map(player => `
      <div class="player-card" data-player-id="${player.id}">
        <div class="player-card-header">
          <span class="player-card-name" style="color: ${player.color}">${player.name}</span>
          <span class="player-card-properties">
            ${player.properties.length + player.railroads.length + player.utilities.length} propiedades
          </span>
        </div>
        <div class="player-card-properties">
          💰 $${player.money.toLocaleString()}
        </div>
        <button class="negotiate-btn" onclick="window.gameUI.showPlayerProperties('${player.id}')">
          Ver Propiedades
        </button>
      </div>
    `).join('');
    
    // Mostrar modal
    this.elements.negotiationModal.classList.add('show');
  }

  hideNegotiation() {
    this.elements.negotiationModal.classList.remove('show');
  }

  renderPlayerProperties(player) {
    let html = '';
    
    // Propiedades
    if (player.properties && player.properties.length > 0) {
      html += '<h4>🏠 Propiedades:</h4>';
      player.properties.forEach(prop => {
        html += `
          <div class="property-item" data-property-id="${prop.id}">
            <span class="property-name" style="color: ${prop.color}">${prop.name}</span>
            <span class="property-type">Propiedad</span>
          </div>
        `;
      });
    }
    
    // Transportes
    if (player.railroads && player.railroads.length > 0) {
      html += '<h4>🚂 Transportes:</h4>';
      player.railroads.forEach(rail => {
        html += `
          <div class="property-item" data-property-id="${rail.id}">
            <span class="property-name">${rail.name}</span>
            <span class="property-type">Transporte</span>
          </div>
        `;
      });
    }
    
    // Servicios
    if (player.utilities && player.utilities.length > 0) {
      html += '<h4>⚡ Servicios:</h4>';
      player.utilities.forEach(util => {
        html += `
          <div class="property-item" data-property-id="${util.id}">
            <span class="property-name">${util.name}</span>
            <span class="property-type">Servicio</span>
          </div>
        `;
      });
    }
    
    if (html === '') {
      html = '<p>No tienes propiedades para intercambiar</p>';
    }
    
    return html;
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
    // Función para clasificar el tipo de mensaje
    const getMessageType = (msg) => {
      if (msg.includes('🚶') || msg.includes('se mueve') || msg.includes('llega a')) {
        return 'move';
      } else if (msg.includes('💰') || msg.includes('cobra') || msg.includes('recibe') || msg.includes('LARGADA')) {
        return 'money';
      } else if (msg.includes('✅') || msg.includes('compra') || msg.includes('🏠') || msg.includes('⚡')) {
        return 'property';
      } else if (msg.includes('❌') || msg.includes('bancarrota') || msg.includes('no puede') || msg.includes('💸')) {
        return 'danger';
      } else if (msg.includes('🎲') || msg.includes('dados') || msg.includes('turno') || msg.includes('⏰')) {
        return 'info';
      }
      return 'info';
    };

    // Agregar al log del centro del tablero
    if (this.elements.centerLogMessages) {
      const centerMessageElement = document.createElement('div');
      const messageType = getMessageType(message);
      centerMessageElement.className = `log-entry ${messageType}`;
      
      // Agregar clase especial para mensajes importantes
      if (message.includes('GANA') || message.includes('compra') || message.includes('dobles')) {
        centerMessageElement.classList.add('highlight');
      }
      
      centerMessageElement.textContent = message;
      
      this.elements.centerLogMessages.appendChild(centerMessageElement);
      
      // Mantener solo los últimos 2 mensajes en el centro para un diseño más limpio
      while (this.elements.centerLogMessages.children.length > 2) {
        this.elements.centerLogMessages.removeChild(this.elements.centerLogMessages.firstChild);
      }
      
      // No necesitamos scroll ya que siempre mostramos solo 2 mensajes
    }

    // Mantener el log original en el panel lateral para referencia completa
    if (this.elements.logMessages) {
      const messageElement = document.createElement('div');
      const messageType = getMessageType(message);
      messageElement.className = `log-entry ${messageType}`;
      
      // Agregar timestamp para el log completo
      const timestamp = new Date().toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      messageElement.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
      
      this.elements.logMessages.appendChild(messageElement);
      
      // Mantener solo los últimos 50 mensajes
      while (this.elements.logMessages.children.length > 50) {
        this.elements.logMessages.removeChild(this.elements.logMessages.firstChild);
      }
      
      // No hacer scroll automático para mantener limpieza visual
    }
  }

  clearLog() {
    if (this.elements.centerLogMessages) {
      this.elements.centerLogMessages.innerHTML = '';
    }
    // También limpiar el log principal si existe
    if (this.elements.logMessages) {
      this.elements.logMessages.innerHTML = '';
    }
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
  
  // Mostrar modal de opciones de cárcel
  showJailOptionsModal(player) {
    console.log('showJailOptionsModal called for player:', player.name);
    console.log('Elements found:', {
      modal: !!this.elements.jailOptionsModal,
      playerName: !!this.elements.jailPlayerName,
      payBtn: !!this.elements.jailPayBtn,
      acceptBtn: !!this.elements.jailAcceptBtn
    });
    
    if (!this.elements.jailOptionsModal) {
      console.error('Jail options modal not found!');
      return;
    }
    
    this.elements.jailPlayerName.textContent = `${player.name}, ¿qué decides hacer?`;
    
    // Verificar si el jugador tiene dinero suficiente para pagar
    const jailFee = 750000;
    if (player.money < jailFee) {
      this.elements.jailPayBtn.disabled = true;
      this.elements.jailPayBtn.textContent = `Pagar $${jailFee.toLocaleString()} (Sin dinero)`;
      this.elements.jailPayBtn.style.opacity = '0.5';
    } else {
      this.elements.jailPayBtn.disabled = false;
      this.elements.jailPayBtn.textContent = `Pagar $${jailFee.toLocaleString()}`;
      this.elements.jailPayBtn.style.opacity = '1';
    }
    
    console.log('Adding show class to modal');
    this.elements.jailOptionsModal.classList.add('show');
    console.log('Modal should now be visible');
  }

  hideJailOptions() {
    console.log('hideJailOptions called');
    if (this.elements.jailOptionsModal) {
      this.elements.jailOptionsModal.classList.remove('show');
      console.log('Modal hidden successfully');
    } else {
      console.error('Jail options modal not found!');
    }
  }

  // Mostrar propiedades de un jugador específico
  showPlayerProperties(playerId) {
    const player = this.game.players.find(p => p.id === playerId);
    if (!player) return;

    // Crear modal dinámico para mostrar propiedades
    let modal = document.getElementById('player-properties-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'player-properties-modal';
      modal.className = 'modal';
      document.body.appendChild(modal);
    }

    const propertiesHtml = this.renderPlayerProperties(player);
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Propiedades de ${player.name}</h2>
          <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.style.display='none'">&times;</button>
        </div>
        <div class="modal-body">
          <div class="player-properties-display">
            ${propertiesHtml || '<p>Este jugador no tiene propiedades</p>'}
          </div>
          <div class="player-money-display">
            <h3>💰 Dinero: $${player.money.toLocaleString()}</h3>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.style.display='none'">Cerrar</button>
        </div>
      </div>
    `;

    modal.style.display = 'block';
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
