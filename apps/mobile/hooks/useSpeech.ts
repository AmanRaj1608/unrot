import { useState, useCallback, useRef } from "react";
import * as Speech from "expo-speech";
import { setAudioModeAsync } from "expo-audio";
import { useSpeechSettings } from "../lib/SpeechContext";

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioConfigured = useRef(false);
  const { settings } = useSpeechSettings();

  const speak = useCallback(async (text: string) => {
    if (!audioConfigured.current) {
      await setAudioModeAsync({ playsInSilentMode: true });
      audioConfigured.current = true;
    }
    Speech.stop();
    Speech.speak(text, {
      language: "en-US",
      rate: settings.rate,
      pitch: settings.pitch,
      ...(settings.voiceIdentifier ? { voice: settings.voiceIdentifier } : {}),
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: (err) => {
        console.error("Speech error:", err);
        setIsSpeaking(false);
      },
    });
  }, [settings]);

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback(
    (text: string) => {
      if (isSpeaking) {
        stop();
      } else {
        speak(text);
      }
    },
    [isSpeaking, speak, stop]
  );

  return { isSpeaking, speak, stop, toggle };
}
