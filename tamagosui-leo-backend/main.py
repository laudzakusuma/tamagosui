import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from elevenlabs.client import ElevenLabs
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import openai

# Muat environment variables dari file .env
load_dotenv()

# --- Inisialisasi Klien API ---
eleven_api_key = os.getenv("ELEVENLABS_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

if not eleven_api_key or not openai_api_key:
    raise ValueError("Pastikan ELEVENLABS_API_KEY dan OPENAI_API_KEY sudah diatur di file .env")

eleven_client = ElevenLabs(api_key=eleven_api_key)
# Menggunakan openai.OpenAI() lebih direkomendasikan
client = openai.OpenAI(api_key=openai_api_key)

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
    return {"status": "ok", "message": "Welcome to LEO AI Backend!"}

@app.post("/interact")
async def handle_interaction(request: AIInteractionRequest):
    print(f"Menerima prompt untuk {request.pet_name}: '{request.prompt}'")
    try:
        system_prompt = f"You are a virtual pet. {request.pet_personality}. Your name is {request.pet_name}."
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=100
        )
        ai_text_response = response.choices[0].message.content
        
        print(f"Mengirim respons teks: {ai_text_response}")
        return {"response": ai_text_response}
    except Exception as e:
        print(f"Terjadi error saat interaksi dengan OpenAI: {e}")
        raise HTTPException(status_code=500, detail="Gagal memproses permintaan AI")

@app.post("/synthesize")
async def synthesize_speech(request: SynthesizeRequest):
    print(f"Menerima teks untuk diubah menjadi suara: '{request.text}'")
    try:
        audio_stream = eleven_client.generate(
            text=request.text,
            voice="Rachel",
            model="eleven_multilingual_v2",
            stream=True
        )
        return StreamingResponse(audio_stream, media_type="audio/mpeg")
    except Exception as e:
        print(f"Terjadi error saat menghasilkan audio: {e}")
        raise HTTPException(status_code=500, detail="Gagal menghasilkan audio")