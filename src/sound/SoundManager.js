class SoundManager {
  constructor() {
    // Crear contexto de audio
    this.audioContext = null;
    this.sounds = {};
    this.enabled = true;
    
    // Inicializar contexto de audio
    this.initAudioContext();
    
    // Crear sonidos sintéticos
    this.createSyntheticSounds();
  }
  
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Audio no soportado:', e);
      this.enabled = false;
    }
  }
  
  createSyntheticSounds() {
    if (!this.enabled || !this.audioContext) return;
    
    // Sonido de paso por casillero (beep suave)
    this.sounds.step = {
      frequency: 800,
      duration: 0.1,
      type: 'sine'
    };
    
    // Sonido al pasar por LARGADA
    this.sounds.salary = {
      frequency: 1200,
      duration: 0.3,
      type: 'triangle'
    };
    
    // Sonido de compra
    this.sounds.purchase = {
      frequency: 600,
      duration: 0.2,
      type: 'square'
    };
    
    // Sonido de error/no puede hacer acción
    this.sounds.error = {
      frequency: 300,
      duration: 0.3,
      type: 'sawtooth'
    };
  }
  
  playSound(soundName, volume = 0.1) {
    if (!this.enabled || !this.audioContext || !this.sounds[soundName]) return;
    
    try {
      // Reanudar contexto si está suspendido
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const sound = this.sounds[soundName];
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
      oscillator.type = sound.type;
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration);
    } catch (e) {
      console.warn('Error reproduciendo sonido:', e);
    }
  }
  
  playStep() {
    this.playSound('step', 0.05);
  }
  
  playSalary() {
    this.playSound('salary', 0.1);
  }
  
  playPurchase() {
    this.playSound('purchase', 0.1);
  }
  
  playError() {
    this.playSound('error', 0.1);
  }
  
  enable() {
    this.enabled = true;
  }
  
  disable() {
    this.enabled = false;
  }
  
  toggle() {
    this.enabled = !this.enabled;
  }
}

export default SoundManager;
