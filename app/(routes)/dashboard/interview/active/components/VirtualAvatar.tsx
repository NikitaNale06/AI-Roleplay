'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export type EmotionType = 'neutral' | 'listening' | 'speaking' | 'thinking' | 'happy';

interface AvatarModelProps {
  isSpeaking: boolean;
  emotion?: EmotionType;
  onLoaded?: () => void;
  onError?: (error: string) => void;
  scale?: number;
  position?: [number, number, number];
}

// Use your Ready Player Me URL
const AVATAR_URL = 'https://models.readyplayer.me/692f922edbdba5d65f2217cf.glb';

const emotionConfig: Record<EmotionType, { headRotation: number; eyeScale: number; mouthCurve: number }> = {
  neutral: { headRotation: 0, eyeScale: 1, mouthCurve: 0 },
  listening: { headRotation: 0.05, eyeScale: 1.05, mouthCurve: 0.02 },
  speaking: { headRotation: 0.02, eyeScale: 0.98, mouthCurve: 0.9 },
  thinking: { headRotation: 0.08, eyeScale: 0.9, mouthCurve: 0 },
  happy: { headRotation: 0.05, eyeScale: 1.08, mouthCurve: 0.7 }
};

// Fallback Avatar Component
function FallbackAvatar({ isSpeaking, emotion = 'neutral', scale = 131, position = [0, -22, 0] }: { 
  isSpeaking: boolean; 
  emotion: EmotionType;
  scale?: number;
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  const animState = useRef({
    mouthOpen: 0,
    eyeBlink: 0,
    blinkTimer: 0,
    nextBlink: Math.random() * 100 + 100,
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const config = emotionConfig[emotion];
    
    // Eye blinking only
    animState.current.blinkTimer += 1;
    if (animState.current.blinkTimer >= animState.current.nextBlink) {
      animState.current.blinkTimer = 0;
      animState.current.nextBlink = Math.random() * 150 + 80;
    }
    
    const blinkProgress = animState.current.blinkTimer;
    if (blinkProgress < 8) {
      animState.current.eyeBlink = Math.min(1, blinkProgress / 4);
    } else if (blinkProgress < 15) {
      animState.current.eyeBlink = Math.max(0, 1 - (blinkProgress - 8) / 7);
    } else {
      animState.current.eyeBlink = 0;
    }
    
    if (leftEyeRef.current) leftEyeRef.current.scale.y = 1 - animState.current.eyeBlink * 0.9;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = 1 - animState.current.eyeBlink * 0.9;
    
    // Minimal mouth animation
    if (isSpeaking) {
      const fast = Math.sin(time * 6) * 0.03;
      animState.current.mouthOpen += (Math.abs(fast) - animState.current.mouthOpen) * 0.3;
      
      if (mouthRef.current) {
        mouthRef.current.scale.y = 1 + animState.current.mouthOpen * 0.3;
      }
    } else {
      animState.current.mouthOpen *= 0.85;
      if (mouthRef.current) {
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1, 0.15);
      }
    }
  });

  return (
    <group ref={meshRef} position={position} scale={[scale, scale, scale]}>
      {/* Head */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial color="#e8b89a" roughness={0.8} />
      </mesh>
      
      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.3, 0.1, 0.65]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      
      <mesh ref={rightEyeRef} position={[0.3, 0.1, 0.65]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.08, 0.7]} castShadow>
        <boxGeometry args={[0.4, 0.06, 0.04]} />
        <meshStandardMaterial color="#8b4a4a" />
      </mesh>
    </group>
  );
}

function RPMAvatar({ 
  isSpeaking, 
  emotion = 'neutral', 
  onLoaded, 
  onError,
  scale = 131,
  position = [0, -22, 0]
}: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(AVATAR_URL);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [loadError, setLoadError] = useState(false);
  
  const mouthRef = useRef<THREE.Object3D | null>(null);
  const leftEyeRef = useRef<THREE.Object3D | null>(null);
  const rightEyeRef = useRef<THREE.Object3D | null>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  
  const animState = useRef({
    mouthOpen: 0,
    eyeBlink: 0,
    blinkTimer: 0,
    nextBlink: Math.random() * 100 + 100,
    baseMouthScaleY: 1,
    targetMouthOpen: 0,
    mouthScaleX: 1,
    mouthScaleY: 1
  });

  useEffect(() => {
    try {
      const clonedScene = scene.clone();
      
      // Use adjustable scale and position - ADJUSTED FOR HEAD VISIBILITY
      clonedScene.scale.set(scale, scale, scale);
      clonedScene.position.set(position[0], position[1], position[2]);
      clonedScene.rotation.y = Math.PI; // Face forward
      
      // Find avatar parts
      clonedScene.traverse((child: THREE.Object3D) => {
        const name = child.name.toLowerCase();
        
        // Find head
        if (name.includes('head') || name.includes('head_geo')) {
          if (!headRef.current) {
            headRef.current = child;
          }
        }
        
        // Find mouth/jaw
        if (name.includes('jaw') || name.includes('mouth') || 
            name.includes('teeth') || name.includes('mouth_geo')) {
          if (!mouthRef.current) {
            mouthRef.current = child;
            if (child instanceof THREE.Mesh) {
              animState.current.mouthScaleY = child.scale.y;
              animState.current.mouthScaleX = child.scale.x;
            }
          }
        }
        
        // Find eyes
        if (name.includes('eye') && !name.includes('brow') && !name.includes('lash')) {
          if (name.includes('left') || name.includes('_l')) {
            leftEyeRef.current = child;
          } else if (name.includes('right') || name.includes('_r')) {
            rightEyeRef.current = child;
          }
        }
        
        // Enable shadows
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      setModel(clonedScene);
      if (onLoaded) onLoaded();
      
    } catch (error) {
      console.error('Error loading RPM avatar:', error);
      setLoadError(true);
      if (onError) onError(error instanceof Error ? error.message : 'Failed to load avatar');
    }
  }, [scene, onLoaded, onError, scale, position]);

  useFrame((state) => {
    if (!model) return;
    
    const time = state.clock.elapsedTime;
    const config = emotionConfig[emotion];
    
    // Eye blinking only
    animState.current.blinkTimer += 1;
    if (animState.current.blinkTimer >= animState.current.nextBlink) {
      animState.current.blinkTimer = 0;
      animState.current.nextBlink = Math.random() * 150 + 80;
    }
    
    const blinkProgress = animState.current.blinkTimer;
    if (blinkProgress < 8) {
      animState.current.eyeBlink = Math.min(1, blinkProgress / 4);
    } else if (blinkProgress < 15) {
      animState.current.eyeBlink = Math.max(0, 1 - (blinkProgress - 8) / 7);
    } else {
      animState.current.eyeBlink = 0;
    }
    
    // Apply eye blink
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = config.eyeScale * (1 - animState.current.eyeBlink * 0.9);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = config.eyeScale * (1 - animState.current.eyeBlink * 0.9);
    }
    
    // Minimal lip sync
    if (isSpeaking) {
      const mouthMovement = Math.abs(Math.sin(time * 3)) * 0.03;
      animState.current.targetMouthOpen = mouthMovement;
      animState.current.mouthOpen += (animState.current.targetMouthOpen - animState.current.mouthOpen) * 0.5;
      
      if (mouthRef.current) {
        mouthRef.current.scale.y = animState.current.mouthScaleY * (1 + animState.current.mouthOpen * 0.15);
      }
    } else {
      animState.current.targetMouthOpen = config.mouthCurve;
      animState.current.mouthOpen += (animState.current.targetMouthOpen - animState.current.mouthOpen) * 0.1;
      
      if (mouthRef.current) {
        mouthRef.current.scale.y = animState.current.mouthScaleY * (1 + config.mouthCurve * 0.005);
      }
    }
  });

  if (loadError) {
    return <FallbackAvatar isSpeaking={isSpeaking} emotion={emotion} scale={scale} position={position} />;
  }

  return model ? (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  ) : null;
}

// Preload the GLTF model
useGLTF.preload(AVATAR_URL);

interface AIInterviewerProps {
  isSpeaking?: boolean;
  emotion?: EmotionType;
  onAvatarLoaded?: () => void;
  audioLevel?: number;
}

export default function AIInterviewer({ 
  isSpeaking: externalIsSpeaking, 
  emotion: externalEmotion = 'neutral',
  onAvatarLoaded,
  audioLevel = 0
}: AIInterviewerProps) {
  const [isSpeaking, setIsSpeaking] = useState(externalIsSpeaking ?? false);
  const [emotion, setEmotion] = useState<EmotionType>(externalEmotion);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  // ADJUSTABLE SETTINGS - FROM YOUR SCREENSHOT
  const [avatarScale, setAvatarScale] = useState<number>(131.0); // From screenshot
  const [avatarPositionY, setAvatarPositionY] = useState<number>(-22.0); // ADJUSTED LOWER
  const [cameraPositionZ, setCameraPositionZ] = useState<number>(1.4); // From screenshot
  
  useEffect(() => {
    if (externalIsSpeaking !== undefined) {
      setIsSpeaking(externalIsSpeaking);
    }
  }, [externalIsSpeaking]);
  
  useEffect(() => {
    if (externalEmotion !== undefined) {
      setEmotion(externalEmotion);
    }
  }, [externalEmotion]);
  
  // Auto-demo animation
  useEffect(() => {
    if (externalIsSpeaking === undefined) {
      const interval = setInterval(() => {
        setIsSpeaking(prev => !prev);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [externalIsSpeaking]);
  
  useEffect(() => {
    if (externalEmotion === undefined) {
      if (isSpeaking) {
        setEmotion('speaking');
      } else {
        setEmotion('listening');
      }
    }
  }, [isSpeaking, externalEmotion]);

  const handleAvatarLoaded = () => {
    setAvatarLoaded(true);
    setUseFallback(false);
    if (onAvatarLoaded) onAvatarLoaded();
  };
  
  const handleAvatarError = (error: string) => {
    console.error('Avatar loading error:', error);
    setLoadError(error);
    setUseFallback(true);
    setAvatarLoaded(true);
  };

  // Function to adjust camera when scale changes
  const handleScaleChange = (newScale: number) => {
    setAvatarScale(newScale);
    
    // Lower position to keep full head in view
    const scaleRatio = newScale / 131;
    const newPositionY = -22.0 + ((newScale - 131) * 0.5);
    setAvatarPositionY(Math.max(-30, Math.min(-15, newPositionY)));
    
    // Adjust camera distance
    const newCameraZ = 1.4 * (131 / newScale);
    setCameraPositionZ(Math.max(1.0, Math.min(2.5, newCameraZ)));
  };

  // Function to adjust scale when camera changes
  const handleCameraChange = (newCameraZ: number) => {
    setCameraPositionZ(newCameraZ);
    
    // Adjust scale while keeping head visible
    const cameraRatio = newCameraZ / 1.4;
    const newScale = 131.0 / cameraRatio;
    setAvatarScale(Math.max(100, Math.min(250, newScale)));
    
    // Adjust Y position for full head visibility
    const newPositionY = -22.0 + ((131 - newScale) * 0.5);
    setAvatarPositionY(Math.max(-30, Math.min(-15, newPositionY)));
  };

  // Function to adjust Y position
  const handlePositionYChange = (newPositionY: number) => {
    setAvatarPositionY(newPositionY);
    
    // When moving Y position, adjust scale to keep head visible
    const positionDiff = newPositionY + 22.0;
    const scaleAdjustment = positionDiff * 6;
    const newScale = 131.0 - scaleAdjustment;
    setAvatarScale(Math.max(110, Math.min(250, newScale)));
  };

  return (
    <div className="relative w-full h-full bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, cameraPositionZ], fov: 18 }} // Adjusted FOV
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0.5, cameraPositionZ]} fov={18} />
        
        {/* Minimal controls - fixed view */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          minDistance={1.2}
          maxDistance={1.8}
          target={[0, 0.5, 0]}
          enableDamping
          dampingFactor={0.05}
        />
        
        {/* Lighting optimized */}
        <ambientLight intensity={3.0} color="#ffffff" />
        <directionalLight
          position={[0.6, 1.2, 1.2]} // Main key light
          intensity={2.5}
          castShadow
          color="#ffffff"
        />
        <directionalLight
          position={[-0.6, 0.8, 1.2]} // Fill light
          intensity={1.6}
          color="#f0f0f0"
        />
        <directionalLight
          position={[0, -0.3, 1.5]} // Bottom fill
          intensity={1.0}
          color="#e8e8e8"
        />
        
        {/* Background */}
        <mesh position={[0, 0, -1.5]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial color="#0a0e17" />
        </mesh>
        
        <Suspense fallback={<FallbackAvatar isSpeaking={isSpeaking} emotion={emotion} />}>
          {useFallback ? (
            <FallbackAvatar 
              isSpeaking={isSpeaking} 
              emotion={emotion} 
              scale={avatarScale} 
              position={[0, avatarPositionY, 0]} 
            />
          ) : (
            <RPMAvatar
              isSpeaking={isSpeaking}
              emotion={emotion}
              onLoaded={handleAvatarLoaded}
              onError={handleAvatarError}
              scale={avatarScale}
              position={[0, avatarPositionY, 0]}
            />
          )}
        </Suspense>
      </Canvas>
      
      {!avatarLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading AI Interviewer...</p>
          </div>
        </div>
      )}
      
      {/* DEBUG CONTROLS - Visible only in development */}
      {process.env.NODE_ENV === 'development' && avatarLoaded && (
        <div className="absolute bottom-4 left-4 z-50 bg-black/80 p-4 rounded-lg border border-white/20">
          <div className="text-white text-sm mb-2 font-bold">Avatar Position Controls</div>
          
          <div className="space-y-3">
            <div>
              <label className="text-white text-xs block mb-1">Scale: {avatarScale.toFixed(1)}</label>
              <input 
                type="range" 
                min="100" 
                max="250" 
                step="1"
                value={avatarScale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-white/60 text-xs mt-1">
                Increase for face closeup
              </div>
            </div>
            
            <div>
              <label className="text-white text-xs block mb-1">Position Y: {avatarPositionY.toFixed(1)}</label>
              <input 
                type="range" 
                min="-30" 
                max="-15" 
                step="0.1"
                value={avatarPositionY}
                onChange={(e) => handlePositionYChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-white/60 text-xs mt-1">
                Adjusts vertical face position
              </div>
            </div>
            
            <div>
              <label className="text-white text-xs block mb-1">Camera Z: {cameraPositionZ.toFixed(1)}</label>
              <input 
                type="range" 
                min="1.0" 
                max="2.5" 
                step="0.1"
                value={cameraPositionZ}
                onChange={(e) => handleCameraChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-white/60 text-xs mt-1">
                Distance from avatar
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setAvatarScale(131.0);
                  setAvatarPositionY(-22.0);
                  setCameraPositionZ(1.4);
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex-1"
              >
                Reset to Perfect View
              </button>
              <button 
                onClick={() => {
                  console.log('Current view settings:', {
                    scale: avatarScale,
                    positionY: avatarPositionY,
                    cameraZ: cameraPositionZ
                  });
                  alert(`View Settings:\nScale: ${avatarScale}\nPosition Y: ${avatarPositionY}\nCamera Z: ${cameraPositionZ}`);
                }}
                className="text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded"
              >
                Log Values
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* UI Elements */}
      <div className="absolute top-4 left-4 z-10">
        {/* LIVE badge */}
        <div className="inline-flex items-center gap-2 bg-red-600/90 rounded-full px-3 py-1.5 mb-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-bold">LIVE</span>
        </div>
        
        {/* Status indicators */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="space-y-3">
            <div>
              <div className="text-white text-sm font-medium mb-1">Body</div>
              <div className="text-white text-xl font-bold">0%</div>
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-1">Voice</div>
              <div className="text-white text-xl font-bold">0%</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance and Questions */}
      <div className="absolute top-4 right-4 z-10 space-y-3">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="text-center">
            <div className="text-white text-sm font-medium mb-1">Performance</div>
            <div className="text-white text-xl font-bold">65%</div>
          </div>
        </div>
        
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="text-center">
            <div className="text-white text-sm font-medium mb-1">Questions</div>
            <div className="text-white text-xl font-bold">1/8</div>
          </div>
        </div>
      </div>
      
      {/* Listening indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500' : 'bg-blue-500'}`}></div>
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping"></div>
              )}
            </div>
            <span className="text-white text-sm font-medium">
              {isSpeaking ? 'SPEAKING' : 'LISTENING'}
            </span>
          </div>
        </div>
      </div>
      
      {loadError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-900/80 backdrop-blur-md rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <p className="text-red-200 text-sm">Using fallback avatar</p>
          </div>
        </div>
      )}
    </div>
  );
}