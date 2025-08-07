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
  }
  
  drawDice() {
    // Solo dibujar si está animando
    if (!this.isAnimating) {
      return;
    }
    
    // Dibujar un fondo semitransparente con efecto pulsante
    const pulseAlpha = 0.6 + Math.sin(Date.now() * 0.005) * 0.1;
    this.ctx.fillStyle = `rgba(0, 0, 0, ${pulseAlpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibujar sombras de los dados primero
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

  drawDieShadow(die) {
    const ctx = this.ctx;
    const shadowOffset = 5;
    
    // Sombra del dado
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(
      die.x + shadowOffset, 
      die.y + die.bounceOffset + shadowOffset + 5, 
      die.size, 
      die.size
    );
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
    
    // Cuerpo del dado con gradiente
    const gradient = ctx.createLinearGradient(0, 0, die.size, die.size);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(1, '#E0E0E0');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.fillRect(0, 0, die.size, die.size);
    ctx.strokeRect(0, 0, die.size, die.size);
    
    // Dibujar puntos del dado en lugar de número
    this.drawDiceDots(ctx, die.value, die.size);
    
    ctx.restore();
  }

  drawDiceDots(ctx, value, size) {
    const dotSize = size / 12;
    const offset = size / 6;
    const center = size / 2;
    
    ctx.fillStyle = '#333333';
    
    // Función para dibujar un punto
    const drawDot = (x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
      ctx.fill();
    };
    
    // Patrones de puntos para cada valor
    switch(value) {
      case 1:
        drawDot(center, center);
        break;
      case 2:
        drawDot(offset, offset);
        drawDot(size - offset, size - offset);
        break;
      case 3:
        drawDot(offset, offset);
        drawDot(center, center);
        drawDot(size - offset, size - offset);
        break;
      case 4:
        drawDot(offset, offset);
        drawDot(size - offset, offset);
        drawDot(offset, size - offset);
        drawDot(size - offset, size - offset);
        break;
      case 5:
        drawDot(offset, offset);
        drawDot(size - offset, offset);
        drawDot(center, center);
        drawDot(offset, size - offset);
        drawDot(size - offset, size - offset);
        break;
      case 6:
        drawDot(offset, offset);
        drawDot(size - offset, offset);
        drawDot(offset, center);
        drawDot(size - offset, center);
        drawDot(offset, size - offset);
        drawDot(size - offset, size - offset);
        break;
    }
  }

  drawResult() {
    const total = this.finalValues[0] + this.finalValues[1];
    
    this.ctx.save();
    
    // Efecto de brillo en el texto
    this.ctx.shadowColor = '#FFD700';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    
    this.ctx.font = 'bold 32px Arial';
    this.ctx.fillStyle = '#FFD700';
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = 'center';
    
    const text = `${this.finalValues[0]} + ${this.finalValues[1]} = ${total}`;
    const textY = this.canvas.height / 2 + 80;
    
    // Dibujar borde del texto
    this.ctx.strokeText(text, this.canvas.width / 2, textY);
    // Dibujar texto con relleno
    this.ctx.fillText(text, this.canvas.width / 2, textY);
    
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
