'use client';

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  memo
} from 'react';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMUtils } from '@pixiv/three-vrm';
import { VRMAnimationManager } from './VRMAnimationManager';

// Use a dynamic import or require for VRMLoaderPlugin
// @ts-ignore - Temporary fix for VRMLoaderPlugin
const VRMLoaderPlugin = typeof window !== 'undefined' 
  ? require('@pixiv/three-vrm').VRMLoaderPlugin 
  : null;

export interface VRMAvatarHandle {
  speak: (text: string, utterance: SpeechSynthesisUtterance, emotion?: string) => Promise<void>;
  stopSpeaking: () => void;
  setEmotion: (emotion: string) => void;
}

interface Props {
  vrmUrl: string;
  className?: string;
  debug?: boolean;
  onLoaded?: () => void;
}

const VRMAvatar = memo(forwardRef<VRMAvatarHandle, Props>(
  ({ vrmUrl, className = '', debug = true, onLoaded }, ref) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const vrmRef = useRef<VRM | null>(null);
    const animationManagerRef = useRef<VRMAnimationManager | null>(null);
    const animationRef = useRef<number | null>(null);
    const clockRef = useRef(new THREE.Clock());

    const [fps, setFps] = useState(0);
    const frameCountRef = useRef(0);
    const lastFpsUpdateRef = useRef(performance.now());

    const mountedRef = useRef(true);
    const hasLoadedRef = useRef(false);

    useEffect(() => {
      if (!canvasRef.current) return;

      mountedRef.current = true;

      // ---------------- SCENE ----------------
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // ---------------- CAMERA ----------------
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      const camera = new THREE.PerspectiveCamera(
        24,
        width / height,
        0.1,
        100
      );

      camera.position.set(0, 1.4, 1.8);
      camera.lookAt(0, 1.4, 0);
      cameraRef.current = camera;

      // ---------------- RENDERER ----------------
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current = renderer;

      // ---------------- LIGHTS ----------------
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
      mainLight.position.set(1, 2, 2);
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0xffeedd, 0.5);
      fillLight.position.set(-1, 1, 2);
      scene.add(fillLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
      backLight.position.set(0, 1, -2);
      scene.add(backLight);

      // ---------------- LOAD VRM ----------------
      const loader = new GLTFLoader();
      
      // Register VRM plugin with error handling
      try {
        // @ts-ignore - Ignore VRMLoaderPlugin type issues
        const { VRMLoaderPlugin } = require('@pixiv/three-vrm');
        loader.register((parser) => new VRMLoaderPlugin(parser));
      } catch (error) {
        console.error('Failed to load VRMLoaderPlugin:', error);
      }

      loader.load(vrmUrl, (gltf) => {
        if (!mountedRef.current) return;

        // @ts-ignore - VRM type from userData
        const vrm = gltf.userData.vrm as VRM;
        if (!vrm) {
          console.error('No VRM data found in loaded model');
          return;
        }

      scene.add(vrm.scene as any);
        // Position and rotate the model
        vrm.scene.rotation.y = Math.PI;
        vrm.scene.position.y = -0.3;

        // Fix type issue by casting to any
        scene.add(vrm.scene as unknown as THREE.Scene);
        vrmRef.current = vrm;

        // Initialize animation manager
        animationManagerRef.current = new VRMAnimationManager(vrm);

        if (!hasLoadedRef.current) {
          hasLoadedRef.current = true;
          onLoaded?.();
        }
      });

      // ---------------- NATURAL HANDS DOWN POSE ----------------
      const applyNaturalPose = () => {
        if (!vrmRef.current?.humanoid) return;

        const humanoid = vrmRef.current.humanoid;

        const leftUpperArm = humanoid.getNormalizedBoneNode('leftUpperArm');
        const rightUpperArm = humanoid.getNormalizedBoneNode('rightUpperArm');
        const leftLowerArm = humanoid.getNormalizedBoneNode('leftLowerArm');
        const rightLowerArm = humanoid.getNormalizedBoneNode('rightLowerArm');

        if (!leftUpperArm || !rightUpperArm) return;

        // Reset first
        leftUpperArm.rotation.set(0, 0, 0);
        rightUpperArm.rotation.set(0, 0, 0);
        leftLowerArm?.rotation.set(0, 0, 0);
        rightLowerArm?.rotation.set(0, 0, 0);

        // NATURAL INTERVIEWER POSE
        leftUpperArm.rotation.z = 1.2;
        rightUpperArm.rotation.z = -1.2;

        if (leftLowerArm) leftLowerArm.rotation.x = -0.1;
        if (rightLowerArm) rightLowerArm.rotation.x = -0.1;
      };

      // ---------------- ANIMATION LOOP ----------------
      const animate = () => {
        if (!mountedRef.current) return;

        animationRef.current = requestAnimationFrame(animate);

        const delta = clockRef.current.getDelta();

        if (vrmRef.current) {
          vrmRef.current.update(delta);
          applyNaturalPose();
        }

        renderer.render(scene, camera);

        frameCountRef.current++;
        const now = performance.now();
        if (now - lastFpsUpdateRef.current > 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastFpsUpdateRef.current = now;
        }
      };

      animate();

      return () => {
        mountedRef.current = false;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        renderer.dispose();
        scene.clear();
      };

    }, [vrmUrl, onLoaded]);

    // ---------------- SPEAK / EMOTION ----------------
    useImperativeHandle(ref, () => ({
      async speak(
        text: string,
        utterance: SpeechSynthesisUtterance,
        emotion = 'neutral'
      ) {
        return new Promise<void>((resolve) => {
          if (!animationManagerRef.current) {
            resolve();
            return;
          }

          animationManagerRef.current.setEmotion(emotion);

          let lipSyncInterval: NodeJS.Timeout | null = null;

          utterance.onstart = () => {
            console.log("🗣️ Avatar speech started");
            lipSyncInterval = setInterval(() => {
              animationManagerRef.current?.randomMouthMovement();
            }, 120);
          };

          utterance.onend = () => {
            console.log("✅ Avatar speech ended");
            if (lipSyncInterval) clearInterval(lipSyncInterval);
            animationManagerRef.current?.resetMouth();
            resolve();
          };

          utterance.onerror = (event) => {
            console.warn("Speech error:", event);
            if (lipSyncInterval) clearInterval(lipSyncInterval);
            animationManagerRef.current?.resetMouth();
            resolve();
          };

          window.speechSynthesis.speak(utterance);
        });
      },

      stopSpeaking() {
        animationManagerRef.current?.stopLipSync();
        window.speechSynthesis.cancel();
      },

      setEmotion(emotion: string) {
        animationManagerRef.current?.setEmotion(emotion);
      }
    }));

    return (
      <div className={`relative w-full h-full ${className}`}>
        {debug && (
          <div className="absolute top-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded z-20">
            FPS: {fps}
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full rounded-xl" />
      </div>
    );
  }
));

VRMAvatar.displayName = 'VRMAvatar';
export default VRMAvatar;