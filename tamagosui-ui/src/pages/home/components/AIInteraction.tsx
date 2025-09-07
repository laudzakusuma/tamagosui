import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Mic, MicOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type AIInteractionProps = {
  petName: string;
  petPersonality: string;
};

export default function AIInteraction({ petName, petPersonality }: AIInteractionProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSpeechRecognitionSupported
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setPrompt(transcript);
    }
  }, [transcript]);

  const playAudio = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentPrompt = prompt;
    if (!currentPrompt || isLoading) return;

    setIsLoading(true);
    setAiResponse("");
    setPrompt("");

    try {
      const textResponse = await fetch("http://localhost:8000/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt, pet_name: petName, pet_personality: petPersonality }),
      });

      if (!textResponse.ok) throw new Error("Gagal mendapatkan respons teks dari AI.");
      const textData = await textResponse.json();
      setAiResponse(textData.response);

      const audioResponse = await fetch("http://localhost:8000/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textData.response }),
      });

      if (!audioResponse.ok) throw new Error("Gagal menghasilkan audio.");
      const audioBlob = await audioResponse.blob();
      playAudio(audioBlob);

    } catch (error) {
      console.error("Error:", error);
      setAiResponse("Oops, ada masalah saat berbicara dengan Leo");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
      if (!isListening && transcript) {
          handleSubmit();
      }
  }, [isListening, transcript]);

  return (
    <div className="w-full max-w-md mt-8">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-2">
          <Input
            placeholder={isListening ? "Mendengarkan..." : "Kirim pesan atau gunakan mikrofon..."}
            className="w-full rounded-full p-4 pr-12 bg-white/50 backdrop-blur-lg border-2 border-white/30"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          {isSpeechRecognitionSupported && (
            <Button 
              type="button" 
              onClick={isListening ? stopListening : startListening} 
              className={`rounded-full w-10 h-10 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`} 
              size="icon"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          )}
          <Button type="submit" className="rounded-full w-10 h-10" size="icon" disabled={isLoading || !prompt}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </form>

      {aiResponse && (
        <div className="mt-4 text-center p-3 bg-white/30 backdrop-blur-md rounded-lg">
          <p className="text-sm font-semibold italic">"{aiResponse}"</p>
        </div>
      )}
    </div>
  );
}