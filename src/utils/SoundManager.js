/**
 * Administrador de sonidos para Bankroll ARG
 * Maneja la reproducción de efectos de sonido del juego
 */
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.7;
    this.initializeSounds();
  }

  /**
   * Inicializar los sonidos del juego
   */
  initializeSounds() {
    // Crear sonido de caja registradora usando Web Audio API
    this.sounds.cashRegister = this.createCashRegisterSound();
    
    // También crear un sonido alternativo con Audio para mayor compatibilidad
    this.sounds.coin = this.createCoinSound();
  }

  /**
   * Crear sonido de caja registradora usando Web Audio API
   */
  createCashRegisterSound() {
    return () => {
      if (!this.enabled) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Sonido de "cha-ching" de caja registradora
        const playTone = (frequency, startTime, duration, volume = 0.3) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, startTime);
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(volume * this.volume, startTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };
        
        const currentTime = audioContext.currentTime;
        
        // Secuencia de tonos para simular caja registradora
        playTone(800, currentTime, 0.1, 0.4); // "Cha"
        playTone(600, currentTime + 0.05, 0.1, 0.3);
        playTone(1200, currentTime + 0.15, 0.3, 0.5); // "Ching"
        playTone(900, currentTime + 0.2, 0.25, 0.4);
        
        // Sonido de campana al final
        playTone(1600, currentTime + 0.4, 0.2, 0.3);
        
      } catch (error) {
        console.warn('Error al reproducir sonido de caja registradora:', error);
        // Fallback a sonido simple
        this.sounds.coin();
      }
    };
  }

  /**
   * Crear sonido de moneda simple como fallback
   */
  createCoinSound() {
    return () => {
      if (!this.enabled) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
      } catch (error) {
        console.warn('Error al reproducir sonido de moneda:', error);
      }
    };
  }

  /**
   * Reproducir sonido de caja registradora para transacciones
   */
  playCashRegister() {
    if (this.sounds.cashRegister) {
      this.sounds.cashRegister();
    }
  }

  /**
   * Reproducir sonido de moneda
   */
  playCoin() {
    if (this.sounds.coin) {
      this.sounds.coin();
    }
  }

  /**
   * Reproducir sonido para compras
   */
  playPurchase() {
    this.playCashRegister();
  }

  /**
   * Reproducir sonido para pagos (alquileres, impuestos, etc.)
   */
  playPayment() {
    this.playCashRegister();
  }

  /**
   * Habilitar/deshabilitar sonidos
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Configurar volumen (0.0 a 1.0)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Obtener estado de sonidos
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Obtener volumen actual
   */
  getVolume() {
    return this.volume;
  }
}

export default SoundManager;
