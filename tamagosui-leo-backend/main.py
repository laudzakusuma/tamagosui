import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from elevenlabs.client import ElevenLabs
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import google.generativeai as genai

# Muat environment variables dari file .env
load_dotenv()

# --- Inisialisasi Klien API ---
eleven_api_key = os.getenv("ELEVENLABS_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not eleven_api_key or not gemini_api_key:
    raise ValueError("Pastikan ELEVENLABS_API_KEY dan GEMINI_API_KEY sudah diatur di file .env")

eleven_client = ElevenLabs(api_key=eleven_api_key)
genai.configure(api_key=gemini_api_key)

# Inisialisasi aplikasi FastAPI
app = FastAPI()

# --- Konfigurasi CORS ---
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Data Pydantic ---
class AIInteractionRequest(BaseModel):
    prompt: str
    pet_name: str
    pet_personality: str

class SynthesizeRequest(BaseModel):
    text: str

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to LEO AI Backend (Gemini only)!"}

@app.post("/interact")
async def handle_interaction(request: AIInteractionRequest):
    print(f"Menerima prompt untuk {request.pet_name}: '{request.prompt}'")
    system_prompt = f"""
    You are an advanced AI assistant, similar to Jarvis from Iron Man,
    but with a friendly and supportive personality like a close friend.
    Be smart, helpful, and professional, but also warm, casual, and fun to talk to.
    Avoid acting like a pet or using 'meow'.
    Your name is {request.pet_name}.
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"{system_prompt}\nUser: {request.prompt}")
        ai_text_response = response.text
        print(f"Mengirim respons teks dari Gemini: {ai_text_response}")
        return {"response": ai_text_response}
    except Exception as e:
        print(f"Terjadi error saat interaksi dengan Gemini: {e}")
        raise HTTPException(status_code=500, detail="Gagal memproses permintaan AI")

@app.post("/synthesize")
async def synthesize_speech(request: SynthesizeRequest):
    print(f"Menerima teks untuk diubah menjadi suara: '{request.text}'")
    try:
        audio_stream = eleven_client.text_to_speech.convert(
            voice_id="TxGEqnHWrfWFTfGW9XjX",
            model_id="eleven_multilingual_v2",
            text=request.text
        )
        return StreamingResponse(audio_stream, media_type="audio/mpeg")
    except Exception as e:
        print(f"Terjadi error saat menghasilkan audio: {e}")
        raise HTTPException(status_code=500, detail="Gagal menghasilkan audio")