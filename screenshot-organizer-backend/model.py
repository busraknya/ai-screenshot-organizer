import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
from pathlib import Path
import asyncio

if torch.backends.mps.is_available():
    device = torch.device("mps")
    print("Pytorch: Apple MPS (GPU) is ussed.")
elif torch.cuda.is_available():
    device = torch.device("cuda")
    print("Pytorch: CUDA (GPU) is ussed.")
else:
    device = torch.device("cpu")
    print("Pytorch: CPU is ussed.")

MODEL_PATH = Path("saved_model.pth")

model = None
class_names = []

def load_inference_model():
    global model, class_names
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"The Model File didn't found: {MODEL_PATH}, Added to main files")

print("AI Model is loading in the memory...")
checkpoint = torch.load(MODEL_PATH, map_location=device)
class_names = checkpoint['classes']
num_classes = len(class_names)

model = models.mobilenet_v2(weights=None)
model.classifier[1] = nn.Linear(model.last_channel, num_classes)

model.load_state_dict(checkpoint['model_state_dict'])
model.to(device)
model.eval()
print(f"The model is loadded. Known Classes : {class_names}")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def _sync_predict(image_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify() 
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        raise ValueError("Geçersiz veya bozuk görsel dosyası.")

    tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        confidence, predicted_idx = torch.max(probabilities, 0)
        
    return class_names[predicted_idx.item()], round(confidence.item(), 4)

async def predict_image_async(image_bytes: bytes):
    return await asyncio.to_thread(_sync_predict, image_bytes)