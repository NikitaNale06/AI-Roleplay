import * as THREE from 'three';
import { VRM } from '@pixiv/three-vrm';

export interface LipSyncFrame {
  expression: string;
  value: number;
  duration: number;
}

export class VRMAnimationManager {
  private vrm: VRM;

  private blinkInterval: NodeJS.Timeout | null = null;
  private headAnimationFrame: number | null = null;

  private isSpeaking = false;
  private mouthValue = 0;

  private headBone: THREE.Object3D | null = null;
  private neutralHeadRotation: THREE.Euler | null = null;

  constructor(vrm: VRM) {
    this.vrm = vrm;
    this.captureNeutralPose();
    this.startBlinking();
    this.startHeadMovement();
    this.applyIdleSmile();
  }

  // ==========================
  // REST POSE
  // ==========================

  private captureNeutralPose() {
    this.headBone =
      this.vrm.humanoid?.getNormalizedBoneNode('head') ||
      this.vrm.humanoid?.getNormalizedBoneNode('neck') ||
      null;

    if (this.headBone) {
      this.neutralHeadRotation = this.headBone.rotation.clone();
    }

    console.log('✅ Head neutral pose captured');
  }

  private resetHeadToNeutral() {
    if (!this.headBone || !this.neutralHeadRotation) return;
    this.headBone.rotation.copy(this.neutralHeadRotation);
  }

  // ==========================
  // BLINK
  // ==========================

  private startBlinking() {
    this.blinkInterval = setInterval(() => {
      this.setExpression('blink', 1);
      setTimeout(() => this.setExpression('blink', 0), 120);
    }, 4000 + Math.random() * 3000);
  }

  // ==========================
  // HEAD MOVEMENT (CONTINUOUS)
  // ==========================

  private startHeadMovement() {
    if (!this.headBone || !this.neutralHeadRotation) return;

    let time = 0;

    const animate = () => {
      if (!this.headBone || !this.neutralHeadRotation) return;

      time += 0.02;
      const intensity = this.isSpeaking ? 0.03 : 0.015;

      this.headBone.rotation.y =
        this.neutralHeadRotation.y + Math.sin(time) * intensity;

      this.headBone.rotation.x =
        this.neutralHeadRotation.x + Math.cos(time * 0.8) * intensity * 0.6;

      this.headAnimationFrame = requestAnimationFrame(animate);
    };

    this.headAnimationFrame = requestAnimationFrame(animate);
  }

  // ==========================
  // EXPRESSIONS
  // ==========================

  private setExpression(name: string, value: number) {
    const exp = this.vrm.expressionManager;
    if (!exp) return;

    try {
      exp.setValue(name as any, Math.max(0, Math.min(1, value)));
    } catch {}
  }

  private resetExpressions() {
    const exp = this.vrm.expressionManager;
    if (!exp) return;

    const expressions = [
      'neutral', 'happy', 'angry', 'sad',
      'surprised', 'blink',
      'aa', 'ee', 'ih', 'oh', 'ou'
    ];

    expressions.forEach(e => {
      try { exp.setValue(e as any, 0); } catch {}
    });
  }

  private applyIdleSmile() {
    this.setExpression('happy', 0.5);
  }

  // ==========================
  // EMOTION
  // ==========================

  public setEmotion(emotion: string) {
    this.resetExpressions();

    switch (emotion) {
      case 'happy':
        this.setExpression('happy', 0.7);
        break;
      case 'thinking':
        this.setExpression('angry', 0.15);
        break;
      case 'question':
        this.setExpression('surprised', 0.25);
        break;
      case 'sorry':
        this.setExpression('sad', 0.3);
        break;
      default:
        this.applyIdleSmile();
        break;
    }
  }

  // ==========================
  // SIMPLE CONTINUOUS LIP SYNC
  // ==========================

  public randomMouthMovement() {
    if (!this.vrm.expressionManager) return;

    this.isSpeaking = true;

    // reduce smile while speaking
    this.setExpression('happy', 0.2);

    const target = 0.35 + Math.random() * 0.15;
    this.mouthValue += (target - this.mouthValue) * 0.4;

    this.setExpression('aa', this.mouthValue);
  }

  public resetMouth() {
    if (!this.vrm.expressionManager) return;

    this.isSpeaking = false;

    this.setExpression('aa', 0);
    this.setExpression('ih', 0);

    this.applyIdleSmile();
  }

  public stopLipSync() {
    this.isSpeaking = false;
    this.resetMouth();
  }

  // ==========================
  // CLEANUP
  // ==========================

  public dispose() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    if (this.headAnimationFrame)
      cancelAnimationFrame(this.headAnimationFrame);

    this.resetHeadToNeutral();
    this.resetExpressions();
  }
}