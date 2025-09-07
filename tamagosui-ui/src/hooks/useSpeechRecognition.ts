import { useState, useEffect, useRef } from 'react';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn('Speech recognition not supported by this browser.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.lang = 'id-ID';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

  }, []);

  const startListening = () => {
    if (isListening || !recognitionRef.current) return;
    setIsListening(true);
    setTranscript('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!isListening || !recognitionRef.current) return;
    setIsListening(false);
    recognitionRef.current.stop();
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSpeechRecognitionSupported,
  };
};