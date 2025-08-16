export class DiceAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isAnimating = false;
    this.animationProgress = 0;
    this.dice = [];
    this.diceSize = 60;
    this.shadowOffset = 8;
    this.rotationSpeed = 0.3;
    this.showDice = false; // Nueva propiedad para controlar la visibilidad
    
    // Configuración de colores realistas
    this.colors = {
      face: '#F8F8FF',        // Blanco marfil
      shadow: '#2C2C2C',      // Sombra oscura
      edge: '#E0E0E0',        // Bordes ligeramente grises
      dot: '#1A1A1A',         // Puntos negros
      highlight: '#FFFFFF',    // Brillos blancos
      ambient: '#D0D0D0'      // Luz ambiental
    };
    
    this.initializeDice();
  }
  
  initializeDice() {
    // Inicializar dos dados con posiciones y rotaciones aleatorias
    this.dice = [
      {
        x: this.canvas.width / 2 - 80,
        y: this.canvas.height / 2,
        value: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        velocityX: 0,
        velocityY: 0,
        velocityRotX: 0,
        velocityRotY: 0,
        velocityRotZ: 0,
        bounceHeight: 0,
        settled: false
      },
      {
        x: this.canvas.width / 2 + 20,
        y: this.canvas.height / 2,
        value: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        velocityX: 0,
        velocityY: 0,
        velocityRotX: 0,
        velocityRotY: 0,
        velocityRotZ: 0,
        bounceHeight: 0,
        settled: false
      }
    ];
  }
  
  startAnimation(dice1Value, dice2Value, onComplete) {
    this.isAnimating = true;
    this.showDice = true; // Mostrar dados al iniciar animación
    this.animationProgress = 0;
    this.onComplete = onComplete; // Guardar el callback
    
    // Configurar valores finales
    this.dice[0].finalValue = dice1Value;
    this.dice[1].finalValue = dice2Value;
    
    // Timeout de seguridad para asegurar que la animación termine
    this.safetyTimeout = setTimeout(() => {
      if (this.isAnimating) {
        console.log('Timeout de seguridad: forzando fin de animación');
        this.isAnimating = false;
        // Establecer valores finales
        this.dice[0].value = dice1Value;
        this.dice[1].value = dice2Value;
        this.dice.forEach(die => die.settled = true);
        
        if (this.onComplete) {
          this.onComplete();
          this.onComplete = null;
        }
        
        // Ocultar dados después del timeout de seguridad
        setTimeout(() => {
          this.showDice = false;
          console.log('Dados ocultados por timeout de seguridad');
        }, 1000);
      }
    }, 5000); // 5 segundos máximo
    
    // Configurar física inicial para animación realista
    this.dice.forEach((die, index) => {
      die.value = Math.floor(Math.random() * 6) + 1;
      die.settled = false;
      die.bounceHeight = 0;
      
      // Velocidades iniciales aleatorias para efecto de lanzamiento
      die.velocityX = (Math.random() - 0.5) * 4;
      die.velocityY = (Math.random() - 0.5) * 4;
      die.velocityRotX = (Math.random() - 0.5) * 0.4;
      die.velocityRotY = (Math.random() - 0.5) * 0.4;
      die.velocityRotZ = (Math.random() - 0.5) * 0.4;
      
      // Posición inicial ligeramente desplazada
      die.x = this.canvas.width / 2 + (index === 0 ? -80 : 20) + (Math.random() - 0.5) * 40;
      die.y = this.canvas.height / 2 + (Math.random() - 0.5) * 40;
    });
    
    this.animate();
  }
  
  animate() {
    if (!this.isAnimating) return;
    
    this.animationProgress += 0.016; // ~60fps
    
    // Actualizar física de los dados
    this.dice.forEach((die, index) => {
      if (!die.settled) {
        // Aplicar gravedad y fricción
        die.velocityY += 0.3; // Gravedad
        die.velocityX *= 0.98; // Fricción
        die.velocityY *= 0.98;
        
        // Actualizar posición
        die.x += die.velocityX;
        die.y += die.velocityY;
        
        // Bouncing en los bordes
        const margin = this.diceSize / 2;
        if (die.x < margin || die.x > this.canvas.width - margin) {
          die.velocityX *= -0.7;
          die.x = Math.max(margin, Math.min(this.canvas.width - margin, die.x));
        }
        if (die.y < margin || die.y > this.canvas.height - margin) {
          die.velocityY *= -0.7;
          die.y = Math.max(margin, Math.min(this.canvas.height - margin, die.y));
        }
        
        // Actualizar rotaciones
        die.rotationX += die.velocityRotX;
        die.rotationY += die.velocityRotY;
        die.rotationZ += die.velocityRotZ;
        
        // Reducir velocidades de rotación
        die.velocityRotX *= 0.95;
        die.velocityRotY *= 0.95;
        die.velocityRotZ *= 0.95;
        
        // Cambiar valores durante la animación
        if (Math.random() < 0.15) {
          die.value = Math.floor(Math.random() * 6) + 1;
        }
        
        // Verificar si se ha asentado
        const totalVelocity = Math.abs(die.velocityX) + Math.abs(die.velocityY) + 
                             Math.abs(die.velocityRotX) + Math.abs(die.velocityRotY);
        
        if (totalVelocity < 0.5 && this.animationProgress > 1.0) {
          die.settled = true;
          die.value = die.finalValue;
          die.velocityX = 0;
          die.velocityY = 0;
          die.velocityRotX = 0;
          die.velocityRotY = 0;
          die.velocityRotZ = 0;
          console.log(`Dado ${index + 1} asentado con valor: ${die.value}`);
        }
      }
    });
    
    // Verificar si ambos dados se han asentado
    if (this.dice.every(die => die.settled) && this.animationProgress > 1.5) {
      console.log('Todos los dados asentados, terminando animación...');
      
      // Limpiar timeout de seguridad
      if (this.safetyTimeout) {
        clearTimeout(this.safetyTimeout);
        this.safetyTimeout = null;
      }
      
      setTimeout(() => {
        this.isAnimating = false;
        console.log('Animación terminada, ejecutando callback...');
        // Ejecutar callback cuando termina la animación
        if (this.onComplete) {
          this.onComplete();
          this.onComplete = null; // Limpiar el callback
        }
        
        // Ocultar dados después de 1 segundo adicional
        setTimeout(() => {
          this.showDice = false;
          console.log('Dados ocultados');
        }, 1000);
      }, 300);
    } else {
      requestAnimationFrame(() => this.animate());
    }
  }
  
  drawDice() {
    // Solo dibujar si se deben mostrar los dados
    if (!this.showDice) return;
    
    this.dice.forEach(die => {
      this.ctx.save();
      
      // Mover al centro del dado
      this.ctx.translate(die.x, die.y);
      
      // Dibujar sombra realista
      this.drawShadow(die);
      
      // Aplicar transformaciones 3D simuladas
      this.ctx.save();
      this.ctx.scale(1 + Math.sin(die.rotationY) * 0.1, 1 + Math.sin(die.rotationX) * 0.1);
      this.ctx.rotate(die.rotationZ);
      
      // Dibujar el dado con efecto 3D
      this.drawDie3D(die);
      
      this.ctx.restore();
      this.ctx.restore();
    });
  }
  
  drawShadow(die) {
    const shadowSize = this.diceSize * 0.8;
    const shadowOpacity = 0.3;
    
    this.ctx.save();
    this.ctx.globalAlpha = shadowOpacity;
    this.ctx.fillStyle = this.colors.shadow;
    this.ctx.translate(this.shadowOffset, this.shadowOffset);
    
    // Sombra elíptica más realista
    this.ctx.beginPath();
    this.ctx.ellipse(0, shadowSize * 0.3, shadowSize * 0.7, shadowSize * 0.3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  drawDie3D(die) {
    const size = this.diceSize;
    const half = size / 2;
    
    // Calcular intensidad de luz basada en rotación
    const lightIntensity = 0.5 + 0.5 * Math.cos(die.rotationY);
    
    // Cara frontal (más clara)
    this.ctx.fillStyle = this.interpolateColor(this.colors.face, this.colors.highlight, lightIntensity * 0.3);
    this.drawRoundedRect(-half, -half, size, size, 8);
    this.ctx.fill();
    
    // Bordes 3D - cara derecha
    this.ctx.fillStyle = this.interpolateColor(this.colors.edge, this.colors.ambient, lightIntensity);
    this.ctx.beginPath();
    this.ctx.moveTo(half, -half);
    this.ctx.lineTo(half + 10, -half - 5);
    this.ctx.lineTo(half + 10, half - 5);
    this.ctx.lineTo(half, half);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Bordes 3D - cara superior
    this.ctx.fillStyle = this.interpolateColor(this.colors.edge, this.colors.highlight, lightIntensity * 0.5);
    this.ctx.beginPath();
    this.ctx.moveTo(-half, -half);
    this.ctx.lineTo(-half + 5, -half - 10);
    this.ctx.lineTo(half + 5, -half - 10);
    this.ctx.lineTo(half, -half);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Borde principal del dado
    this.ctx.strokeStyle = this.colors.edge;
    this.ctx.lineWidth = 2;
    this.drawRoundedRect(-half, -half, size, size, 8);
    this.ctx.stroke();
    
    // Dibujar puntos con efecto 3D
    this.drawDots3D(die.value, size);
    
    // Brillo superior
    this.ctx.save();
    this.ctx.globalAlpha = 0.4;
    this.ctx.fillStyle = this.colors.highlight;
    this.ctx.beginPath();
    this.ctx.ellipse(-half * 0.3, -half * 0.3, half * 0.4, half * 0.2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
  
  drawDots3D(value, size) {
    const dotSize = size * 0.12;
    const margin = size * 0.25;
    const positions = this.getDotPositions(value, size, margin);
    
    positions.forEach(pos => {
      // Sombra del punto
      this.ctx.save();
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillStyle = this.colors.shadow;
      this.ctx.beginPath();
      this.ctx.arc(pos.x + 2, pos.y + 2, dotSize, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      
      // Punto principal
      this.ctx.save();
      this.ctx.fillStyle = this.colors.dot;
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, dotSize, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      
      // Brillo del punto
      this.ctx.save();
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillStyle = this.colors.face;
      this.ctx.beginPath();
      this.ctx.arc(pos.x - dotSize * 0.3, pos.y - dotSize * 0.3, dotSize * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }
  
  getDotPositions(value, size, margin) {
    const positions = [];
    
    switch (value) {
      case 1:
        positions.push({x: 0, y: 0});
        break;
      case 2:
        positions.push({x: -margin, y: -margin});
        positions.push({x: margin, y: margin});
        break;
      case 3:
        positions.push({x: -margin, y: -margin});
        positions.push({x: 0, y: 0});
        positions.push({x: margin, y: margin});
        break;
      case 4:
        positions.push({x: -margin, y: -margin});
        positions.push({x: margin, y: -margin});
        positions.push({x: -margin, y: margin});
        positions.push({x: margin, y: margin});
        break;
      case 5:
        positions.push({x: -margin, y: -margin});
        positions.push({x: margin, y: -margin});
        positions.push({x: 0, y: 0});
        positions.push({x: -margin, y: margin});
        positions.push({x: margin, y: margin});
        break;
      case 6:
        positions.push({x: -margin, y: -margin});
        positions.push({x: margin, y: -margin});
        positions.push({x: -margin, y: 0});
        positions.push({x: margin, y: 0});
        positions.push({x: -margin, y: margin});
        positions.push({x: margin, y: margin});
        break;
    }
    
    return positions;
  }
  
  drawRoundedRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }
  
  interpolateColor(color1, color2, factor) {
    // Función para interpolar entre dos colores hexadecimales
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  getCurrentValues() {
    return [this.dice[0].value, this.dice[1].value];
  }
  
  // Método para ocultar dados manualmente
  hideDice() {
    this.showDice = false;
    this.isAnimating = false;
    console.log('Dados ocultados manualmente');
  }
}
