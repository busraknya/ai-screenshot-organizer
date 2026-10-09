from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

from model import load_inference_model, predict_image_async

# Loglama ayarı
logger = logging.getLogger("uvicorn")

# Rate Limiter (IP başına dakikada maksimum 20 tahmin isteği - DoS ve maliyet koruması)
limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Uygulama ayağa kalkarken modeli yükle (Singleton Pattern)
    try:
        load_inference_model()
    except Exception as e:
        logger.critical(f"Model yüklenemediği için sunucu başlatılamıyor: {str(e)}")
        raise e
    yield
    logger.info("FastAPI sunucusu kapatılıyor...")

app = FastAPI(
    title="AI Screenshot Organizer API (v1 - Optimized)",
    version="1.0.0",
    lifespan=lifespan
)

# Rate limiter uygulamaya bağlanıyor
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Ayarları (Geliştirme için açık, canlıda spesifik domain verilmelidir)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "version": "1.0.0",
        "security": "Optimized & Rate-Limited"
    }

@app.post("/api/v1/predict")
@limiter.limit("20/minute") # Güvenlik: Kötüye kullanım ve spam koruması
async def predict_screenshot(request: Request, file: UploadFile = File(...)):
    # 1. Uzantı / İçerik Türü Güvenlik Kontrolü
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail="Geçersiz dosya formatı. Yalnızca görsel (image/*) dosyaları kabul edilmektedir."
        )
    
    try:
        # Dosya içeriğini oku
        contents = await file.read()
        
        # Boş dosya kontrolü
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Yüklenen dosya boş.")
            
        # Asenkron ve güvenli model çıkarımı
        predicted_class, confidence = await predict_image_async(contents)
        
        logger.info(f"Başarılı tahmin -> Dosya: {file.filename} | Kategori: {predicted_class} | Güven: {confidence}")
        
        return {
            "filename": file.filename,
            "predicted_category": predicted_class,
            "confidence": confidence
        }
        
    except ValueError as ve:
        # model.py içindeki Image.verify hatası yakalanır
        raise HTTPException(status_code=422, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Beklenmeyen sunucu hatası: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Görsel işlenirken sunucu tarafında beklenmeyen bir hata oluştu."
        )