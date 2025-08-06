import { Board } from '../board/Board.js';
import { Player } from '../player/Player.js';
import { communityChestCards, chanceCards, shuffleCards } from '../board/cards.js';
import { boardSpaces } from '../board/spaces.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new Board(canvas, this.ctx);
    
    // Estado del juego
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gamePhase = 'SETUP'; // SETUP, PLAYING, GAME_OVER
    this.winner = null;
    this.diceRoll = [0, 0];
    this.canRollDice = true;
    this.canBuyProperty = false;
    this.canEndTurn = false;
    
    // Límites de dinero para terminar el juego
    this.winLimit = 7500000; // $7.500.000 para ganar
    this.bankruptLimit = -1000000; // -$1.000.000 para quiebra
    
    // Configuración de jugadores
    this.minPlayers = 2;
    this.maxPlayers = 5;
    this.selectedPlayerCount = 2; // Por defecto 2 jugadores
    
    // Cartas
    this.communityChestDeck = shuffleCards(communityChestCards);
    this.chanceDeck = shuffleCards(chanceCards);
    this.communityChestIndex = 0;
    this.chanceIndex = 0;
    
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
  
  initializeGame() {
    // Limpiar jugadores anteriores
    this.players = [];
    this.currentPlayerIndex = 0;
    this.winner = null;
    
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
    
    this.gamePhase = 'PLAYING';
    this.logMessage(`¡Comienza la partida con ${this.selectedPlayerCount} jugadores!`);
    this.logMessage(`🏆 Meta: Conseguir $${this.winLimit.toLocaleString()} o evitar llegar a $${this.bankruptLimit.toLocaleString()}`);
    this.logMessage(`Turno de ${this.getCurrentPlayer().name}`);
    this.updateGameState();
  }
  
  addPlayer(name, color) {
    const player = new Player(this.players.length, name, color);
    this.players.push(player);
    return player;
  }
  
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }
  
  rollDice() {
    if (!this.canRollDice || this.gamePhase !== 'PLAYING') return [0, 0];
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    this.diceRoll = [dice1, dice2];
    
    const currentPlayer = this.getCurrentPlayer();
    const total = dice1 + dice2;
    
    this.logMessage(`${currentPlayer.name} tiró los dados: ${dice1} + ${dice2} = ${total}`);
    
    // Verificar si está en la cárcel
    if (currentPlayer.isInJail) {
      if (currentPlayer.tryToGetOutOfJail(dice1, dice2)) {
        this.logMessage(`${currentPlayer.name} sale de la cárcel!`);
        this.movePlayer(total);
      } else {
        this.logMessage(`${currentPlayer.name} permanece en la cárcel (turno ${currentPlayer.jailTurns}/3)`);
        this.endTurn();
      }
    } else {
      this.movePlayer(total);
    }
    
    this.canRollDice = false;
    this.updateGameState();
    
    return this.diceRoll;
  }
  
  movePlayer(spaces) {
    const currentPlayer = this.getCurrentPlayer();
    const oldPosition = currentPlayer.position;
    
    currentPlayer.move(spaces, this.board);
    currentPlayer.isMoving = true;
    
    this.logMessage(`${currentPlayer.name} se mueve de ${this.board.getSpace(oldPosition).name} a ${this.board.getSpace(currentPlayer.position).name}`);
    
    // Procesar la llegada a la nueva casilla después de un breve delay
    setTimeout(() => {
      this.processSpaceLanding();
    }, 500);
  }
  
  processSpaceLanding() {
    const currentPlayer = this.getCurrentPlayer();
    const space = this.board.getSpace(currentPlayer.position);
    
    this.logMessage(`${currentPlayer.name} llega a ${space.name}`);
    
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
      case 'GO_TO_JAIL':
        this.handleGoToJail();
        break;
      case 'START':
        this.logMessage(`${currentPlayer.name} está en LARGADA!`);
        this.canEndTurn = true;
        break;
      case 'JAIL':
        this.logMessage(`${currentPlayer.name} está de visita en la cárcel`);
        this.canEndTurn = true;
        break;
      case 'FREE_PARKING':
        this.logMessage(`${currentPlayer.name} descansa en el estacionamiento libre`);
        this.canEndTurn = true;
        break;
    }
    
    this.updateGameState();
  }
  
  handlePropertyLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (!space.owner) {
      // Propiedad disponible para comprar
      this.canBuyProperty = true;
      this.logMessage(`${space.name} está disponible por $${space.price.toLocaleString()}`);
    } else if (space.owner !== currentPlayer.id) {
      // Pagar renta al propietario
      const owner = this.players[space.owner];
      const rent = owner.calculateRent(space, boardSpaces);
      
      if (currentPlayer.pay(rent)) {
        owner.receive(rent);
        this.logMessage(`${currentPlayer.name} paga $${rent.toLocaleString()} de alquiler a ${owner.name}`);
      } else {
        this.logMessage(`${currentPlayer.name} no puede pagar el alquiler!`);
        // TODO: Manejar bancarrota
      }
      this.canEndTurn = true;
    } else {
      this.logMessage(`${currentPlayer.name} está en su propia propiedad`);
      this.canEndTurn = true;
    }
  }
  
  handleRailroadLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (!space.owner) {
      this.canBuyProperty = true;
      this.logMessage(`${space.name} está disponible por $${space.price.toLocaleString()}`);
    } else if (space.owner !== currentPlayer.id) {
      const owner = this.players[space.owner];
      const rent = owner.calculateRent(space, boardSpaces);
      
      if (currentPlayer.pay(rent)) {
        owner.receive(rent);
        this.logMessage(`${currentPlayer.name} paga $${rent.toLocaleString()} por usar ${space.name}`);
      } else {
        this.logMessage(`${currentPlayer.name} no puede pagar!`);
      }
      this.canEndTurn = true;
    } else {
      this.logMessage(`${currentPlayer.name} está en su propio transporte`);
      this.canEndTurn = true;
    }
  }
  
  handleUtilityLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (!space.owner) {
      this.canBuyProperty = true;
      this.logMessage(`${space.name} está disponible por $${space.price.toLocaleString()}`);
    } else if (space.owner !== currentPlayer.id) {
      const owner = this.players[space.owner];
      const diceTotal = this.diceRoll[0] + this.diceRoll[1];
      const rent = owner.calculateRent(space, boardSpaces, diceTotal);
      
      if (currentPlayer.pay(rent)) {
        owner.receive(rent);
        this.logMessage(`${currentPlayer.name} paga $${rent.toLocaleString()} por usar ${space.name}`);
      } else {
        this.logMessage(`${currentPlayer.name} no puede pagar!`);
      }
      this.canEndTurn = true;
    } else {
      this.logMessage(`${currentPlayer.name} está en su propio servicio`);
      this.canEndTurn = true;
    }
  }
  
  handleTaxLanding(space) {
    const currentPlayer = this.getCurrentPlayer();
    
    if (currentPlayer.pay(space.amount)) {
      this.logMessage(`${currentPlayer.name} paga $${space.amount.toLocaleString()} en impuestos`);
    } else {
      this.logMessage(`${currentPlayer.name} no puede pagar los impuestos!`);
      // TODO: Manejar bancarrota
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
  
  handleGoToJail() {
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.goToJail();
    currentPlayer.updateVisualPosition(this.board);
    this.logMessage(`${currentPlayer.name} va directo a la cárcel!`);
    this.canEndTurn = true;
  }
  
  buyProperty() {
    if (!this.canBuyProperty) return false;
    
    const currentPlayer = this.getCurrentPlayer();
    const space = this.board.getSpace(currentPlayer.position);
    
    let success = false;
    
    if (space.type === 'PROPERTY') {
      success = currentPlayer.buyProperty(space);
    } else if (space.type === 'RAILROAD') {
      success = currentPlayer.buyRailroad(space);
    } else if (space.type === 'UTILITY') {
      success = currentPlayer.buyUtility(space);
    }
    
    if (success) {
      this.logMessage(`${currentPlayer.name} compra ${space.name} por $${space.price.toLocaleString()}`);
      this.canBuyProperty = false;
      this.canEndTurn = true;
    } else {
      this.logMessage(`${currentPlayer.name} no tiene suficiente dinero para comprar ${space.name}`);
    }
    
    this.updateGameState();
    return success;
  }
  
  checkGameEnd() {
    // Verificar si algún jugador ganó o perdió
    for (let player of this.players) {
      if (player.money >= this.winLimit) {
        this.winner = player;
        this.gamePhase = 'GAME_OVER';
        this.logMessage(`🎉 ¡${player.name} GANA! Consiguió $${player.money.toLocaleString()}`);
        this.logMessage(`🏆 ¡Felicitaciones! Has conquistado Argentina económicamente!`);
        if (this.onGameOver) {
          this.onGameOver(player, 'WIN');
        }
        return true;
      }
      
      if (player.money <= this.bankruptLimit) {
        this.winner = null;
        this.gamePhase = 'GAME_OVER';
        this.logMessage(`💸 ${player.name} queda en bancarrota con $${player.money.toLocaleString()}`);
        this.logMessage(`💀 ¡Game Over! La crisis económica te derrotó!`);
        if (this.onGameOver) {
          this.onGameOver(player, 'BANKRUPTCY');
        }
        return true;
      }
    }
    
    return false;
  }
  
  endTurn() {
    if (!this.canEndTurn && this.canRollDice) return;
    
    const currentPlayer = this.getCurrentPlayer();
    
    // Verificar condiciones de fin de juego después de cada turno
    if (this.checkGameEnd()) {
      this.updateGameState();
      return;
    }
    
    // Verificar si sacó dobles y no está en la cárcel
    const isDoubles = this.diceRoll[0] === this.diceRoll[1];
    if (isDoubles && !currentPlayer.isInJail && this.diceRoll[0] > 0) {
      this.logMessage(`${currentPlayer.name} sacó dobles! Tira otra vez.`);
      this.canRollDice = true;
      this.canEndTurn = false;
      this.canBuyProperty = false;
    } else {
      // Pasar al siguiente jugador
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      
      // Verificar nuevamente después del cambio de jugador
      if (!this.checkGameEnd()) {
        this.logMessage(`Turno de ${this.getCurrentPlayer().name}`);
        this.canRollDice = true;
        this.canEndTurn = false;
        this.canBuyProperty = false;
        this.diceRoll = [0, 0];
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
    if (this.onGameStateChange) {
      this.onGameStateChange({
        currentPlayer: this.getCurrentPlayer(),
        canRollDice: this.canRollDice && this.gamePhase === 'PLAYING',
        canBuyProperty: this.canBuyProperty && this.gamePhase === 'PLAYING',
        canEndTurn: this.canEndTurn && this.gamePhase === 'PLAYING',
        diceRoll: this.diceRoll,
        players: this.players.map(p => p.getInfo()),
        gamePhase: this.gamePhase,
        winner: this.winner,
        selectedPlayerCount: this.selectedPlayerCount,
        minPlayers: this.minPlayers,
        maxPlayers: this.maxPlayers,
        winLimit: this.winLimit,
        bankruptLimit: this.bankruptLimit
      });
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
    this.showGameSetup();
  }
}
