// Natural blinking and idle movements

export class AvatarExpressionManager {
  private blinkInterval: NodeJS.Timeout | null = null;
  private eyeMovementInterval: NodeJS.Timeout | null = null;
  private headMovementInterval: NodeJS.Timeout | null = null;
  private expressionCallback: (expression: string, value: number) => void;
  
  constructor(callback: (expression: string, value: number) => void) {
    this.expressionCallback = callback;
  }
  
  startIdleAnimations() {
    // Natural blinking (every 3-7 seconds)
    this.blinkInterval = setInterval(() => {
      // Quick blink
      this.expressionCallback('blink', 1.0);
      setTimeout(() => this.expressionCallback('blink', 0.0), 150);
    }, 3000 + Math.random() * 4000);
    
    // Subtle eye movement (look around naturally)
    this.eyeMovementInterval = setInterval(() => {
      // Slight eye movement to look more natural
      const randomX = (Math.random() - 0.5) * 0.3;
      const randomY = (Math.random() - 0.5) * 0.2;
      // This would control eye bones if your VRM supports it
    }, 5000 + Math.random() * 3000);
    
    // Subtle head movement (tiny nods/shakes)
    this.headMovementInterval = setInterval(() => {
      // Tiny head movements make avatar feel alive
      // This would control head rotation slightly
    }, 8000 + Math.random() * 5000);
  }
  
  stopIdleAnimations() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    if (this.eyeMovementInterval) clearInterval(this.eyeMovementInterval);
    if (this.headMovementInterval) clearInterval(this.headMovementInterval);
  }
  
  setExpression(expression: string, intensity: number = 1.0) {
    // Map emotions to VRM blend shapes
    switch (expression) {
      case 'happy':
        this.expressionCallback('happy', intensity * 0.8);
        this.expressionCallback('relaxed', intensity * 0.3);
        break;
      case 'thinking':
        this.expressionCallback('thinking', intensity * 0.7);
        this.expressionCallback('angry', intensity * 0.1); // slight furrow
        break;
      case 'question':
        this.expressionCallback('surprised', intensity * 0.4);
        this.expressionCallback('thinking', intensity * 0.3);
        break;
      case 'greeting':
        this.expressionCallback('happy', intensity * 0.6);
        this.expressionCallback('relaxed', intensity * 0.4);
        break;
      case 'sorry':
        this.expressionCallback('sorrow', intensity * 0.5);
        this.expressionCallback('relaxed', intensity * 0.2);
        break;
      case 'neutral':
      default:
        this.expressionCallback('neutral', 1.0);
        break;
    }
  }
  
  resetAll() {
    this.expressionCallback('neutral', 1.0);
    this.expressionCallback('blink', 0.0);
    this.expressionCallback('happy', 0.0);
    this.expressionCallback('angry', 0.0);
    this.expressionCallback('sorrow', 0.0);
    this.expressionCallback('surprised', 0.0);
    this.expressionCallback('thinking', 0.0);
    this.expressionCallback('relaxed', 0.0);
  }
}