import torchvision.transforms as transforms
import os
import sys

# Add project root to path for settings
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from configs import settings

def get_transforms():
    """
    Returns the standard transforms for training and inference.
    """
    return transforms.Compose([
        transforms.Resize(settings.IMG_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
