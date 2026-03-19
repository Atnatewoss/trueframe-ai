import cv2
import os

def extract_frames(video_path, output_folder, frame_skip=10, max_frames=100):
    """
    Extracts frames from a video file and saves them to a folder.
    Used for both training dataset preparation and inference.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    vidcap = cv2.VideoCapture(video_path)
    count = 0
    success = True
    
    fps = vidcap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        return []
        
    extracted_paths = []
    
    while success:
        success, image = vidcap.read()
        if success and count % frame_skip == 0:
            frame_path = os.path.join(output_folder, f"frame_{count}.jpg")
            cv2.imwrite(frame_path, image)
            extracted_paths.append(frame_path)
            
            if len(extracted_paths) >= max_frames:
                break
        count += 1
        
    vidcap.release()
    return extracted_paths
