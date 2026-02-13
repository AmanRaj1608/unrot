import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import * as Speech from "expo-speech";
import type { Voice } from "expo-speech";

interface SpeechSettings {
  rate: number;
  pitch: number;
  voiceIdentifier: string | null;
}

interface SpeechContextValue {
  settings: SpeechSettings;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVoice: (identifier: string | null) => void;
  voices: Voice[];
}

const DEFAULT_SETTINGS: SpeechSettings = {
  rate: 0.9,
  pitch: 1.0,
  voiceIdentifier: null,
};

const SpeechContext = createContext<SpeechContextValue>({
  settings: DEFAULT_SETTINGS,
  setRate: () => {},
  setPitch: () => {},
  setVoice: () => {},
  voices: [],
});

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SpeechSettings>(DEFAULT_SETTINGS);
  const [voices, setVoices] = useState<Voice[]>([]);

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((all) => {
      const english = all
        .filter((v) => v.language.startsWith("en"))
        .sort((a, b) => {
          if (a.quality === "Enhanced" && b.quality !== "Enhanced") return -1;
          if (a.quality !== "Enhanced" && b.quality === "Enhanced") return 1;
          return a.name.localeCompare(b.name);
        });
      setVoices(english);
    });
  }, []);

  const setRate = useCallback((rate: number) => {
    setSettings((prev) => ({ ...prev, rate }));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setSettings((prev) => ({ ...prev, pitch }));
  }, []);

  const setVoice = useCallback((voiceIdentifier: string | null) => {
    setSettings((prev) => ({ ...prev, voiceIdentifier }));
  }, []);

  return (
    <SpeechContext.Provider value={{ settings, setRate, setPitch, setVoice, voices }}>
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeechSettings() {
  return useContext(SpeechContext);
}
