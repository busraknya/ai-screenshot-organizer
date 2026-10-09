from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from model import load_inference_model, predict_image

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_inference_model()
    yield
    print("The app is closing")

app = FastAPI(
    title = "AI Screenshot Organizer API",
    version = "1.0",
    lifespan = lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "AI Screenshot Organize Bacnkend (It works uv powered.)"
        }

@app.post("/api/v1/predict")
async def predict_screenhot(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code = 400, detail = "Uploadinf file  must be a image.")

    try:
        contents = await file.read()
        predict_class, confidence = predict_image(contents)

        return {
            "filename": file.filename,
            "predicted_category": predict_class,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException( status_code = 500, detail = f"An error occurred during prediction: {str(e)}")