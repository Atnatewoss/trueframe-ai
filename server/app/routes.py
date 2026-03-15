from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from .inference import predict_video, load_model
from .schemas import PredictionResponse, ErrorResponse

router = APIRouter()

# Global model instance
MODEL = load_model()

@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Endpoint to predict if a video is a deepfake.
    """
    # 1. Save uploaded file temporarily
    temp_video_path = f"temp_{file.filename}"
    try:
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Run inference
        prediction, confidence, frames_checked = predict_video(temp_video_path, MODEL)
        
        if prediction == "error":
            raise HTTPException(status_code=500, detail="Inference failed")
            
        return PredictionResponse(
            filename=file.filename,
            prediction=prediction,
            confidence_info=f"{confidence*100:.1f}% positive frames",
            frames_checked=frames_checked
        )
        
    finally:
        # 3. Cleanup temp video
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
