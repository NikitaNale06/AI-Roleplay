import { useRef, useState } from "react";

export const useVoiceAnalysis = () => {
  const [transcript, setTranscript] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startVoiceAnalysis = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const ws = new WebSocket(
      "wss://api.deepgram.com/v1/listen?model=nova-2&interim_results=true",
      ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!]
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to Deepgram");
    };

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      const text =
        data.channel?.alternatives?.[0]?.transcript || "";

      if (text) {
        setTranscript((prev) => prev + " " + text);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        ws.send(event.data);
      }
    };

    mediaRecorder.start(250);
  };

  const stopVoiceAnalysis = () => {
    mediaRecorderRef.current?.stop();
    wsRef.current?.close();
  };

  return {
    transcript,
    startVoiceAnalysis,
    stopVoiceAnalysis,
  };
};