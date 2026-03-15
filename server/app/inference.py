import torch
from PIL import Image
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from configs import settings
from src.training.model import get_model
from src.preprocessing.transforms import get_transforms
from src.preprocessing.extract_frames import extract_frames

def load_model():
    """
    Loads the trained model weights.
    """
    model = get_model()
    if os.path.exists(settings.MODEL_SAVE_PATH):
        model.load_state_dict(torch.load(settings.MODEL_SAVE_PATH, map_location=torch.device('cpu')))
    model.eval()
    return model

def predict_video(video_path, model):
    """
    Full inference pipeline: video -> frames -> CNN -> aggregation -> prediction
    """
    # 1. Extract frames
    temp_frames_dir = "temp_inference_frames"
    frames = extract_frames(video_path, temp_frames_dir, frame_rate=1)
    
    if not frames:
        return "error", 0.0, 0
    
    # 2. Predict each frame
    transform = get_transforms()
    results = []
    
    with torch.no_grad():
        for frame_path in frames[:10]: # Check up to 10 frames
            image = Image.open(frame_path).convert('RGB')
            image = transform(image).unsqueeze(0)
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
            results.append(predicted.item())
            
    # 3. Cleanup
    import shutil
    if os.path.exists(temp_frames_dir):
        shutil.rmtree(temp_frames_dir)
        
    # 4. Aggregation (Majority Vote)
    if not results:
        return "unknown", 0.0, 0
        
    # Classes: 0: fake, 1: real (based on defaults)
    final_pred_idx = max(set(results), key=results.count)
    class_names = ['fake', 'real']
    
    confidence = results.count(final_pred_idx) / len(results)
    
    return class_names[final_pred_idx], confidence, len(results)
