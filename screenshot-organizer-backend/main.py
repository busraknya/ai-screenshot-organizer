from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

from model import load_inference_model, predict_image_async

# Set up logging
logger = logging.getLogger("uvicorn")

# Rate Limiter (IP 20 REQUESTS / MINUTE)
limiter = Limiter(key_func=get_remote_address)

# Colab ile %100 Uyumlu Taxonomy Mapping Sözlüğü
TAXONOMY_MAP = {
    "BABY_PRODUCTS": "Shopping & Products",
    "CLOTHING_ACCESSORIES_JEWELLERY": "Shopping & Products",
    "BEAUTY_HEALTH": "Shopping & Products",
    "GROCERY": "Shopping & Products",
    "PET_SUPPLIES": "Shopping & Products",
    "SPORTS_OUTDOOR": "Shopping & Products",
    "HOME_KITCHEN_TOOLS": "Home & Living",
    "ELECTRONICS": "Tech & Electronics",
    "HOBBY_ARTS_STATIONERY": "Work & Stationery"
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    #  (Singleton Pattern)
    try:
        load_inference_model()
    except Exception as e:
        logger.critical(f"Model yüklenemediği için sunucu başlatılamıyor: {str(e)}")
        raise e
    yield
    logger.info("FastAPI sunucusu kapatılıyor...")

app = FastAPI(
    title="AI Screenshot Organizer API (v1 - Optimized & Mapped)",
    version="1.1.0",
    lifespan=lifespan
)

# Rate limiter is connected to the app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Settings
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
        "version": "1.1.0",
        "security": "Optimized & Rate-Limited",
        "mapping": "Enabled"
    }

@app.post("/api/v1/predict")
@limiter.limit("20/minute")
async def predict_screenshot(request: Request, file: UploadFile = File(...)):
    # Extension and MIME type validation
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail="Geçersiz dosya formatı. Yalnızca görsel (image/*) dosyaları kabul edilmektedir."
        )
    
    try:
        # Read the uploaded file asynchronously
        contents = await file.read()
        
        # Check if the file is empty
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Yüklenen dosya boş.")
            
        # Predict the image class and confidence using the preloaded model
        raw_class, confidence = await predict_image_async(contents)
        
        # Taxonomy Mapping
        mapped_folder = TAXONOMY_MAP.get(raw_class, "General / Archive")
        
        logger.info(f"Başarılı tahmin -> Dosya: {file.filename} | Ham: {raw_class} | Klasör: {mapped_folder} | Güven: {confidence}")
        
        return {
            "filename": file.filename,
            "raw_prediction": raw_class,          
            "predicted_category": mapped_folder,     
            "confidence": confidence
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected server error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred on the server side while processing the image."
        )