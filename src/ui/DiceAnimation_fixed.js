export class DiceAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isAnimating = false;
    this.finalValues = [1, 1];
    this.onComplete = null;
    
    console.log('DiceAnimation creada, canvas:', canvas.width, 'x', canvas.height);
    
    // Propiedades de los dados
    this.dice1 = {
      x: canvas.width / 2 - 80,
      y: canvas.height / 2 - 40,
      size: 60,
      value: 1
    };
    
    this.dice2 = {
      x: canvas.width / 2 + 20,
      y: canvas.height / 2 - 40,
      size: 60,
      value: 1
    };
  }
  
  startAnimation(dice1Value, dice2Value, callback) {
    console.log(`Iniciando animación de dados: ${dice1Value} y ${dice2Value}`);
    
    if (this.isAnimating) {
      console.log('Ya hay una animación en curso');
      return;
    }
    
    this.isAnimating = true;
    this.finalValues = [dice1Value, dice2Value];
    this.onComplete = callback;
    
    // Establecer valores inmediatamente
    this.dice1.value = dice1Value;
    this.dice2.value = dice2Value;
    
    // Simular animación corta
    setTimeout(() => {
      console.log('Animación completada, ejecutando callback');
      this.isAnimating = false;
      if (this.onComplete) {
        this.onComplete();
      }
    }, 1000); // 1 segundo
  }
  
  drawDice() {
    // Solo dibujar si está animando
    if (!this.isAnimating) {
      return;
    }
    
    console.log(`Dibujando dados: ${this.dice1.value} y ${this.dice2.value}`);
    
    // Dibujar un fondo semitransparente
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawSingleDie(this.dice1);
    this.drawSingleDie(this.dice2);
    
    this.drawResult();
  }
  
  drawSingleDie(die) {
    const ctx = this.ctx;
    
    console.log(`Dibujando dado en posición: ${die.x}, ${die.y}, valor: ${die.value}`);
    
    // Cuerpo del dado
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.fillRect(die.x, die.y, die.size, die.size);
    ctx.strokeRect(die.x, die.y, die.size, die.size);
    
    // Mostrar número grande en el centro
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(die.value.toString(), die.x + die.size / 2, die.y + die.size / 2);
  }
  
  drawResult() {
    const total = this.finalValues[0] + this.finalValues[1];
    
    this.ctx.save();
    this.ctx.font = 'bold 32px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    
    const text = `${this.finalValues[0]} + ${this.finalValues[1]} = ${total}`;
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + 80);
    
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
