import torch
from PIL import Image
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from configs import settings
from src.training.model import get_model
from src.preprocessing.transforms import get_val_transforms
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
    print(f"\n" + "="*50)
    print(f"[Inference] Starting analysis for video: {video_path}")
    print(f"="*50)
    
    # 1. Extract frames
    temp_frames_dir = "temp_inference_frames"
    print(f"[Inference] Extracting frames (sampling every 10th frame, max 100)...")
    frames = extract_frames(video_path, temp_frames_dir, frame_skip=10, max_frames=100)
    
    if not frames:
        print("[Inference] No frames could be extracted. Aborting.")
        return "error", 0.0, 0
        
    print(f"[Inference] Successfully extracted {len(frames)} frames.")
    
    # 2. Predict each frame
    transform = get_val_transforms()
    fake_probs = []
    
    print(f"[Inference] Injecting {len(frames)} frames into Deep Learning Engine...")
    
    with torch.no_grad():
        for i, frame_path in enumerate(frames):
            image = Image.open(frame_path).convert('RGB')
            image = transform(image).unsqueeze(0)
            outputs = model(image)
            
            # Use softmax to convert raw logits to probabilities
            probs = torch.nn.functional.softmax(outputs, dim=1)
            fake_prob = probs[0][0].item() # Assuming class 0 is 'fake'
            fake_probs.append(fake_prob)
            
            if (i + 1) % 10 == 0 or (i + 1) == len(frames):
                print(f"  -> Scanned {i + 1}/{len(frames)} frames...")
            
    # 3. Cleanup
    import shutil
    if os.path.exists(temp_frames_dir):
        shutil.rmtree(temp_frames_dir)
        print("[Inference] Cleaned up temporary frames.")
        
    # 4. Aggregation (Average Probability)
    if not fake_probs:
        return "unknown", 0.0, 0
        
    avg_fake_prob = sum(fake_probs) / len(fake_probs)
    print(f"[Inference] Aggregated Fake Probability: {avg_fake_prob * 100:.2f}%")
    
    if avg_fake_prob >= 0.5:
        prediction = "fake"
        confidence = avg_fake_prob
    else:
        prediction = "real"
        confidence = 1.0 - avg_fake_prob
        
    print(f"[Inference] FINAL RESULT: {prediction.upper()} (Confidence: {confidence * 100:.1f}%)")
    print("="*50 + "\n")
    
    return prediction, confidence, len(fake_probs)
