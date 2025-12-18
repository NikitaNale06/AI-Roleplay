// types/readyplayerme.d.ts
export {};

declare global {
  interface Window {
    RPM: {
      Avatar: new (container: HTMLElement, options: {
        url: string;
        animation?: string;
        onLoad?: () => void;
        onError?: (error: any) => void;
      }) => {
        load: () => Promise<void>;
        playAnimation: (animation: string) => void;
        setEmotion: (emotion: string) => void;
        dispose: () => void;
      };
    };
  }
}