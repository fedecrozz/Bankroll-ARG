import { Board } from '../board/Board.js';
import { Player } from '../player/Player.js';
import { communityChestCards, chanceCards, destinyCards, shuffleCards } from '../board/cards.js';
import { boardSpaces } from '../board/spaces.js';
import { DiceAnimation } from '../ui/DiceAnimation.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new Board(canvas, this.ctx);
    this.diceAnimation = new DiceAnimation(canvas);
    
    // Estado del juego
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gamePhase = 'SETUP'; // SETUP, PLAYING, GAME_OVER
    this.winner = null;
    this.diceRoll = [0, 0];
    this.canRollDice = true;
    this.canBuyProperty = false;
    this.canEndTurn = false;
    this.waitingForBuyDecision = false; // Nueva variable para esperar decisión de compra
    this.forceEndTurn = false; // Variable para forzar fin de turno (cartas DESTINO)
    
    // Límites de dinero para terminar el juego
    this.winLimit = 7500000; // $7.500.000 para ganar (configurable)
    this.bankruptLimit = -1000000; // -$1.000.000 para quiebra
    
    // Configuración de jugadores
    this.minPlayers = 2;
    this.maxPlayers = 5;
    this.selectedPlayerCount = 2; // Por defecto 2 jugadores
    
    // Cartas
    this.communityChestDeck = shuffleCards(communityChestCards);
    this.chanceDeck = shuffleCards(chanceCards);
    this.destinyDeck = shuffleCards(destinyCards);
    this.communityChestIndex = 0;
    this.chanceIndex = 0;
    this.destinyIndex = 0;
    
    // Callbacks para la UI
    this.onGameStateChange = null;
    this.onLogMessage = null;
    this.onGameSetup = null;
    this.onGameOver = null;
    
    // No inicializar automáticamente, esperar configuración del usuario
    this.showGameSetup();
  }
  
  showGameSetup() {
    this.gamePhase = 'SETUP';
    if (this.onGameSetup) {
      this.onGameSetup();
    }
    this.updateGameState();
  }
  
  setPlayerCount(count) {
    if (count >= this.minPlayers && count <= this.maxPlayers) {
      this.selectedPlayerCount = count;
      return true;
    }
    return false;
  }
  
  setWinLimit(amount) {
    if (amount >= 1000000 && amount <= 50000000) {
      this.winLimit = amount;
      return true;
    }
    return false;
  }
  
  initializeGame() {
    // Limpiar jugadores anteriores
    this.players = [];
    this.currentPlayerIndex = 0;
    this.winner = null;
    
    // Restablecer estados del juego
    this.gamePhase = 'PLAYING';
    this.diceRoll = [0, 0];
    this.canRollDice = true;
    this.canBuyProperty = false;
    this.canEndTurn = false;
    this.waitingForBuyDecision = false;
    this.forceEndTurn = false;
    
    // Colores predefinidos para los jugadores
    const playerColors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
    const playerNames = ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Magenta'];
    
    // Crear jugadores según la cantidad seleccionada
    for (let i = 0; i < this.selectedPlayerCount; i++) {
      this.addPlayer(playerNames[i], playerColors[i]);
    }
    
    // Posicionar jugadores en LARGADA
    this.players.forEach(player => {
      player.updateVisualPosition(this.board);
    });
    
    this.logMessage(`🎮 ¡Comienza la partida con ${this.selectedPlayerCount} jugadores!`);
    this.logMessage(`🎯 Meta de Victoria: $${this.winLimit.toLocaleString()}`);
    this.logMessage(`💸 Límite de Bancarrota: $${this.bankruptLimit.toLocaleString()}`);
    this.logMessage(`💰 Cada jugador inicia con $${this.players[0].money.toLocaleString()}`);
    this.logMessage(`🎯 Turno de ${this.getCurrentPlayer().name}`);
    this.logMessage(`🎲 Presiona ESPACIO para tirar los dados`);
    
    // Dibujar el tablero inicial
    this.draw();
    this.updateGameState();
    
    // Iniciar timer de la fase de dados para el primer jugador
    this.ui.startTurnTimer('ROLL_DICE');
  }
  
  addPlayer(name, color) {
    const player = new Player(this.players.length, name, color);
    this.players.push(player);
    return player;
  }
  
  getCurrentPlayer() {
    // Asegurar que devuelve un jugador activo (no en bancarrota)
    let attempts = 0;
    while (this.players[this.currentPlayerIndex]?.bankrupt && attempts < this.players.length) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      attempts++;
    }
    return this.players[this.currentPlayerIndex];
  }
  
  rollDice() {
    console.log(`rollDice llamado - canRollDice: ${this.canRollDice}, gamePhase: ${this.gamePhase}`);
    
    if (!this.canRollDice || this.gamePhase !== 'PLAYING') {
      console.log('No se puede tirar dados ahora');
      return [0, 0];
    }
    
    // Desactivar botones durante la animación
    this.canRollDice = false;
    this.updateGameState();
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    this.diceRoll = [dice1, dice2];
    
    const currentPlayer = this.getCurrentPlayer();
    const total = dice1 + dice2;
    
    console.log(`Valores de dados generados: ${dice1}, ${dice2}`);
    this.logMessage(`🎲 ${currentPlayer.name} tiró los dados: ${dice1} + ${dice2} = ${total}`);
    
    // Mostrar animación simple por 1 segundo y luego continuar
    this.diceAnimation.startAnimation(dice1, dice2, () => {
      console.log('Callback de animación ejecutado');
      // Este callback se ejecuta cuando termina la animación
      
      // Verificar si está en la cárcel
      if (currentPlayer.isInJail) {
        if (currentPlayer.tryToGetOutOfJail(dice1, dice2)) {
          this.logMessage(`🔓 ${currentPlayer.name} sale de la cárcel!`);
          this.movePlayer(total);
        } else {
          this.logMessage(`🔒 ${currentPlayer.name} permanece en la cárcel (turno ${currentPlayer.jailTurns}/3)`);
          this.endTurn();
        }
      } else {
        this.movePlayer(total);
      }
    });
    
    return this.diceRoll;
  }
  
  movePlayer(spaces) {
    const currentPlayer = this.getCurrentPlayer();
    const oldPosition = currentPlayer.position;
    const finalPosition = (oldPosition + spaces) % 28;
    
    currentPlayer.isMoving = true;
    
    this.logMessage(`🚶 ${currentPlayer.name} se mueve ${spaces} espacios desde ${this.board.getSpace(oldPosition).name}`);
    
    // Verificar si pasará por LARGADA
    const willPassGo = oldPosition > finalPosition || (oldPosition + spaces >= 28);
    if (willPassGo) {
      this.logMessage(`💰 ${currentPlayer.name} pasará por LARGADA y cobrará $200.000`);
    }
    
    // Animar movimiento casillero por casillero
    this.animatePlayerMovement(currentPlayer, oldPosition, spaces, () => {
      // Callback cuando termina la animación
      currentPlayer.isMoving = false;
      this.logMessage(`📍 ${currentPlayer.name} llega a ${this.board.getSpace(currentPlayer.position).name}`);
      
      // Procesar la llegada a la nueva casilla
      setTimeout(() => {
        this.processSpaceLanding();
      }, 300);
    });
  }
  
  processSpaceLanding() {
    const currentPlayer = this.getCurrentPlayer();
    const space = this.board.getSpace(currentPlayer.position);
    
    this.logMessage(`📍 ${currentPlayer.name} llega a ${space.name}`);
    
    switch (space.type) {
      case 'PROPERTY':
        this.handlePropertyLanding(space);
        break;
      case 'RAILROAD':
        this.handleRailroadLanding(space);
        break;
      case 'UTILITY':
        this.handleUtilityLanding(space);
        break;
      case 'TAX':
        this.handleTaxLanding(space);
        break;
      case 'COMMUNITY_CHEST':
        this.handleCommunityChestLanding();
        break;
      case 'CHANCE':
        this.handleChanceLanding();
        break;
      case 'DESTINY':
        this.handleDestinyLanding();
        break;
      case 'NEGOTIATION':
        this.handleNegotiationLanding();
        break;
      case 'GO_TO_JAIL':
        this.handleGoToJail();
        break;
      case 'START':
        this.logMessage(`🏁 ${currentPlayer.name} está en LARGADA!`);
        this.canEndTurn = true;
        break;
      case 'JAIL':
        this.handleJailLanding();
        break;
      default:
        this.logMessage(`❓ ${currentPlayer.name} está en ${space.name}`);
        this.canEndTurn = true;
        break;
    }
    
    // Iniciar fase de decisión del timer si hay decisiones que tomar
    if (this.waitingForBuyDecision || this.canEndTurn) {
      this.ui.startDecisionPhase();
    }
    
    this.updateGameState();
  }
  
  handlePropertyLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (!space.owner) {
      // Propiedad libre - verificar si puede comprar
      if (currentPlayer.money >= space.price) {
        this.canBuyProperty = true;
        this.waitingForBuyDecision = true;
        this.logMessage(`🏠 ${space.name} está disponible por $${space.price.toLocaleString()}`);
        this.logMessage(`💰 ${currentPlayer.name} tiene $${currentPlayer.money.toLocaleString()}`);
        this.logMessage(`❓ ¿Desea comprar esta propiedad? Presiona 'B' para comprar o 'Enter' para pasar turno`);
      } else {
        this.logMessage(`🏠 ${space.name} está disponible por $${space.price.toLocaleString()}`);
        this.logMessage(`❌ ${currentPlayer.name} no tiene suficiente dinero ($${currentPlayer.money.toLocaleString()})`);
        this.canEndTurn = true;
      }
    } else if (space.owner !== currentPlayer.id) {
      // Propiedad ocupada - pagar alquiler automáticamente
      const owner = this.players[space.owner];
      const rent = owner.calculateRent(space, boardSpaces);
      
      if (currentPlayer.pay(rent)) {
        owner.receive(rent);
        this.logMessage(`💸 ${currentPlayer.name} paga $${rent.toLocaleString()} de alquiler a ${owner.name}`);
      } else {
        this.logMessage(`💸 ${currentPlayer.name} no puede pagar el alquiler de $${rent.toLocaleString()}!`);
        this.handleBankruptcy(currentPlayer);
      }
      this.canEndTurn = true;
    } else {
      this.logMessage(`🏠 ${currentPlayer.name} está en su propia propiedad`);
      this.canEndTurn = true;
    }
  }
  
  handleRailroadLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (!space.owner) {
      if (currentPlayer.money >= space.price) {
        this.canBuyProperty = true;
        this.waitingForBuyDecision = true;
        this.logMessage(`🚂 ${space.name} está disponible por $${space.price.toLocaleString()}`);
        this.logMessage(`💰 ${currentPlayer.name} tiene $${currentPlayer.money.toLocaleString()}`);
        this.logMessage(`❓ ¿Desea comprar este transporte? Presiona 'B' para comprar o 'Enter' para pasar turno`);
      } else {
        this.logMessage(`🚂 ${space.name} está disponible por $${space.price.toLocaleString()}`);
        this.logMessage(`❌ ${currentPlayer.name} no tiene suficiente dinero ($${currentPlayer.money.toLocaleString()})`);
        this.canEndTurn = true;
      }
    } else if (space.owner !== currentPlayer.id) {
      const owner = this.players[space.owner];
      const rent = owner.calculateRent(space, boardSpaces);
      
      if (currentPlayer.pay(rent)) {
        owner.receive(rent);
        this.logMessage(`💸 ${currentPlayer.name} paga $${rent.toLocaleString()} por usar ${space.name}`);
      } else {
        this.logMessage(`💸 ${currentPlayer.name} no puede pagar $${rent.toLocaleString()}!`);
        this.handleBankruptcy(currentPlayer);
      }
      this.canEndTurn = true;
    } else {
      this.logMessage(`🚂 ${currentPlayer.name} está en su propio transporte`);
      this.canEndTurn = true;
    }
  }
  
  handleUtilityLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (!space.owner) {
      if (currentPlayer.money >= space.price) {
        this.canBuyProperty = true;
        this.waitingForBuyDecision = true;
        this.logMessage(`⚡ ${space.name} está disponible por $${space.price.toLocaleString()}`);
        this.logMessage(`💰 ${currentPlayer.name} tiene $${currentPlayer.money.toLocaleString()}`);
        this.logMessage(`❓ ¿Desea comprar este servicio? Presiona 'B' para comprar o 'Enter' para pasar turno`);
      } else {
        this.logMessage(`⚡ ${space.name} está disponible por $${space.price.toLocaleString()}`);
        this.logMessage(`❌ ${currentPlayer.name} no tiene suficiente dinero ($${currentPlayer.money.toLocaleString()})`);
        this.canEndTurn = true;
      }
    } else if (space.owner !== currentPlayer.id) {
      const owner = this.players[space.owner];
      const rent = owner.calculateRent(space, boardSpaces);
      
      if (currentPlayer.pay(rent)) {
        owner.receive(rent);
        const ownerUtilities = owner.utilities.length;
        this.logMessage(`💸 ${currentPlayer.name} paga $${rent.toLocaleString()} por usar ${space.name}`);
        this.logMessage(`⚡ Propietario: ${owner.name} (${ownerUtilities} servicio${ownerUtilities !== 1 ? 's' : ''})`);
        
        // Mostrar información del multiplicador de alquiler
        if (ownerUtilities === 2) {
          this.logMessage(`📈 Alquiler con bonificación del 25% (2 servicios)`);
        } else if (ownerUtilities === 3) {
          this.logMessage(`📈 Alquiler con bonificación del 40% (3 servicios)`);
        } else if (ownerUtilities === 4) {
          this.logMessage(`🏆 Monopolio de servicios - Bonificación del 60% (4 servicios)`);
        }
      } else {
        this.logMessage(`💸 ${currentPlayer.name} no puede pagar $${rent.toLocaleString()}!`);
        this.handleBankruptcy(currentPlayer);
      }
      this.canEndTurn = true;
    } else {
      this.logMessage(`⚡ ${currentPlayer.name} está en su propio servicio`);
      this.canEndTurn = true;
    }
  }
  
  handleTaxLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (currentPlayer.pay(space.amount)) {
      this.logMessage(`💸 ${currentPlayer.name} paga $${space.amount.toLocaleString()} en impuestos (${space.name})`);
      this.logMessage(`💰 ${currentPlayer.name} ahora tiene $${currentPlayer.money.toLocaleString()}`);
    } else {
      this.logMessage(`💸 ${currentPlayer.name} no puede pagar los impuestos de $${space.amount.toLocaleString()}!`);
      this.handleBankruptcy(currentPlayer);
    }
    
    this.canEndTurn = true;
  }
  
  handleCommunityChestLanding() {
    const card = this.communityChestDeck[this.communityChestIndex];
    this.communityChestIndex = (this.communityChestIndex + 1) % this.communityChestDeck.length;
    
    this.logMessage(`Caja Comunitaria: ${card.title} - ${card.description}`);
    this.processCard(card);
  }
  
  handleChanceLanding() {
    const card = this.chanceDeck[this.chanceIndex];
    this.chanceIndex = (this.chanceIndex + 1) % this.chanceDeck.length;
    
    this.logMessage(`Destino: ${card.title} - ${card.description}`);
    this.processCard(card);
  }

  handleDestinyLanding() {
    const currentPlayer = this.getCurrentPlayer();
    const card = this.destinyDeck[this.destinyIndex];
    this.destinyIndex = (this.destinyIndex + 1) % this.destinyDeck.length;
    
    this.logMessage(`🎯 ${currentPlayer.name} saca una carta de DESTINO:`);
    this.logMessage(`${card.title} - ${card.description}`);
    this.processDestinyCard(card);
  }

  handleNegotiationLanding() {
    const currentPlayer = this.getCurrentPlayer();
    this.logMessage(`💼 ${currentPlayer.name} llega a NEGOCIACIÓN - ¡Hora de intercambiar propiedades!`);
    
    // Verificar si hay otros jugadores con propiedades para negociar
    const playersWithProperties = this.players.filter(player => 
      player.id !== currentPlayer.id && 
      !player.bankrupt && 
      (player.properties.length > 0 || player.railroads.length > 0 || player.utilities.length > 0)
    );

    if (playersWithProperties.length === 0) {
      this.logMessage(`📭 No hay otros jugadores con propiedades para negociar`);
      this.canEndTurn = true;
      return;
    }

    // Abrir modal de negociación
    if (this.onNegotiationStart) {
      this.onNegotiationStart({
        currentPlayer: currentPlayer,
        otherPlayers: playersWithProperties
      });
    }
    
    // El jugador puede terminar turno después de negociar (o cancelar)
    this.canEndTurn = true;
  }

  processCard(card) {
    const currentPlayer = this.getCurrentPlayer();
    
    switch (card.action) {
      case 'COLLECT':
        currentPlayer.receive(card.amount);
        this.logMessage(`${currentPlayer.name} recibe $${card.amount.toLocaleString()}`);
        break;
      case 'PAY':
        if (currentPlayer.pay(card.amount)) {
          this.logMessage(`${currentPlayer.name} paga $${card.amount.toLocaleString()}`);
        } else {
          this.logMessage(`${currentPlayer.name} no puede pagar!`);
        }
        break;
      case 'GO_TO_JAIL':
        currentPlayer.goToJail();
        currentPlayer.updateVisualPosition(this.board);
        this.logMessage(`${currentPlayer.name} va a la cárcel!`);
        break;
      case 'GET_OUT_OF_JAIL_FREE':
        currentPlayer.getOutOfJailFreeCards++;
        this.logMessage(`${currentPlayer.name} obtiene una carta para salir de la cárcel`);
        break;
      case 'PAY_PERCENTAGE':
        const amount = Math.floor(currentPlayer.money * card.percentage / 100);
        currentPlayer.pay(amount);
        this.logMessage(`${currentPlayer.name} pierde $${amount.toLocaleString()} (${card.percentage}% de su dinero)`);
        break;
      case 'COLLECT_FROM_ALL':
        this.players.forEach(player => {
          if (player.id !== currentPlayer.id) {
            if (player.pay(card.amount)) {
              currentPlayer.receive(card.amount);
            }
          }
        });
        this.logMessage(`Todos los jugadores pagan $${card.amount.toLocaleString()} a ${currentPlayer.name}`);
        break;
      case 'LOSE_TURN':
        this.logMessage(`${currentPlayer.name} pierde el próximo turno`);
        // TODO: Implementar lógica para perder turno
        break;
    }
    
    this.canEndTurn = true;
  }

  processDestinyCard(card) {
    const currentPlayer = this.getCurrentPlayer();
    
    switch (card.action) {
      case 'COLLECT':
        currentPlayer.receive(card.amount);
        this.logMessage(`💰 ${currentPlayer.name} recibe $${card.amount.toLocaleString()}`);
        break;
      case 'PAY':
        if (currentPlayer.pay(card.amount)) {
          this.logMessage(`💸 ${currentPlayer.name} paga $${card.amount.toLocaleString()}`);
        } else {
          this.logMessage(`❌ ${currentPlayer.name} no puede pagar $${card.amount.toLocaleString()}!`);
        }
        break;
      case 'GO_TO_JAIL':
        currentPlayer.goToJail();
        currentPlayer.updateVisualPosition(this.board);
        this.logMessage(`🚔 ${currentPlayer.name} va directo a la cárcel!`);
        break;
      case 'GO_TO_START':
        currentPlayer.position = 0; // Posición de LARGADA
        currentPlayer.receive(200000); // Cobra por pasar por LARGADA
        currentPlayer.updateVisualPosition(this.board);
        this.logMessage(`🏁 ${currentPlayer.name} va a LARGADA y cobra $200.000`);
        break;
      case 'DISCOUNT_PROPERTY':
        this.handleDiscountProperty(currentPlayer, card.discount);
        break;
      case 'PAY_TO_POOREST':
        this.handlePayToPoorest(currentPlayer, card.percentage);
        break;
      case 'EXTRA_ROLL':
        this.handleExtraRoll(currentPlayer);
        return; // No terminar turno automáticamente
      case 'ALL_PAY_PERCENTAGE':
        this.handleAllPayPercentage(card.percentage);
        break;
    }
    
    // Actualizar UI y terminar turno automáticamente
    if (this.ui) {
      this.ui.updatePlayerInfo();
    }
    
    // Configurar estado para terminar turno FORZOSAMENTE
    this.canEndTurn = true;
    this.canRollDice = false;
    this.canBuyProperty = false;
    this.waitingForBuyDecision = false;
    
    // Marcar que debe terminar el turno independientemente de si sacó dobles
    this.forceEndTurn = true;
    
    // Pasar al siguiente jugador después de un breve delay para que se lean los mensajes
    setTimeout(() => {
      this.endTurn();
    }, 1500);
  }

  handleDiscountProperty(currentPlayer, discountPercentage) {
    // Buscar propiedades libres
    const freeProperties = this.board.spaces.filter(space => 
      space.type === 'PROPERTY' && !this.isPropertyOwned(space.id)
    );

    if (freeProperties.length > 0) {
      // Por simplicidad, dar descuento en la primera propiedad libre más cara
      const bestProperty = freeProperties.reduce((best, current) => 
        current.price > best.price ? current : best
      );
      
      const discountedPrice = Math.floor(bestProperty.price * (100 - discountPercentage) / 100);
      
      if (currentPlayer.money >= discountedPrice) {
        currentPlayer.pay(discountedPrice);
        currentPlayer.addProperty(bestProperty);
        this.logMessage(`💎 ${currentPlayer.name} compra ${bestProperty.name} con ${discountPercentage}% descuento por $${discountedPrice.toLocaleString()}!`);
      } else {
        this.logMessage(`� ${currentPlayer.name} no tiene dinero suficiente para comprar con descuento`);
      }
    } else {
      this.logMessage(`😅 No hay propiedades libres para comprar con descuento`);
    }
  }

  handlePayToPoorest(currentPlayer, percentage) {
    // Encontrar al jugador más pobre
    const poorestPlayer = this.players
      .filter(player => player.id !== currentPlayer.id && !player.bankrupt)
      .reduce((poorest, player) => player.money < poorest.money ? player : poorest);

    if (poorestPlayer) {
      const amount = Math.floor(currentPlayer.money * percentage / 100);
      if (currentPlayer.pay(amount)) {
        poorestPlayer.receive(amount);
        this.logMessage(`💸 ${currentPlayer.name} paga $${amount.toLocaleString()} a ${poorestPlayer.name} (el más pobre)`);
      }
    }
  }

  handleExtraRoll(currentPlayer) {
    this.logMessage(`🎲 ${currentPlayer.name} puede tirar los dados nuevamente!`);
    this.canRollDice = true;
    this.canEndTurn = false;
    // No terminar turno automáticamente
  }

  handleAllPayPercentage(percentage) {
    this.logMessage(`🏦 ¡Crisis bancaria! Todos pierden el ${percentage}% de su dinero`);
    this.players.forEach(player => {
      if (!player.bankrupt) {
        const amount = Math.floor(player.money * percentage / 100);
        player.pay(amount);
        this.logMessage(`💸 ${player.name} pierde $${amount.toLocaleString()}`);
      }
    });
  }

  isPropertyOwned(spaceId) {
    return this.players.some(player => 
      [...player.properties, ...player.railroads, ...player.utilities]
        .some(property => property.id === spaceId)
    );
  }
  
  handleGoToJail() {
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.goToJail();
    currentPlayer.updateVisualPosition(this.board);
    this.logMessage(`${currentPlayer.name} va directo a la cárcel!`);
    this.canEndTurn = true;
  }

  handleJailLanding() {
    const currentPlayer = this.getCurrentPlayer();
    
    console.log('handleJailLanding called for player:', currentPlayer.name);
    console.log('Player isInJail:', currentPlayer.isInJail);
    console.log('this.ui exists:', !!this.ui);
    
    // Si el jugador ya está en la cárcel, solo está de visita
    if (currentPlayer.isInJail) {
      this.logMessage(`👀 ${currentPlayer.name} está de visita en la cárcel`);
      this.canEndTurn = true;
      return;
    }

    // Si llega a la cárcel por primera vez, se le dan opciones
    this.logMessage(`🔒 ${currentPlayer.name} ha llegado a la cárcel!`);
    
    if (this.ui && this.ui.showJailOptionsModal) {
      this.ui.showJailOptionsModal(currentPlayer);
    } else {
      console.error('UI or showJailOptionsModal not available');
    }
  }

  handleJailPayment() {
    const currentPlayer = this.getCurrentPlayer();
    const jailFee = 750000; // $750.000 pesos

    if (currentPlayer.money >= jailFee) {
      currentPlayer.money -= jailFee;
      this.logMessage(`💰 ${currentPlayer.name} pagó $${jailFee.toLocaleString()} para evitar la cárcel`);
    } else {
      this.logMessage(`❌ ${currentPlayer.name} no tiene dinero suficiente para pagar. Va a la cárcel.`);
      currentPlayer.goToJail();
      currentPlayer.updateVisualPosition(this.board);
    }
    
    // Cerrar el modal, actualizar UI y terminar turno automáticamente
    if (this.ui) {
      this.ui.hideJailOptions();
      this.ui.updatePlayerInfo();
    }
    
    // Terminar turno automáticamente
    this.canEndTurn = true;
    this.canRollDice = false;
    this.canBuyProperty = false;
    this.waitingForBuyDecision = false;
    
    // Pasar al siguiente jugador después de un breve delay para que se vea el mensaje
    setTimeout(() => {
      this.endTurn();
    }, 1000);
  }

  handleJailAcceptance() {
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.goToJail();
    currentPlayer.updateVisualPosition(this.board);
    this.logMessage(`🔒 ${currentPlayer.name} aceptó ir a la cárcel por 3 turnos`);
    
    // Cerrar el modal, actualizar UI y terminar turno automáticamente
    if (this.ui) {
      this.ui.hideJailOptions();
      this.ui.updatePlayerInfo();
    }
    
    // Terminar turno automáticamente
    this.canEndTurn = true;
    this.canRollDice = false;
    this.canBuyProperty = false;
    this.waitingForBuyDecision = false;
    
    // Pasar al siguiente jugador después de un breve delay para que se vea el mensaje
    setTimeout(() => {
      this.endTurn();
    }, 1000);
  }
  
  buyProperty() {
    if (!this.canBuyProperty || !this.waitingForBuyDecision) return false;
    
    const currentPlayer = this.getCurrentPlayer();
    const space = this.board.getSpace(currentPlayer.position);
    
    let success = false;
    
    if (space.type === 'PROPERTY') {
      success = currentPlayer.buyProperty(space, this.board.spaces);
    } else if (space.type === 'RAILROAD') {
      success = currentPlayer.buyRailroad(space);
    } else if (space.type === 'UTILITY') {
      success = currentPlayer.buyUtility(space);
    }
    
    if (success) {
      this.logMessage(`✅ ${currentPlayer.name} compra ${space.name} por $${space.price.toLocaleString()}`);
      this.logMessage(`💰 ${currentPlayer.name} ahora tiene $${currentPlayer.money.toLocaleString()}`);
      
      // Verificar monopolios de propiedades
      if (space.type === 'PROPERTY') {
        const monopolies = currentPlayer.checkForMonopoly(this.board.spaces);
        if (monopolies.includes(space.group)) {
          this.logMessage(`🏆 ¡${currentPlayer.name} tiene monopolio de ${space.group.toUpperCase()}!`);
          this.logMessage(`📈 Los alquileres de esta zona se duplican y ahora puede construir mejoras`);
        }
      }
      
      // Mostrar información especial para servicios
      if (space.type === 'UTILITY') {
        const utilitiesCount = currentPlayer.utilities.length;
        this.logMessage(`🔌 ${currentPlayer.name} ahora posee ${utilitiesCount} servicio${utilitiesCount !== 1 ? 's' : ''}`);
        
        // Mostrar modificador de alquiler actual
        if (utilitiesCount === 2) {
          this.logMessage(`📈 Alquiler de servicios aumentado al 125% (2 servicios)`);
        } else if (utilitiesCount === 3) {
          this.logMessage(`📈 Alquiler de servicios aumentado al 140% (3 servicios)`);
        } else if (utilitiesCount === 4) {
          this.logMessage(`🏆 ¡Monopolio de servicios! Alquiler aumentado al 160% (4 servicios)`);
        }
      }
      
      this.canBuyProperty = false;
      this.waitingForBuyDecision = false;
      this.canEndTurn = true;
    } else {
      this.logMessage(`❌ ${currentPlayer.name} no tiene suficiente dinero para comprar ${space.name}`);
    }
    
    this.updateGameState();
    return success;
  }
  
  skipPurchase() {
    if (!this.waitingForBuyDecision) return;
    
    const currentPlayer = this.getCurrentPlayer();
    const space = this.board.getSpace(currentPlayer.position);
    
    this.logMessage(`❌ ${currentPlayer.name} decide no comprar ${space.name}`);
    this.canBuyProperty = false;
    this.waitingForBuyDecision = false;
    this.canEndTurn = true;
    this.updateGameState();
  }
  
  handleBankruptcy(player) {
    player.bankrupt = true;
    this.logMessage(`💀 ${player.name} ha quedado en BANCARROTA!`);
    
    // Liberar todas las propiedades del jugador
    boardSpaces.forEach(space => {
      if (space.owner === player.id) {
        delete space.owner;
        this.logMessage(`🏠 ${space.name} queda libre nuevamente`);
      }
    });
    
    // Verificar si queda solo un jugador activo
    const activePlayers = this.players.filter(p => !p.bankrupt);
    if (activePlayers.length === 1) {
      this.winner = activePlayers[0];
      this.gamePhase = 'GAME_OVER';
      this.logMessage(`🏆 ¡${this.winner.name} GANA! Es el último jugador activo!`);
      if (this.onGameOver) {
        this.onGameOver(this.winner, 'LAST_STANDING');
      }
    }
  }
  
  checkGameEnd() {
    // Verificar si algún jugador ganó
    for (let player of this.players) {
      if (!player.bankrupt && player.money >= this.winLimit) {
        this.winner = player;
        this.gamePhase = 'GAME_OVER';
        this.logMessage(`🎉 ¡${player.name} GANA! Consiguió $${player.money.toLocaleString()}`);
        this.logMessage(`🏆 ¡Felicitaciones! Has conquistado Argentina económicamente!`);
        if (this.onGameOver) {
          this.onGameOver(player, 'WIN');
        }
        return true;
      }
      
      // Verificar bancarrota
      if (!player.bankrupt && player.money <= this.bankruptLimit) {
        this.handleBankruptcy(player);
        return this.gamePhase === 'GAME_OVER'; // Si quedó un solo jugador, el juego termina
      }
    }
    
    // Verificar si solo queda un jugador activo
    const activePlayers = this.players.filter(p => !p.bankrupt);
    if (activePlayers.length === 1) {
      this.winner = activePlayers[0];
      this.gamePhase = 'GAME_OVER';
      this.logMessage(`🏆 ¡${this.winner.name} GANA! Es el último jugador en pie!`);
      if (this.onGameOver) {
        this.onGameOver(this.winner, 'LAST_STANDING');
      }
      return true;
    }
    
    return false;
  }
  
  endTurn() {
    if (!this.canEndTurn && this.canRollDice) return;
    
    // Ocultar dados al terminar el turno
    if (this.diceAnimation) {
      this.diceAnimation.hideDice();
    }
    
    // Si está esperando decisión de compra, no puede terminar turno
    if (this.waitingForBuyDecision) {
      this.logMessage(`❓ ${this.getCurrentPlayer().name} debe decidir si compra la propiedad primero`);
      return;
    }
    
    const currentPlayer = this.getCurrentPlayer();
    
    // Verificar condiciones de fin de juego después de cada turno
    if (this.checkGameEnd()) {
      this.updateGameState();
      return;
    }
    
    // Verificar si sacó dobles y no está en la cárcel Y no es un turno forzado a terminar
    const isDoubles = this.diceRoll[0] === this.diceRoll[1];
    if (isDoubles && !currentPlayer.isInJail && this.diceRoll[0] > 0 && !this.forceEndTurn) {
      this.logMessage(`🎲 ${currentPlayer.name} sacó dobles! Tira otra vez.`);
      this.canRollDice = true;
      this.canEndTurn = false;
      this.canBuyProperty = false;
      this.waitingForBuyDecision = false;
      
      // Iniciar fase de dados del timer para el turno adicional
      this.ui.startTurnTimer('ROLL_DICE');
    } else {
      // Si es turno forzado, mostrar mensaje especial
      if (this.forceEndTurn) {
        this.logMessage(`🎯 El turno de ${currentPlayer.name} termina por carta de DESTINO`);
        this.forceEndTurn = false; // Resetear la bandera
      }
      
      // Pasar al siguiente jugador activo (no en bancarrota)
      do {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      } while (this.players[this.currentPlayerIndex].bankrupt);
      
      // Verificar nuevamente después del cambio de jugador
      if (!this.checkGameEnd()) {
        this.logMessage(`🎯 Turno de ${this.getCurrentPlayer().name} (Dinero: $${this.getCurrentPlayer().money.toLocaleString()})`);
        this.logMessage(`🎲 Presiona ESPACIO para tirar los dados`);
        this.canRollDice = true;
        this.canEndTurn = false;
        this.canBuyProperty = false;
        this.waitingForBuyDecision = false;
        this.diceRoll = [0, 0];
        
        // Iniciar fase de dados del timer (15 segundos para tirar)
        this.ui.startTurnTimer('ROLL_DICE');
      }
    }
    
    this.updateGameState();
  }
  
  logMessage(message) {
    console.log(message);
    if (this.onLogMessage) {
      this.onLogMessage(message);
    }
  }
  
  updateGameState() {
    const currentPlayer = this.getCurrentPlayer();
    const gameState = {
      currentPlayer: currentPlayer ? currentPlayer.getInfo() : null,
      canRollDice: this.canRollDice && this.gamePhase === 'PLAYING',
      canBuyProperty: this.canBuyProperty && this.gamePhase === 'PLAYING',
      canEndTurn: this.canEndTurn && this.gamePhase === 'PLAYING',
      waitingForBuyDecision: this.waitingForBuyDecision,
      diceRoll: this.diceRoll,
      players: this.players.map(p => p.getInfo()),
      activePlayers: this.players.filter(p => !p.bankrupt).length,
      gamePhase: this.gamePhase,
      winner: this.winner,
      selectedPlayerCount: this.selectedPlayerCount,
      minPlayers: this.minPlayers,
      maxPlayers: this.maxPlayers,
      winLimit: this.winLimit,
      bankruptLimit: this.bankruptLimit
    };
    
    if (this.onGameStateChange) {
      this.onGameStateChange(gameState);
    }
    
    // Redibujar el tablero después de cada cambio de estado
    if (this.gamePhase === 'PLAYING') {
      this.draw();
    }
  }
  
  draw() {
    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibujar tablero
    this.board.draw();
    
    // Dibujar jugadores
    this.players.forEach(player => {
      player.draw(this.ctx, this.board);
    });
    
    // Dibujar dados si están visibles (animando o mostrando resultado)
    if (this.diceAnimation && this.diceAnimation.showDice) {
      this.diceAnimation.drawDice();
    }
  }
  
  // Métodos para el sistema de timer automático
  autoRollDice() {
    this.logMessage(`⏰ Tiempo agotado - Tirando dados automáticamente para ${this.getCurrentPlayer().name}`);
    this.rollDice();
  }
  
  autoEndTurn() {
    this.logMessage(`⏰ Tiempo agotado - Finalizando turno automáticamente para ${this.getCurrentPlayer().name}`);
    // Si estaba esperando una decisión de compra, rechazarla
    if (this.waitingForBuyDecision) {
      this.waitingForBuyDecision = false;
      this.canBuyProperty = false;
      this.logMessage(`❌ ${this.getCurrentPlayer().name} no compra la propiedad por tiempo agotado`);
    }
    this.canEndTurn = true;
    this.endTurn();
  }
  
  // Función para iniciar un nuevo juego
  newGame() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gamePhase = 'SETUP';
    this.winner = null;
    this.diceRoll = [0, 0];
    this.canRollDice = true;
    this.canBuyProperty = false;
    this.canEndTurn = false;
    this.waitingForBuyDecision = false;
    
    // Reiniciar mazos de cartas
    this.communityChestDeck = shuffleCards(communityChestCards);
    this.chanceDeck = shuffleCards(chanceCards);
    this.communityChestIndex = 0;
    this.chanceIndex = 0;
    
    // Reiniciar propiedades
    boardSpaces.forEach(space => {
      if (space.owner !== undefined) {
        delete space.owner;
      }
    });
    
    // Mostrar configuración del juego
    this.logMessage('🔄 Iniciando nueva partida...');
    this.showGameSetup();
  }

  // Animar movimiento del jugador casillero por casillero
  animatePlayerMovement(player, startPosition, totalSpaces, onComplete) {
    let currentStep = 0;
    let currentPos = startPosition;
    
    const moveOneSpace = () => {
      if (currentStep >= totalSpaces) {
        // Animación completa
        player.isMoving = false;
        if (onComplete) onComplete();
        return;
      }
      
      // Mover una casilla
      currentStep++;
      currentPos = (currentPos + 1) % 28;
      
      // Actualizar posición del jugador
      player.position = currentPos;
      player.updateVisualPosition(this.board);
      
      // Verificar si pasa por LARGADA (casilla 0)
      if (currentPos === 0 && currentStep < totalSpaces) {
        const salary = player.collectSalary();
        this.logMessage(`💰 ${player.name} pasa por LARGADA y cobra $${salary.toLocaleString()}`);
      }
      
      // El tablero se redibuja automáticamente en el gameLoop
      
      // Programar siguiente movimiento con animación más suave
      setTimeout(moveOneSpace, 600); // 600ms entre cada casilla para más suavidad
    };
    
    // Comenzar la animación
    moveOneSpace();
  }

  // Mejorar una propiedad
  improveProperty(propertyId) {
    const currentPlayer = this.getCurrentPlayer();
    const property = currentPlayer.properties.find(p => p.id === propertyId);
    
    if (!property) {
      this.logMessage(`❌ ${currentPlayer.name} no posee esa propiedad`);
      return false;
    }
    
    if (!currentPlayer.canImproveProperty(property)) {
      const monopolyMsg = !currentPlayer.monopolies.includes(property.group) 
        ? ' (necesita monopolio del color)' 
        : '';
      const improvementsMsg = (currentPlayer.propertyImprovements[property.id] || 0) >= 3 
        ? ' (máximo 3 mejoras)' 
        : '';
      this.logMessage(`❌ No puede mejorar ${property.name}${monopolyMsg}${improvementsMsg}`);
      return false;
    }
    
    const cost = currentPlayer.getImprovementCost(property);
    if (currentPlayer.improveProperty(property.id, cost)) {
      const improvements = currentPlayer.propertyImprovements[property.id];
      this.logMessage(`🏗️ ${currentPlayer.name} mejora ${property.name} (Nivel ${improvements}) por $${cost.toLocaleString()}`);
      this.logMessage(`💰 ${currentPlayer.name} ahora tiene $${currentPlayer.money.toLocaleString()}`);
      
      // Mostrar nuevo alquiler
      const newRent = currentPlayer.getPropertyRent(property);
      this.logMessage(`📈 Nuevo alquiler: $${newRent.toLocaleString()}`);
      
      this.updateGameState();
      return true;
    }
    
    return false;
  }

  // Obtener propiedades mejorables para un jugador
  getImprovableProperties(player) {
    return player.properties.filter(property => player.canImproveProperty(property));
  }

  // Mostrar información de monopolios y mejoras
  showPlayerImprovements() {
    const currentPlayer = this.getCurrentPlayer();
    
    if (currentPlayer.monopolies.length === 0) {
      this.logMessage(`📋 ${currentPlayer.name} no tiene monopolios para construir mejoras`);
      return;
    }
    
    this.logMessage(`🏆 Monopolios de ${currentPlayer.name}:`);
    currentPlayer.monopolies.forEach(group => {
      const properties = currentPlayer.properties.filter(p => p.group === group);
      this.logMessage(`  🎨 ${group.toUpperCase()}:`);
      
      properties.forEach(property => {
        const improvements = currentPlayer.propertyImprovements[property.id] || 0;
        const currentRent = currentPlayer.getPropertyRent(property);
        const canImprove = currentPlayer.canImproveProperty(property);
        const improveCost = canImprove ? currentPlayer.getImprovementCost(property) : 0;
        
        let status = `${property.name} - Nivel ${improvements}/3 - Alquiler: $${currentRent.toLocaleString()}`;
        if (canImprove) {
          status += ` - Puede mejorar por $${improveCost.toLocaleString()}`;
        } else if (improvements >= 3) {
          status += ` - ¡Máximo nivel!`;
        }
        
        this.logMessage(`    ${status}`);
      });
    });
  }
}
