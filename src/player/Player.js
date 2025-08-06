export class Player {
  constructor(id, name, color, startingMoney = 1500000) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.money = startingMoney;
    this.position = 0; // Comienza en la casilla 0 (LARGADA)
    this.properties = [];
    this.railroads = [];
    this.utilities = [];
    this.isInJail = false;
    this.jailTurns = 0;
    this.getOutOfJailFreeCards = 0;
    this.bankrupt = false;
    
    // Para la animación en el tablero
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.isMoving = false;
  }
  
  // Mover el jugador a una nueva posición
  moveTo(newPosition, board) {
    const oldPosition = this.position;
    this.position = newPosition;
    
    // Actualizar posición visual
    this.updateVisualPosition(board);
    
    // Verificar si pasó por LARGADA
    if (oldPosition > newPosition || (oldPosition < 28 && newPosition >= 28)) {
      this.collectSalary();
    }
    
    this.position = this.position % 28; // El tablero tiene 28 casilleros
  }
  
  // Mover el jugador una cantidad específica de espacios
  move(spaces, board) {
    const newPosition = (this.position + spaces) % 28;
    this.moveTo(newPosition, board);
  }
  
  // Actualizar la posición visual del jugador en el tablero
  updateVisualPosition(board) {
    const spacePos = board.getSpacePosition(this.position);
    if (spacePos) {
      // Offset para múltiples jugadores en la misma casilla, proporcional al tablero
      const baseOffset = Math.max(4, board.boardSize / 100);
      const offset = this.id * baseOffset;
      this.targetX = spacePos.x + spacePos.width/2 + offset - baseOffset;
      this.targetY = spacePos.y + spacePos.height/2 + offset - baseOffset;
    }
  }
  
  // Cobrar salario al pasar por LARGADA
  collectSalary() {
    const salary = 200000;
    this.money += salary;
    return salary;
  }
  
  // Pagar dinero
  pay(amount) {
    if (this.money >= amount) {
      this.money -= amount;
      return true;
    } else {
      // No tiene suficiente dinero
      return false;
    }
  }
  
  // Recibir dinero
  receive(amount) {
    this.money += amount;
  }
  
  // Comprar una propiedad
  buyProperty(property) {
    if (this.money >= property.price) {
      this.money -= property.price;
      this.properties.push(property);
      property.owner = this.id;
      return true;
    }
    return false;
  }
  
  // Comprar un ferrocarril
  buyRailroad(railroad) {
    if (this.money >= railroad.price) {
      this.money -= railroad.price;
      this.railroads.push(railroad);
      railroad.owner = this.id;
      return true;
    }
    return false;
  }
  
  // Comprar un servicio público
  buyUtility(utility) {
    if (this.money >= utility.price) {
      this.money -= utility.price;
      this.utilities.push(utility);
      utility.owner = this.id;
      return true;
    }
    return false;
  }
  
  // Verificar si posee todas las propiedades de un grupo
  ownsCompleteGroup(group, allProperties) {
    const groupProperties = allProperties.filter(prop => prop.group === group);
    const ownedInGroup = this.properties.filter(prop => prop.group === group);
    return groupProperties.length === ownedInGroup.length;
  }
  
  // Calcular la renta de una propiedad
  calculateRent(property, allProperties, diceRoll = 0) {
    if (property.type === 'PROPERTY') {
      let rent = property.rent[0]; // Renta base
      
      // Si posee todo el grupo, dobla la renta
      if (this.ownsCompleteGroup(property.group, allProperties)) {
        rent *= 2;
      }
      
      // TODO: Agregar lógica para casas y hoteles
      return rent;
    } else if (property.type === 'RAILROAD') {
      const railroadsOwned = this.railroads.length;
      return property.rent[railroadsOwned - 1] || 0;
    } else if (property.type === 'UTILITY') {
      const utilitiesOwned = this.utilities.length;
      const multiplier = utilitiesOwned === 1 ? 4 : 10;
      return diceRoll * multiplier * 1000; // Multiplicar por 1000 para ajustar a pesos argentinos
    }
    
    return 0;
  }
  
  // Ir a la cárcel
  goToJail() {
    this.position = 7; // Posición de la cárcel
    this.isInJail = true;
    this.jailTurns = 0;
  }
  
  // Intentar salir de la cárcel
  tryToGetOutOfJail(diceRoll1, diceRoll2) {
    if (!this.isInJail) return true;
    
    this.jailTurns++;
    
    // Salir con dobles
    if (diceRoll1 === diceRoll2) {
      this.isInJail = false;
      this.jailTurns = 0;
      return true;
    }
    
    // Después de 3 turnos, debe pagar
    if (this.jailTurns >= 3) {
      this.payToGetOutOfJail();
      return true;
    }
    
    return false;
  }
  
  // Pagar para salir de la cárcel
  payToGetOutOfJail() {
    const fine = 50000;
    if (this.pay(fine)) {
      this.isInJail = false;
      this.jailTurns = 0;
      return true;
    }
    return false;
  }
  
  // Usar carta para salir de la cárcel
  useGetOutOfJailFreeCard() {
    if (this.getOutOfJailFreeCards > 0) {
      this.getOutOfJailFreeCards--;
      this.isInJail = false;
      this.jailTurns = 0;
      return true;
    }
    return false;
  }
  
  // Verificar si el jugador está en bancarrota
  checkBankruptcy() {
    // TODO: Implementar lógica para calcular activos totales
    this.bankrupt = this.money <= 0 && this.properties.length === 0;
    return this.bankrupt;
  }
  
  // Obtener el patrimonio total del jugador
  getTotalWealth() {
    let total = this.money;
    
    // Sumar valor de propiedades
    this.properties.forEach(prop => {
      total += prop.price;
    });
    
    // Sumar valor de ferrocarriles
    this.railroads.forEach(railroad => {
      total += railroad.price;
    });
    
    // Sumar valor de servicios
    this.utilities.forEach(utility => {
      total += utility.price;
    });
    
    return total;
  }
  
  // Dibujar el jugador en el tablero
  draw(ctx, board) {
    // Interpolación suave para la animación
    if (this.isMoving) {
      const speed = 0.2;
      this.x += (this.targetX - this.x) * speed;
      this.y += (this.targetY - this.y) * speed;
      
      if (Math.abs(this.targetX - this.x) < 1 && Math.abs(this.targetY - this.y) < 1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isMoving = false;
      }
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }
    
    // Tamaño del token proporcional al tablero
    const tokenRadius = board ? Math.max(6, board.boardSize / 80) : 8;
    const tokenOffset = tokenRadius - 2;
    
    // Dibujar el token del jugador
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x + tokenOffset, this.y + tokenOffset, tokenRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Borde del token
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(1, tokenRadius / 4);
    ctx.stroke();
    
    // Inicial del jugador
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(8, tokenRadius)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.name.charAt(0), this.x + tokenOffset, this.y + tokenOffset);
    
    // Indicador de cárcel
    if (this.isInJail) {
      ctx.fillStyle = '#FF0000';
      ctx.font = `${Math.max(6, tokenRadius - 2)}px Arial`;
      ctx.fillText('🔒', this.x + tokenOffset, this.y - tokenRadius);
    }
  }
  
  // Obtener información del jugador para la UI
  getInfo() {
    return {
      name: this.name,
      money: this.money,
      position: this.position,
      properties: this.properties.length,
      railroads: this.railroads.length,
      utilities: this.utilities.length,
      isInJail: this.isInJail,
      jailTurns: this.jailTurns,
      totalWealth: this.getTotalWealth()
    };
  }
}
