import { boardSpaces, propertyGroups } from './spaces.js';

export class Board {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.spaces = boardSpaces;
    this.groups = propertyGroups;
    
    // Dimensiones del tablero - ajustar al 90% del canvas para dejar margen
    const canvasSize = Math.min(canvas.width, canvas.height);
    this.boardSize = canvasSize * 0.90;
    this.spaceWidth = this.boardSize * 0.125; // Aproximadamente 1/8 del tablero
    this.spaceHeight = this.boardSize * 0.095; // Proporción para que quepan bien
    this.cornerSize = this.boardSize * 0.125;
    
    // Posición del tablero en el canvas - centrado
    this.offsetX = (canvas.width - this.boardSize) / 2;
    this.offsetY = (canvas.height - this.boardSize) / 2;
    
    this.calculateSpacePositions();
  }
  
  calculateSpacePositions() {
    const positions = [];
    const spacesPerSide = 7; // 6 espacios normales + 1 esquina por lado
    
    // Lado inferior (derecha a izquierda)
    for (let i = 0; i < spacesPerSide; i++) {
      if (i === 0) {
        // Esquina inferior derecha (LARGADA)
        positions.push({
          x: this.offsetX + this.boardSize - this.cornerSize,
          y: this.offsetY + this.boardSize - this.cornerSize,
          width: this.cornerSize,
          height: this.cornerSize,
          isCorner: true
        });
      } else {
        positions.push({
          x: this.offsetX + this.boardSize - this.cornerSize - (i * this.spaceWidth),
          y: this.offsetY + this.boardSize - this.spaceHeight,
          width: this.spaceWidth,
          height: this.spaceHeight,
          isCorner: false
        });
      }
    }
    
    // Esquina inferior izquierda (CÁRCEL)
    positions.push({
      x: this.offsetX,
      y: this.offsetY + this.boardSize - this.cornerSize,
      width: this.cornerSize,
      height: this.cornerSize,
      isCorner: true
    });
    
    // Lado izquierdo (abajo hacia arriba)
    for (let i = 1; i < spacesPerSide; i++) {
      positions.push({
        x: this.offsetX,
        y: this.offsetY + this.boardSize - this.cornerSize - (i * this.spaceWidth),
        width: this.spaceHeight,
        height: this.spaceWidth,
        isCorner: false
      });
    }
    
    // Esquina superior izquierda (ESTACIONAMIENTO LIBRE)
    positions.push({
      x: this.offsetX,
      y: this.offsetY,
      width: this.cornerSize,
      height: this.cornerSize,
      isCorner: true
    });
    
    // Lado superior (izquierda a derecha)
    for (let i = 1; i < spacesPerSide; i++) {
      positions.push({
        x: this.offsetX + (i * this.spaceWidth),
        y: this.offsetY,
        width: this.spaceWidth,
        height: this.spaceHeight,
        isCorner: false
      });
    }
    
    // Esquina superior derecha (VE A LA CÁRCEL)
    positions.push({
      x: this.offsetX + this.boardSize - this.cornerSize,
      y: this.offsetY,
      width: this.cornerSize,
      height: this.cornerSize,
      isCorner: true
    });
    
    // Lado derecho (arriba hacia abajo)
    for (let i = 1; i < spacesPerSide; i++) {
      positions.push({
        x: this.offsetX + this.boardSize - this.spaceHeight,
        y: this.offsetY + (i * this.spaceWidth),
        width: this.spaceHeight,
        height: this.spaceWidth,
        isCorner: false
      });
    }
    
    this.spacePositions = positions;
  }
  
  draw() {
    this.drawBoard();
    this.drawSpaces();
    this.drawCenter();
  }
  
  drawBoard() {
    // Fondo del tablero
    this.ctx.fillStyle = '#f0f8ff';
    this.ctx.fillRect(this.offsetX, this.offsetY, this.boardSize, this.boardSize);
    
    // Borde del tablero
    this.ctx.strokeStyle = '#003D82';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(this.offsetX, this.offsetY, this.boardSize, this.boardSize);
    
    // Centro del tablero
    const centerSize = this.boardSize - (this.spaceHeight * 2);
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(
      this.offsetX + this.spaceHeight,
      this.offsetY + this.spaceHeight,
      centerSize,
      centerSize
    );
  }
  
  drawSpaces() {
    this.spaces.forEach((space, index) => {
      this.drawSpace(space, index);
    });
  }
  
  drawSpace(space, index) {
    const pos = this.spacePositions[index];
    if (!pos) return;
    
    // Color de fondo según el tipo de espacio
    let bgColor = '#ffffff';
    if (space.type === 'PROPERTY' && space.group) {
      bgColor = this.groups[space.group].color;
    } else if (space.type === 'START') {
      bgColor = '#00FF00';
    } else if (space.type === 'JAIL') {
      bgColor = '#FFA500';
    } else if (space.type === 'FREE_PARKING') {
      bgColor = '#87CEEB';
    } else if (space.type === 'GO_TO_JAIL') {
      bgColor = '#FF0000';
    } else if (space.type === 'TAX') {
      bgColor = '#FFD700';
    } else if (space.type === 'RAILROAD') {
      bgColor = '#000000';
    } else if (space.type === 'UTILITY') {
      bgColor = '#FFFF00';
    }
    
    // Dibujar fondo del espacio
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(pos.x, pos.y, pos.width, pos.height);
    
    // Borde del espacio
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(pos.x, pos.y, pos.width, pos.height);
    
    // Texto del espacio
    this.drawSpaceText(space, pos);
  }
  
  drawSpaceText(space, pos) {
    this.ctx.fillStyle = space.type === 'RAILROAD' ? '#FFFFFF' : '#000000';
    
    // Ajustar tamaño de fuente según el tamaño del tablero
    const baseFontSize = Math.max(8, this.boardSize / 70);
    this.ctx.font = pos.isCorner ? `${baseFontSize + 2}px Arial` : `${baseFontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Dividir el nombre en líneas si es muy largo
    const words = space.name.split(' ');
    let lines = [];
    
    if (pos.isCorner) {
      // Para las esquinas, usar el nombre completo
      lines = this.wrapText(space.name, pos.width - 10);
    } else {
      // Para espacios normales, abreviar si es necesario
      if (words.length > 1 && space.name.length > 12) {
        lines = words.map(word => word.length > 8 ? word.substring(0, 6) + '.' : word);
      } else {
        lines = this.wrapText(space.name, pos.width - 8);
      }
    }
    
    const lineHeight = pos.isCorner ? baseFontSize + 4 : baseFontSize + 2;
    const startY = pos.y + pos.height/2 - ((lines.length - 1) * lineHeight / 2);
    
    lines.forEach((line, i) => {
      this.ctx.fillText(
        line,
        pos.x + pos.width/2,
        startY + (i * lineHeight)
      );
    });
    
    // Mostrar precio si es una propiedad
    if (space.price && !pos.isCorner) {
      this.ctx.font = `${Math.max(6, baseFontSize - 2)}px Arial`;
      this.ctx.fillText(
        `$${(space.price/1000).toFixed(0)}K`,
        pos.x + pos.width/2,
        pos.y + pos.height - 8
      );
    }
  }
  
  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    
    return lines;
  }
  
  drawCenter() {
    const centerX = this.offsetX + this.boardSize / 2;
    const centerY = this.offsetY + this.boardSize / 2;
    
    // Tamaño de fuente proporcional al tablero
    const baseFontSize = Math.max(16, this.boardSize / 25);
    
    // Logo del juego
    this.ctx.fillStyle = '#003D82';
    this.ctx.font = `bold ${baseFontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('BANKROLL', centerX, centerY - baseFontSize/2);
    
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = `bold ${baseFontSize * 0.75}px Arial`;
    this.ctx.fillText('ARG', centerX, centerY + baseFontSize/3);
    
    // Bandera argentina pequeña - proporcional
    const flagWidth = this.boardSize * 0.12;
    const flagHeight = this.boardSize * 0.08;
    this.drawArgentinianFlag(centerX - flagWidth/2, centerY + baseFontSize, flagWidth, flagHeight);
  }
  
  drawArgentinianFlag(x, y, width, height) {
    // Celeste
    this.ctx.fillStyle = '#007BC7';
    this.ctx.fillRect(x, y, width, height/3);
    this.ctx.fillRect(x, y + (2*height/3), width, height/3);
    
    // Blanco
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(x, y + height/3, width, height/3);
    
    // Sol (simplificado) - tamaño proporcional
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    const sunRadius = Math.max(4, height/5);
    this.ctx.arc(x + width/2, y + height/2, sunRadius, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  
  getSpacePosition(spaceIndex) {
    return this.spacePositions[spaceIndex];
  }
  
  getSpace(spaceIndex) {
    return this.spaces[spaceIndex];
  }
}
