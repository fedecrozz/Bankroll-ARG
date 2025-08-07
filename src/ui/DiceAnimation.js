export class DiceAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isAnimating = false;
    this.finalValues = [1, 1];
    this.onComplete = null;
    
    // Propiedades de animación
    this.animationStartTime = 0;
    this.animationDuration = 2000; // 2 segundos de animación
    this.rollDuration = 1500; // 1.5 segundos rodando valores aleatorios
    
    console.log('DiceAnimation creada, canvas:', canvas.width, 'x', canvas.height);
    
    // Propiedades de los dados
    this.dice1 = {
      x: canvas.width / 2 - 80,
      y: canvas.height / 2 - 40,
      size: 60,
      value: 1,
      rotation: 0,
      rotationSpeed: Math.random() * 10 + 5, // Velocidad aleatoria
      bounceOffset: 0,
      bouncePhase: 0
    };
    
    this.dice2 = {
      x: canvas.width / 2 + 20,
      y: canvas.height / 2 - 40,
      size: 60,
      value: 1,
      rotation: 0,
      rotationSpeed: Math.random() * 10 + 8, // Velocidad aleatoria diferente
      bounceOffset: 0,
      bouncePhase: Math.PI / 2 // Desfasado para efecto natural
    };
  }
  
  startAnimation(dice1Value, dice2Value, callback) {
    console.log(`Iniciando animación realista de dados: ${dice1Value} y ${dice2Value}`);
    
    if (this.isAnimating) {
      console.log('Ya hay una animación en curso');
      return;
    }
    
    this.isAnimating = true;
    this.finalValues = [dice1Value, dice2Value];
    this.onComplete = callback;
    this.animationStartTime = Date.now();
    
    // Resetear propiedades de animación
    this.dice1.rotation = 0;
    this.dice2.rotation = 0;
    this.dice1.rotationSpeed = Math.random() * 15 + 10;
    this.dice2.rotationSpeed = Math.random() * 15 + 12;
    this.dice1.bouncePhase = 0;
    this.dice2.bouncePhase = Math.PI / 3;
    
    // Iniciar bucle de animación
    this.animate();
  }

  animate() {
    if (!this.isAnimating) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - this.animationStartTime;
    const progress = Math.min(elapsed / this.animationDuration, 1);
    
    // Durante los primeros 1.5 segundos, rodar valores aleatorios
    if (elapsed < this.rollDuration) {
      // Valores aleatorios mientras ruedan
      this.dice1.value = Math.floor(Math.random() * 6) + 1;
      this.dice2.value = Math.floor(Math.random() * 6) + 1;
      
      // Rotación continua
      this.dice1.rotation += this.dice1.rotationSpeed;
      this.dice2.rotation += this.dice2.rotationSpeed;
      
      // Efecto bounce
      this.dice1.bouncePhase += 0.3;
      this.dice2.bouncePhase += 0.25;
      this.dice1.bounceOffset = Math.sin(this.dice1.bouncePhase) * 10;
      this.dice2.bounceOffset = Math.sin(this.dice2.bouncePhase) * 8;
      
      // Continuar animación
      requestAnimationFrame(() => this.animate());
    } else if (elapsed < this.animationDuration) {
      // Últimos 0.5 segundos: mostrar valores finales con desaceleración
      this.dice1.value = this.finalValues[0];
      this.dice2.value = this.finalValues[1];
      
      // Desacelerar rotación
      const decelerationFactor = 1 - (elapsed - this.rollDuration) / (this.animationDuration - this.rollDuration);
      this.dice1.rotation += this.dice1.rotationSpeed * decelerationFactor;
      this.dice2.rotation += this.dice2.rotationSpeed * decelerationFactor;
      
      // Reducir bounce gradualmente
      const bounceReduction = decelerationFactor;
      this.dice1.bouncePhase += 0.2 * bounceReduction;
      this.dice2.bouncePhase += 0.15 * bounceReduction;
      this.dice1.bounceOffset = Math.sin(this.dice1.bouncePhase) * 5 * bounceReduction;
      this.dice2.bounceOffset = Math.sin(this.dice2.bouncePhase) * 3 * bounceReduction;
      
      requestAnimationFrame(() => this.animate());
    } else {
      // Animación completada
      this.dice1.value = this.finalValues[0];
      this.dice2.value = this.finalValues[1];
      this.dice1.bounceOffset = 0;
      this.dice2.bounceOffset = 0;
      
      console.log('Animación realista completada, ejecutando callback');
      this.isAnimating = false;
      
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  drawDice() {
    // Solo dibujar si está animando
    if (!this.isAnimating) {
      return;
    }
    
    // Fondo que simula una mesa de juego
    this.drawGameTableBackground();
    
    // Dibujar sombras de los dados primero (para que estén debajo)
    this.drawDieShadow(this.dice1);
    this.drawDieShadow(this.dice2);
    
    // Luego dibujar los dados
    this.drawSingleDie(this.dice1);
    this.drawSingleDie(this.dice2);
    
    // Mostrar resultado solo si la animación está cerca del final
    const elapsed = Date.now() - this.animationStartTime;
    if (elapsed > this.rollDuration) {
      this.drawResult();
    }
  }

  drawGameTableBackground() {
    // Fondo que simula una mesa de fieltro verde como en casinos
    const tableGradient = this.ctx.createRadialGradient(
      this.canvas.width/2, this.canvas.height/2, 0,
      this.canvas.width/2, this.canvas.height/2, Math.max(this.canvas.width, this.canvas.height)/2
    );
    tableGradient.addColorStop(0, 'rgba(0, 100, 0, 0.9)');    // Verde fieltro centro
    tableGradient.addColorStop(0.7, 'rgba(0, 80, 0, 0.95)');  // Verde más oscuro
    tableGradient.addColorStop(1, 'rgba(0, 50, 0, 0.98)');    // Verde muy oscuro borde
    
    this.ctx.fillStyle = tableGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Agregar textura sutil de fieltro
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.ctx.fillRect(x, y, 1, 1);
    }
    
    // Líneas sutiles para simular la textura del fieltro
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < 20; i++) {
      this.ctx.beginPath();
      const y = (i / 20) * this.canvas.height;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    
    // Borde de la mesa con efecto de profundidad
    const borderSize = 20;
    const borderGradient = this.ctx.createLinearGradient(0, 0, borderSize, borderSize);
    borderGradient.addColorStop(0, 'rgba(101, 67, 33, 0.8)'); // Madera oscura
    borderGradient.addColorStop(1, 'rgba(139, 69, 19, 0.6)'); // Madera clara
    
    this.ctx.fillStyle = borderGradient;
    // Borde superior
    this.ctx.fillRect(0, 0, this.canvas.width, borderSize);
    // Borde inferior
    this.ctx.fillRect(0, this.canvas.height - borderSize, this.canvas.width, borderSize);
    // Borde izquierdo
    this.ctx.fillRect(0, 0, borderSize, this.canvas.height);
    // Borde derecho
    this.ctx.fillRect(this.canvas.width - borderSize, 0, borderSize, this.canvas.height);
  }

  drawDieShadow(die) {
    const ctx = this.ctx;
    const shadowOffset = 8; // Sombra más prominente
    const bounceHeight = Math.abs(die.bounceOffset);
    
    // Sombra más realista que se adapta a la altura del bounce
    const shadowOpacity = Math.max(0.1, 0.5 - bounceHeight * 0.02);
    const shadowBlur = 5 + bounceHeight * 0.3;
    const shadowSize = die.size + bounceHeight * 0.1;
    
    // Sombra difusa principal
    const shadowGradient = ctx.createRadialGradient(
      die.x + die.size/2 + shadowOffset/2,
      die.y + die.size/2 + shadowOffset + bounceHeight + 10,
      0,
      die.x + die.size/2 + shadowOffset/2,
      die.y + die.size/2 + shadowOffset + bounceHeight + 10,
      shadowSize
    );
    
    shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${shadowOpacity})`);
    shadowGradient.addColorStop(0.5, `rgba(0, 0, 0, ${shadowOpacity * 0.6})`);
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.ellipse(
      die.x + die.size/2 + shadowOffset/2,
      die.y + die.size/2 + shadowOffset + bounceHeight + 10,
      shadowSize * 0.8,
      shadowSize * 0.3, // Sombra elíptica más realista
      0, 0, 2 * Math.PI
    );
    ctx.fill();
    
    // Sombra adicional más suave y extendida
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity * 0.3})`;
    ctx.beginPath();
    ctx.ellipse(
      die.x + die.size/2 + shadowOffset/3,
      die.y + die.size/2 + shadowOffset + bounceHeight + 12,
      shadowSize * 1.2,
      shadowSize * 0.4,
      0, 0, 2 * Math.PI
    );
    ctx.fill();
  }

  drawSingleDie(die) {
    const ctx = this.ctx;
    
    ctx.save();
    
    // Aplicar transformaciones: posición, bounce y rotación
    const centerX = die.x + die.size / 2;
    const centerY = die.y + die.size / 2 + die.bounceOffset;
    
    ctx.translate(centerX, centerY);
    ctx.rotate(die.rotation * Math.PI / 180);
    ctx.translate(-die.size / 2, -die.size / 2);
    
    // Dibujar dado 3D con múltiples caras
    this.draw3DDie(ctx, die.value, die.size);
    
    ctx.restore();
  }

  draw3DDie(ctx, value, size) {
    const depth = size * 0.25; // Más profundidad para mayor realismo
    
    // Colores más realistas de dados reales
    const faceColor = '#F8F8F8';        // Blanco marfil
    const topColor = '#FFFFFF';         // Cara superior más brillante
    const rightColor = '#D8D8D8';       // Cara derecha más oscura
    const shadowColor = '#B8B8B8';      // Sombras más realistas
    
    // Cara frontal principal con textura sutil
    const frontGradient = ctx.createLinearGradient(0, 0, size, size);
    frontGradient.addColorStop(0, faceColor);
    frontGradient.addColorStop(0.3, '#F0F0F0');
    frontGradient.addColorStop(0.7, '#E8E8E8');
    frontGradient.addColorStop(1, '#E0E0E0');
    
    ctx.fillStyle = frontGradient;
    ctx.fillRect(0, 0, size, size);
    
    // Cara derecha con gradiente de profundidad
    const rightGradient = ctx.createLinearGradient(size, 0, size + depth, 0);
    rightGradient.addColorStop(0, rightColor);
    rightGradient.addColorStop(0.5, '#C8C8C8');
    rightGradient.addColorStop(1, shadowColor);
    
    ctx.fillStyle = rightGradient;
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(size + depth, -depth);
    ctx.lineTo(size + depth, size - depth);
    ctx.lineTo(size, size);
    ctx.closePath();
    ctx.fill();
    
    // Cara superior con iluminación natural
    const topGradient = ctx.createLinearGradient(0, 0, 0, -depth);
    topGradient.addColorStop(0, topColor);
    topGradient.addColorStop(0.6, '#F5F5F5');
    topGradient.addColorStop(1, '#E8E8E8');
    
    ctx.fillStyle = topGradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(depth, -depth);
    ctx.lineTo(size + depth, -depth);
    ctx.lineTo(size, 0);
    ctx.closePath();
    ctx.fill();
    
    // Bordes realistas del dado
    ctx.strokeStyle = '#A0A0A0';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Borde cara frontal
    ctx.strokeRect(0, 0, size, size);
    
    // Bordes de las caras 3D
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    
    // Borde cara derecha
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(size + depth, -depth);
    ctx.lineTo(size + depth, size - depth);
    ctx.lineTo(size, size);
    ctx.stroke();
    
    // Borde cara superior
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(depth, -depth);
    ctx.lineTo(size + depth, -depth);
    ctx.lineTo(size, 0);
    ctx.stroke();
    
    // Aristas de conexión entre caras
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(size + depth, -depth);
    ctx.stroke();
    
    // Esquinas redondeadas sutiles en la cara frontal
    this.addCornerDetails(ctx, size);
    
    // Dibujar puntos del dado en la cara frontal
    this.drawRealisticDiceDots(ctx, value, size);
  }

  addCornerDetails(ctx, size) {
    // Pequeños reflejos en las esquinas para simular bordes redondeados
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const cornerSize = size * 0.08;
    
    // Esquina superior izquierda
    ctx.beginPath();
    ctx.arc(cornerSize, cornerSize, cornerSize/2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Esquina superior derecha
    ctx.beginPath();
    ctx.arc(size - cornerSize, cornerSize, cornerSize/2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Esquina inferior izquierda
    ctx.beginPath();
    ctx.arc(cornerSize, size - cornerSize, cornerSize/2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Esquina inferior derecha
    ctx.beginPath();
    ctx.arc(size - cornerSize, size - cornerSize, cornerSize/2, 0, 2 * Math.PI);
    ctx.fill();
  }

  drawRealisticDiceDots(ctx, value, size) {
    const dotSize = size / 8; // Puntos más grandes y realistas
    const offset = size / 4.5; // Mejor posicionamiento
    const center = size / 2;
    
    // Función para dibujar un punto excavado realista
    const drawRealisticDot = (x, y) => {
      // Sombra exterior del hoyo
      const shadowGradient = ctx.createRadialGradient(
        x + dotSize/4, y + dotSize/4, 0,
        x, y, dotSize * 1.2
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(x, y, dotSize * 1.1, 0, 2 * Math.PI);
      ctx.fill();
      
      // Borde del hoyo (más claro)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // Interior del hoyo con gradiente cóncavo
      const holeGradient = ctx.createRadialGradient(
        x - dotSize/3, y - dotSize/3, 0,
        x, y, dotSize
      );
      holeGradient.addColorStop(0, '#C0C0C0'); // Borde más claro
      holeGradient.addColorStop(0.4, '#808080'); // Medio gris
      holeGradient.addColorStop(0.8, '#404040'); // Fondo más oscuro
      holeGradient.addColorStop(1, '#202020'); // Centro muy oscuro
      
      ctx.fillStyle = holeGradient;
      ctx.beginPath();
      ctx.arc(x, y, dotSize * 0.9, 0, 2 * Math.PI);
      ctx.fill();
      
      // Pequeño reflejo en el borde superior del hoyo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(x - dotSize/4, y - dotSize/4, dotSize/4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Sombra interna en el fondo del hoyo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(x + dotSize/6, y + dotSize/6, dotSize/3, 0, 2 * Math.PI);
      ctx.fill();
    };
    
    // Patrones de puntos para cada valor (posiciones clásicas de dados reales)
    switch(value) {
      case 1:
        drawRealisticDot(center, center);
        break;
      case 2:
        drawRealisticDot(offset, offset);
        drawRealisticDot(size - offset, size - offset);
        break;
      case 3:
        drawRealisticDot(offset, offset);
        drawRealisticDot(center, center);
        drawRealisticDot(size - offset, size - offset);
        break;
      case 4:
        drawRealisticDot(offset, offset);
        drawRealisticDot(size - offset, offset);
        drawRealisticDot(offset, size - offset);
        drawRealisticDot(size - offset, size - offset);
        break;
      case 5:
        drawRealisticDot(offset, offset);
        drawRealisticDot(size - offset, offset);
        drawRealisticDot(center, center);
        drawRealisticDot(offset, size - offset);
        drawRealisticDot(size - offset, size - offset);
        break;
      case 6:
        drawRealisticDot(offset, offset);
        drawRealisticDot(size - offset, offset);
        drawRealisticDot(offset, center);
        drawRealisticDot(size - offset, center);
        drawRealisticDot(offset, size - offset);
        drawRealisticDot(size - offset, size - offset);
        break;
    }
  }

  drawResult() {
    const total = this.finalValues[0] + this.finalValues[1];
    
    this.ctx.save();
    
    // Fondo elegante para el resultado
    const resultY = this.canvas.height / 2 + 100;
    const resultWidth = 200;
    const resultHeight = 50;
    const resultX = this.canvas.width / 2 - resultWidth / 2;
    
    // Fondo con gradiente dorado
    const bgGradient = this.ctx.createLinearGradient(
      resultX, resultY - resultHeight/2,
      resultX, resultY + resultHeight/2
    );
    bgGradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
    bgGradient.addColorStop(0.5, 'rgba(255, 193, 7, 0.95)');
    bgGradient.addColorStop(1, 'rgba(255, 152, 0, 0.9)');
    
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(resultX, resultY - resultHeight/2, resultWidth, resultHeight);
    
    // Borde dorado brillante
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(resultX, resultY - resultHeight/2, resultWidth, resultHeight);
    
    // Sombra del fondo
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(resultX + 3, resultY - resultHeight/2 + 3, resultWidth, resultHeight);
    
    // Redibujar el fondo encima de la sombra
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(resultX, resultY - resultHeight/2, resultWidth, resultHeight);
    this.ctx.strokeRect(resultX, resultY - resultHeight/2, resultWidth, resultHeight);
    
    // Efecto de brillo en el texto
    this.ctx.shadowColor = '#FFF700';
    this.ctx.shadowBlur = 15;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    
    // Texto principal más elegante
    this.ctx.font = 'bold 28px serif';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#8B4513';
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = 'center';
    
    const text = `${this.finalValues[0]} + ${this.finalValues[1]} = ${total}`;
    
    // Dibujar contorno del texto
    this.ctx.strokeText(text, this.canvas.width / 2, resultY);
    // Dibujar texto con relleno
    this.ctx.fillText(text, this.canvas.width / 2, resultY);
    
    // Texto decorativo arriba
    this.ctx.font = 'italic 16px serif';
    this.ctx.fillStyle = '#8B4513';
    this.ctx.shadowBlur = 5;
    this.ctx.fillText('RESULTADO', this.canvas.width / 2, resultY - 25);
    
    this.ctx.restore();
  }

  updateCanvasSize() {
    // Actualizar posiciones de los dados cuando cambie el tamaño del canvas
    this.dice1.x = this.canvas.width / 2 - 80;
    this.dice1.y = this.canvas.height / 2 - 40;
    
    this.dice2.x = this.canvas.width / 2 + 20;
    this.dice2.y = this.canvas.height / 2 - 40;
  }
}
