import Voice, { SpeechErrorEvent, SpeechResultsEvent } from "@react-native-community/voice";
import { useEffect, useState } from "react";

export default function useVoiceRecorder(onSpeechResult: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  console.log('Voice module:', Voice);

  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        onSpeechResult(e.value[0]);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.error("Voice error:", e);
      setIsRecording(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSpeechResult]);

  const toggleRecording = async () => {
    if (isRecording) {
      try {
        await Voice.stop();
        setIsRecording(false);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    } else {
      try {
        await Voice.start("en-US");
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  return { isRecording, toggleRecording };
}
