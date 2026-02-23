declare module '@pixiv/three-vrm' {
  import { Object3D, AnimationMixer, Scene, Group } from 'three';
  
  export type VRMExpressionPresetName = 
    | 'neutral'
    | 'aa'
    | 'ee'
    | 'ih'
    | 'oh'
    | 'ou'
    | 'blink'
    | 'blink_l'
    | 'blink_r'
    | 'lookup'
    | 'lookdown'
    | 'lookleft'
    | 'lookright'
    | 'happy'
    | 'angry'
    | 'sad'
    | 'relaxed'
    | 'surprised'
    | 'extra';
  
  export interface VRMExpressionManager {
    setValue(name: VRMExpressionPresetName, value: number): void;
    getValue(name: VRMExpressionPresetName): number;
  }
  
  export interface VRMHumanoid {
    getNormalizedBoneNode(name: string): Object3D | null;
  }
  
  export interface VRM {
    scene: Group;
    humanoid: VRMHumanoid;
    expressionManager: VRMExpressionManager;
    update(delta: number): void;
  }
  
  export class VRMUtils {
    static removeUnnecessaryJoints(scene: Scene): void;
  }
  
  export function VRM(gltf: any): Promise<VRM>;
}