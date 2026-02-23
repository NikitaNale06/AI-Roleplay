'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, memo } from 'react';
import VRMAvatar, { VRMAvatarHandle } from './VRMAvatar';

interface AvatarSceneProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  onSpeak?: (text: string) => Promise<void>;
  currentText?: string;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'question' | 'greeting' | 'sorry';
}

const AvatarScene = forwardRef<VRMAvatarHandle, AvatarSceneProps>(({
  isSpeaking,
  isListening,
  isThinking,
  onSpeak,
  currentText,
  emotion = 'neutral'
}, ref) => {
  const avatarRef = useRef<VRMAvatarHandle>(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const mountedRef = useRef(true);
  const vrmUrl = useRef('/avatars/interviewer.vrm').current;
  
  // Combine the forwarded ref with internal ref
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(avatarRef.current);
    } else if (ref) {
      ref.current = avatarRef.current;
    }
  }, [ref]);
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Handle emotion changes
  useEffect(() => {
    if (avatarLoaded && avatarRef.current) {
      if (isThinking) {
        avatarRef.current.setEmotion('thinking');
      } else if (isListening) {
        avatarRef.current.setEmotion('question');
      } else {
        avatarRef.current.setEmotion(emotion);
      }
    }
  }, [emotion, isThinking, isListening, avatarLoaded]);
  
  // Handle speaking - this effect just triggers the speech, 
  // but the actual utterance comes from the parent
  useEffect(() => {
    if (isSpeaking && currentText && avatarLoaded && mountedRef.current) {
      // We don't call handleSpeak here anymore - the parent will call avatarRef.current.speak directly
      console.log('Avatar should be speaking:', currentText);
    } else if (!isSpeaking && avatarLoaded && avatarRef.current) {
      avatarRef.current.stopSpeaking();
    }
  }, [isSpeaking, currentText, avatarLoaded]);
  
  const handleAvatarLoaded = useCallback(() => {
    console.log('🎯 Avatar loaded callback received');
    if (mountedRef.current) {
      setAvatarLoaded(true);
    }
  }, []);
  
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-3xl overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* VRM Avatar */}
      <VRMAvatar
        ref={avatarRef}
        vrmUrl={vrmUrl}
        onLoaded={handleAvatarLoaded}
        debug={true}
        className="relative z-10"
      />
      
      {/* Status overlays */}
      {isThinking && (
        <div className="absolute top-4 right-4 bg-purple-500/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-purple-400/50">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          Thinking...
        </div>
      )}
      
      {isListening && (
        <div className="absolute top-4 right-4 bg-blue-500/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-blue-400/50">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          Listening...
        </div>
      )}
      
      {isSpeaking && (
        <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-green-400/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Speaking...
        </div>
      )}
      
      {/* Loading state */}
      {!avatarLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-20">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
            <p className="text-blue-300 font-medium">Initializing AI Interviewer...</p>
          </div>
        </div>
      )}
    </div>
  );
});

AvatarScene.displayName = 'AvatarScene';

export default AvatarScene;